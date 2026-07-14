import logging
from typing import Any

from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


def api_error(
    status_code: int,
    code: str,
    detail: str,
    headers: dict[str, str] | None = None,
) -> HTTPException:
    return HTTPException(
        status_code=status_code,
        detail={"code": code, "detail": detail},
        headers=headers,
    )


def default_error_code(status_code: int) -> str:
    if status_code == 401:
        return "UNAUTHORIZED"
    if status_code == 403:
        return "FORBIDDEN"
    if status_code == 404:
        return "NOT_FOUND"
    if status_code == 429:
        return "RATE_LIMITED"
    if status_code == 503:
        return "SERVICE_UNAVAILABLE"
    if status_code >= 500:
        return "INTERNAL_ERROR"
    return "BAD_REQUEST"


def _content_from_detail(detail: Any, status_code: int) -> dict[str, str]:
    if isinstance(detail, dict):
        code = (
            detail.get("code")
            or detail.get("error_code")
            or detail.get("errorCode")
        )
        message = detail.get("detail") or detail.get("message")
        nested_error = detail.get("error")
        if not code and isinstance(nested_error, dict):
            code = nested_error.get("code")
        if code:
            return {
                "code": str(code),
                "detail": str(message or "Terjadi kesalahan."),
            }

    return {
        "code": default_error_code(status_code),
        "detail": str(detail or "Terjadi kesalahan."),
    }


def _validation_error_content(
    request: Request,
    exc: RequestValidationError,
) -> tuple[int, dict[str, str]]:
    path = request.url.path
    errors = exc.errors()
    missing_fields = {
        str(error.get("loc", [""])[-1])
        for error in errors
        if error.get("type") == "missing"
    }

    if path.endswith("/api/predict") and "file" in missing_fields:
        return 400, {
            "code": "FILE_REQUIRED",
            "detail": "File gambar wajib diunggah.",
        }

    if path.endswith(("/api/register", "/api/login")):
        if "email" in missing_fields:
            return 400, {"code": "EMAIL_REQUIRED", "detail": "Email wajib diisi."}
        if "password" in missing_fields:
            return 400, {
                "code": "PASSWORD_REQUIRED",
                "detail": "Password wajib diisi.",
            }

    if path.endswith("/api/forgot-password") and "email" in missing_fields:
        return 400, {"code": "EMAIL_REQUIRED", "detail": "Email wajib diisi."}

    if path.endswith("/api/reset-password") and "password" in missing_fields:
        return 400, {
            "code": "PASSWORD_REQUIRED",
            "detail": "Password wajib diisi.",
        }

    return 400, {"code": "BAD_REQUEST", "detail": "Request tidak valid."}


async def api_exception_handler(
    request: Request,
    exc: StarletteHTTPException,
) -> JSONResponse:
    status_code = getattr(exc, "status_code", 500)
    content = _content_from_detail(getattr(exc, "detail", None), status_code)
    return JSONResponse(
        status_code=status_code,
        content=content,
        headers=getattr(exc, "headers", None),
    )


async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    status_code, content = _validation_error_content(request, exc)
    return JSONResponse(status_code=status_code, content=content)


async def unhandled_exception_handler(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    logger.exception("Unhandled server error")
    return JSONResponse(
        status_code=500,
        content={
            "code": "INTERNAL_ERROR",
            "detail": "Terjadi kesalahan server.",
        },
    )
