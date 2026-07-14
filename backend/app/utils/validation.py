import re

from app.utils.errors import api_error

EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
MIN_PASSWORD_LENGTH = 6
MAX_PASSWORD_LENGTH = 128
MIN_NAME_LENGTH = 2
MAX_NAME_LENGTH = 80


def normalize_email(value: str) -> str:
    email = (value or "").strip().lower()
    if not email:
        raise api_error(400, "EMAIL_REQUIRED", "Email wajib diisi.")
    if len(email) > 254 or not EMAIL_PATTERN.fullmatch(email):
        raise api_error(400, "INVALID_EMAIL", "Format email tidak valid.")

    local_part = email.split("@", 1)[0]
    if len(local_part) > 64:
        raise api_error(400, "INVALID_EMAIL", "Format email tidak valid.")

    return email


def validate_login_password(value: str) -> str:
    password = value or ""
    if not password:
        raise api_error(400, "PASSWORD_REQUIRED", "Password wajib diisi.")
    if len(password) > MAX_PASSWORD_LENGTH:
        raise api_error(400, "PASSWORD_TOO_LONG", "Password terlalu panjang.")
    return password


def validate_new_password(value: str) -> str:
    password = validate_login_password(value)
    if len(password) < MIN_PASSWORD_LENGTH:
        raise api_error(
            400,
            "PASSWORD_TOO_SHORT",
            f"Password minimal {MIN_PASSWORD_LENGTH} karakter.",
        )
    return password


def normalize_full_name(value: str) -> str:
    full_name = " ".join((value or "").strip().split())
    if not full_name:
        raise api_error(400, "NAME_REQUIRED", "Nama wajib diisi.")
    if len(full_name) < MIN_NAME_LENGTH:
        raise api_error(
            400,
            "NAME_TOO_SHORT",
            f"Nama minimal {MIN_NAME_LENGTH} karakter.",
        )
    if len(full_name) > MAX_NAME_LENGTH:
        raise api_error(
            400,
            "NAME_TOO_LONG",
            f"Nama maksimal {MAX_NAME_LENGTH} karakter.",
        )
    return full_name
