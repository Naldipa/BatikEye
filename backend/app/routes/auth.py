import logging
from urllib.parse import parse_qs, urlparse

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request

from app.config import settings
from app.models.schemas import (
    AuthRequest,
    AuthResponse,
    AuthUser,
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
)
from app.services.profiles import ensure_profile_exists
from app.services.supabase_client import supabase_auth
from app.utils.auth import get_current_user
from app.utils.errors import api_error
from app.utils.rate_limit import enforce_auth_rate_limit
from app.utils.validation import (
    normalize_email,
    normalize_full_name,
    validate_login_password,
    validate_new_password,
)

router = APIRouter()
logger = logging.getLogger(__name__)

FORGOT_PASSWORD_SUCCESS_MESSAGE = "Jika email terdaftar, tautan reset password akan dikirim."
RESET_PASSWORD_SUCCESS_MESSAGE = "Password berhasil direset."
LOGIN_RATE_LIMIT_WINDOW_SECONDS = 5 * 60
LOGIN_RATE_LIMIT_PER_EMAIL = 5
LOGIN_RATE_LIMIT_PER_IP = 20
FORGOT_PASSWORD_RATE_LIMIT_WINDOW_SECONDS = 15 * 60
FORGOT_PASSWORD_RATE_LIMIT_PER_EMAIL = 3
FORGOT_PASSWORD_RATE_LIMIT_PER_IP = 10


def _error_message(error: Exception) -> str:
    return str(getattr(error, "message", None) or error)


def _is_email_already_registered(error: Exception) -> bool:
    message = _error_message(error).lower()
    return any(
        marker in message
        for marker in (
            "already registered",
            "already exists",
            "user already",
            "email already",
        )
    )


def _is_invalid_credentials(error: Exception) -> bool:
    message = _error_message(error).lower()
    return any(
        marker in message
        for marker in (
            "invalid login credentials",
            "invalid credentials",
            "invalid email or password",
        )
    )


def _log_auth_error(prefix: str, error: Exception) -> None:
    logger.warning(
        "%s type=%s status=%s message=%s",
        prefix,
        type(error).__name__,
        getattr(error, "status", None),
        getattr(error, "message", str(error)),
    )


def _log_reset_method(
    method: str,
    params: dict,
    has_email: bool,
    has_refresh_token: bool,
) -> None:
    logger.debug(
        "Reset password method=%s params=%s has_email=%s has_refresh_token=%s",
        method,
        sorted(params.keys()),
        has_email,
        has_refresh_token,
    )


def _auth_response(result, message: str) -> AuthResponse:
    user = getattr(result, "user", None)
    session = getattr(result, "session", None)

    return AuthResponse(
        message=message,
        user=AuthUser(
            id=getattr(user, "id", None),
            email=getattr(user, "email", None),
        ) if user else None,
        access_token=getattr(session, "access_token", None),
        refresh_token=getattr(session, "refresh_token", None),
        token_type=getattr(session, "token_type", "bearer") if session else "bearer",
    )


def _extract_recovery_params(raw_token: str) -> dict:
    token = (raw_token or "").strip()
    if not token:
        return {}

    parsed = urlparse(token)
    if parsed.scheme and parsed.netloc:
        params = {}
        for source in (parsed.query, parsed.fragment):
            for key, values in parse_qs(source).items():
                if values:
                    params[key] = values[0]
        return params

    if "=" in token and ("&" in token or token.startswith(("code=", "token=", "token_hash=", "access_token="))):
        return {
            key: values[0]
            for key, values in parse_qs(token.lstrip("#?")).items()
            if values
        }

    return {"token": token}


def _looks_like_jwt(value: str) -> bool:
    return bool(value) and value.count(".") == 2


def _update_password_with_access_token(access_token: str, password: str) -> None:
    headers = {
        "apikey": settings.SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {access_token}",
    }
    response = httpx.put(
        f"{settings.SUPABASE_URL}/auth/v1/user",
        json={"password": password},
        headers=headers,
        timeout=20,
    )
    response.raise_for_status()


def _update_password_with_session_tokens(
    access_token: str,
    refresh_token: str,
    password: str,
) -> None:
    result = supabase_auth.auth.set_session(access_token, refresh_token)
    session = getattr(result, "session", None)
    session_access_token = getattr(session, "access_token", None)
    if not session_access_token:
        raise ValueError("Session reset password tidak valid")
    _update_password_with_access_token(session_access_token, password)


def _reset_password_with_recovery_token(payload: ResetPasswordRequest) -> None:
    params = _extract_recovery_params(payload.token)
    code = payload.code or params.get("code")
    access_token = payload.access_token or params.get("access_token")
    refresh_token = payload.refresh_token or params.get("refresh_token")
    token_hash = payload.token_hash or params.get("token_hash")
    token = params.get("token")
    email = (payload.email or params.get("email") or "").strip()
    if email:
        email = normalize_email(email)

    if access_token:
        _log_reset_method("access_token", params, bool(email), bool(refresh_token))
        if refresh_token:
            _update_password_with_session_tokens(
                access_token,
                refresh_token,
                payload.password,
            )
        else:
            _update_password_with_access_token(access_token, payload.password)
        return

    if code:
        _log_reset_method("code", params, bool(email), bool(refresh_token))
        if not payload.code_verifier:
            raise api_error(
                400,
                "RESET_TOKEN_INVALID",
                (
                    "Link reset password mengirim code PKCE. Backend membutuhkan "
                    "code_verifier untuk menukar code menjadi session. Alternatif: "
                    "gunakan Supabase JS di frontend untuk exchangeCodeForSession lalu "
                    "kirim access_token ke endpoint ini."
                ),
            )
        result = supabase_auth.auth.exchange_code_for_session({
            "auth_code": code,
            "code_verifier": payload.code_verifier,
        })
        session = getattr(result, "session", None)
        access_token = getattr(session, "access_token", None)
        if not access_token:
            raise ValueError("Recovery code tidak menghasilkan session")
        _update_password_with_access_token(access_token, payload.password)
        return

    if token_hash:
        _log_reset_method("token_hash", params, bool(email), bool(refresh_token))
        result = supabase_auth.auth.verify_otp({
            "token_hash": token_hash,
            "type": "recovery",
        })
        session = getattr(result, "session", None)
        access_token = getattr(session, "access_token", None)
        if not access_token:
            raise ValueError("Recovery token tidak menghasilkan session")
        _update_password_with_access_token(access_token, payload.password)
        return

    if token and refresh_token:
        _log_reset_method("session_tokens", params, bool(email), True)
        _update_password_with_session_tokens(
            token,
            refresh_token,
            payload.password,
        )
        return

    if token and _looks_like_jwt(token):
        _log_reset_method("access_token_in_token", params, bool(email), False)
        _update_password_with_access_token(token, payload.password)
        return

    if token and token.isdigit() and not email:
        raise api_error(
            400,
            "RESET_TOKEN_EMAIL_REQUIRED",
            "Email wajib dikirim bersama token OTP.",
        )

    if token:
        _log_reset_method(
            "token_with_email" if email else "token_as_token_hash",
            params,
            bool(email),
            bool(refresh_token),
        )
        if email:
            verify_payload = {
                "email": email,
                "token": token,
                "type": "recovery",
            }
        else:
            verify_payload = {
                "token_hash": token,
                "type": "recovery",
            }
        result = supabase_auth.auth.verify_otp(verify_payload)
        session = getattr(result, "session", None)
        access_token = getattr(session, "access_token", None)
        if not access_token:
            raise ValueError("Recovery token tidak menghasilkan session")
        _update_password_with_access_token(access_token, payload.password)
        return

    raise api_error(400, "RESET_TOKEN_INVALID", "Token reset password tidak valid.")


@router.post("/register", response_model=AuthResponse)
async def register(payload: AuthRequest):
    email = normalize_email(payload.email)
    password = validate_new_password(payload.password)
    full_name = normalize_full_name(payload.full_name or payload.name)

    try:
        options = {
            "data": {
                "full_name": full_name,
                "name": full_name,
            }
        }

        result = supabase_auth.auth.sign_up({
            "email": email,
            "password": password,
            "options": options,
        })
        user = getattr(result, "user", None)
        user_id = getattr(user, "id", None)
        if user_id:
            ensure_profile_exists(user_id, email, full_name)
        return _auth_response(result, "Registrasi berhasil")
    except Exception as e:
        if _is_email_already_registered(e):
            raise api_error(
                400,
                "EMAIL_ALREADY_REGISTERED",
                "Email sudah terdaftar.",
            )
        raise api_error(400, "REGISTER_FAILED", "Registrasi gagal.")


@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(request: Request, payload: ForgotPasswordRequest):
    email = normalize_email(payload.email)
    redirect_url = (payload.redirect_url or "").strip() or None
    enforce_auth_rate_limit(
        "forgot_password",
        request,
        email,
        ip_limit=FORGOT_PASSWORD_RATE_LIMIT_PER_IP,
        identifier_limit=FORGOT_PASSWORD_RATE_LIMIT_PER_EMAIL,
        window_seconds=FORGOT_PASSWORD_RATE_LIMIT_WINDOW_SECONDS,
    )

    try:
        supabase_auth.auth.reset_password_email(
            email,
            {"redirect_to": redirect_url} if redirect_url else {},
        )
    except Exception as e:
        _log_auth_error("FORGOT_PASSWORD_ERROR", e)
        raise api_error(
            503,
            "FORGOT_PASSWORD_FAILED",
            "Gagal mengirim tautan reset password.",
        )

    return MessageResponse(message=FORGOT_PASSWORD_SUCCESS_MESSAGE)


@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(payload: ResetPasswordRequest):
    has_reset_token = any(
        (value or "").strip()
        for value in (
            payload.token,
            payload.access_token,
            payload.token_hash,
            payload.code,
        )
    )
    if not has_reset_token:
        raise api_error(
            400,
            "RESET_TOKEN_REQUIRED",
            "Token reset password wajib diisi.",
        )
    payload.password = validate_new_password(payload.password)

    try:
        _reset_password_with_recovery_token(payload)
    except HTTPException:
        raise
    except httpx.HTTPStatusError as e:
        status_code = getattr(getattr(e, "response", None), "status_code", None)
        code = "RESET_TOKEN_EXPIRED" if status_code in {400, 401, 403} else "RESET_PASSWORD_FAILED"
        raise api_error(
            400,
            code,
            "Token reset password tidak valid atau sudah kedaluwarsa.",
        )
    except Exception as e:
        _log_auth_error("RESET_PASSWORD_ERROR", e)
        raise api_error(
            400,
            "RESET_TOKEN_INVALID",
            "Token reset password tidak valid atau sudah kedaluwarsa.",
        )

    return MessageResponse(message=RESET_PASSWORD_SUCCESS_MESSAGE)


@router.post("/login", response_model=AuthResponse)
async def login(request: Request, payload: AuthRequest):
    email = normalize_email(payload.email)
    password = validate_login_password(payload.password)
    enforce_auth_rate_limit(
        "login",
        request,
        email,
        ip_limit=LOGIN_RATE_LIMIT_PER_IP,
        identifier_limit=LOGIN_RATE_LIMIT_PER_EMAIL,
        window_seconds=LOGIN_RATE_LIMIT_WINDOW_SECONDS,
    )

    try:
        result = supabase_auth.auth.sign_in_with_password({
            "email": email,
            "password": password,
        })
    except Exception as e:
        if _is_invalid_credentials(e):
            raise api_error(401, "INVALID_CREDENTIALS", "Email atau password salah.")
        raise api_error(401, "LOGIN_FAILED", "Login gagal.")

    if not getattr(result, "session", None):
        raise api_error(401, "LOGIN_FAILED", "Login gagal.")

    user = getattr(result, "user", None)
    user_id = getattr(user, "id", None)
    metadata = getattr(user, "user_metadata", None) or {}
    if user_id:
        ensure_profile_exists(
            user_id,
            getattr(user, "email", None) or email,
            metadata.get("full_name") or metadata.get("name"),
        )

    return _auth_response(result, "Login berhasil")


@router.get("/me")
async def me(user_id: str = Depends(get_current_user)):
    return {"user_id": user_id}


@router.post("/logout")
async def logout():
    return {"message": "Logout berhasil"}
