import os
from pathlib import Path
from urllib.parse import urlparse

from dotenv import load_dotenv

PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env", override=False)

DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:4173",
    "http://127.0.0.1:3000",
]
LOCAL_HOSTNAMES = {"localhost", "127.0.0.1", "0.0.0.0"}
PRODUCTION_ENVIRONMENTS = {"prod", "production"}


def parse_csv_env(value: str | None, default: list[str]) -> list[str]:
    if not value:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]


def parse_bool_env(value: str | None, default: bool = False) -> bool:
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def resolve_project_path(value: str) -> str:
    path = Path(value)
    if path.is_absolute():
        return str(path)
    return str((PROJECT_ROOT / path).resolve())


def is_local_origin(origin: str) -> bool:
    parsed = urlparse(origin)
    return (parsed.hostname or "").lower() in LOCAL_HOSTNAMES


def looks_like_placeholder(value: str | None) -> bool:
    if not value:
        return False
    lowered = value.lower()
    return any(
        marker in lowered
        for marker in ("your_", "your-", "example", "changeme", "placeholder", "xxx")
    )


class Settings:
    def __init__(self):
        self.ENVIRONMENT = (
            os.getenv("ENVIRONMENT")
            or os.getenv("APP_ENV")
            or "development"
        ).strip().lower()
        self.IS_PRODUCTION = self.ENVIRONMENT in PRODUCTION_ENVIRONMENTS

        self.SUPABASE_URL = os.getenv("SUPABASE_URL")
        self.SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
        self.SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")
        self.SUPABASE_UPLOAD_BUCKET = os.getenv("SUPABASE_UPLOAD_BUCKET", "uploads")
        self.MODEL_PATH = resolve_project_path(
            os.getenv("MODEL_PATH", "./models/model_Newbatik_saved")
        )
        self.BACKEND_DEBUG = parse_bool_env(os.getenv("BACKEND_DEBUG"), False)
        self.CORS_ORIGINS = parse_csv_env(
            os.getenv("CORS_ORIGINS", ""),
            DEFAULT_CORS_ORIGINS,
        )
        self.CORS_ALLOW_METHODS = ["GET", "POST", "OPTIONS"]
        self.CORS_ALLOW_HEADERS = [
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With",
        ]
        self.validate()

    def validate(self) -> None:
        missing = [
            name
            for name, value in {
                "SUPABASE_URL": self.SUPABASE_URL,
                "SUPABASE_SERVICE_ROLE_KEY": self.SUPABASE_SERVICE_KEY,
                "SUPABASE_UPLOAD_BUCKET": self.SUPABASE_UPLOAD_BUCKET,
                "MODEL_PATH": self.MODEL_PATH,
            }.items()
            if not value
        ]
        if missing:
            raise RuntimeError(
                "Environment variable wajib belum diisi: "
                + ", ".join(sorted(missing))
            )

        if "*" in self.CORS_ORIGINS:
            raise RuntimeError(
                "CORS_ORIGINS tidak boleh memakai '*' karena credentials aktif."
            )

        if self.IS_PRODUCTION:
            if self.BACKEND_DEBUG:
                raise RuntimeError("BACKEND_DEBUG harus false di production.")

            local_origins = [
                origin for origin in self.CORS_ORIGINS if is_local_origin(origin)
            ]
            if local_origins:
                raise RuntimeError(
                    "CORS_ORIGINS production tidak boleh berisi localhost/127.0.0.1."
                )

            placeholder_vars = [
                name
                for name, value in {
                    "SUPABASE_URL": self.SUPABASE_URL,
                    "SUPABASE_SERVICE_ROLE_KEY": self.SUPABASE_SERVICE_KEY,
                    "SUPABASE_ANON_KEY": self.SUPABASE_ANON_KEY,
                }.items()
                if looks_like_placeholder(value)
            ]
            if placeholder_vars:
                raise RuntimeError(
                    "Environment variable production masih placeholder: "
                    + ", ".join(sorted(placeholder_vars))
                )

            if not Path(self.MODEL_PATH).exists():
                raise RuntimeError(
                    f"MODEL_PATH tidak ditemukan: {self.MODEL_PATH}"
                )


settings = Settings()
