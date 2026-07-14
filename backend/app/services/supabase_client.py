import base64
import json
import logging

from supabase import create_client, Client
from supabase.lib.client_options import ClientOptions
from app.config import settings

logger = logging.getLogger(__name__)


def _safe_jwt_role(key: str) -> str:
    if not key:
        return "missing"
    if key.startswith("sb_"):
        return "secret-key"
    try:
        payload = key.split(".")[1]
        payload += "=" * (-len(payload) % 4)
        decoded = base64.urlsafe_b64decode(payload.encode("utf-8"))
        return json.loads(decoded).get("role", "unknown")
    except Exception:
        return "unknown"


class LazySupabaseClient:
    def __init__(self, key: str, label: str):
        self._key = key
        self._label = label
        self._client = None
        self._initialized = False
    
    def _get_client(self):
        if not self._initialized:
            try:
                if settings.BACKEND_DEBUG:
                    logger.debug(
                        "Supabase %s client role: %s",
                        self._label,
                        _safe_jwt_role(self._key),
                    )
                options = ClientOptions(
                    auto_refresh_token=False,
                    persist_session=False,
                )
                self._client = create_client(
                    settings.SUPABASE_URL,
                    self._key,
                    options=options,
                )
                self._initialized = True
            except Exception as e:
                logger.exception("Supabase %s initialization failed", self._label)
                self._initialized = True  # Mark as attempted to avoid repeated errors
                raise
        return self._client
    
    def __getattr__(self, name):
        if name.startswith('_'):
            return super().__getattribute__(name)
        return getattr(self._get_client(), name)

supabase = LazySupabaseClient(settings.SUPABASE_SERVICE_KEY, "service")
supabase_auth = LazySupabaseClient(settings.SUPABASE_SERVICE_KEY, "auth")
