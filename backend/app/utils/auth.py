from fastapi import Header
from app.services.supabase_client import supabase_auth
from app.utils.errors import api_error

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise api_error(401, "UNAUTHORIZED", "Token otorisasi wajib dikirim.")

    token = authorization.split(" ", 1)[1]

    try:
        response = supabase_auth.auth.get_user(token)
    except Exception as e:
        raise api_error(401, "UNAUTHORIZED", "Token tidak valid atau sudah kedaluwarsa.")

    user = getattr(response, "user", None)
    user_id = getattr(user, "id", None)

    if not user_id:
        raise api_error(401, "UNAUTHORIZED", "Token tidak valid.")

    return user_id
