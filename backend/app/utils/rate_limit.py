import hashlib
import math
import time
from collections import defaultdict, deque
from threading import Lock

from fastapi import Request

from app.utils.errors import api_error


class SlidingWindowRateLimiter:
    def __init__(self):
        self._hits = defaultdict(deque)
        self._lock = Lock()

    def hit(self, key: str, limit: int, window_seconds: int) -> None:
        now = time.monotonic()
        cutoff = now - window_seconds

        with self._lock:
            hits = self._hits[key]
            while hits and hits[0] <= cutoff:
                hits.popleft()

            if len(hits) >= limit:
                retry_after = max(1, math.ceil(window_seconds - (now - hits[0])))
                raise api_error(
                    429,
                    "RATE_LIMITED",
                    "Terlalu banyak percobaan.",
                    headers={"Retry-After": str(retry_after)},
                )

            hits.append(now)


auth_rate_limiter = SlidingWindowRateLimiter()


def _hash_key(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _client_ip(request: Request) -> str:
    if request.client and request.client.host:
        return request.client.host
    return "unknown"


def enforce_auth_rate_limit(
    scope: str,
    request: Request,
    identifier: str,
    ip_limit: int,
    identifier_limit: int,
    window_seconds: int,
) -> None:
    ip = _client_ip(request)
    normalized_identifier = (identifier or "anonymous").strip().lower()

    auth_rate_limiter.hit(
        f"{scope}:ip:{_hash_key(ip)}",
        ip_limit,
        window_seconds,
    )
    auth_rate_limiter.hit(
        f"{scope}:identifier:{_hash_key(normalized_identifier)}",
        identifier_limit,
        window_seconds,
    )
