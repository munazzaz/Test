import json
import os
import time
from typing import Optional

try:
    import redis  # type: ignore
except ImportError:  # redis is optional; we fall back to in-memory
    redis = None  # type: ignore


class Cache:
    """
    Very small cache wrapper.

    - If REDIS_URL is set and redis is installed -> use Redis.
    - Otherwise -> use an in-memory dict (good enough for local dev).
    """

    def __init__(self) -> None:
        self._local: dict[str, tuple[str, Optional[float]]] = {}
        url = os.getenv("REDIS_URL")
        self._use_redis = bool(url and redis is not None)
        self._client = redis.from_url(url) if self._use_redis else None  # type: ignore

    def get(self, key: str) -> Optional[str]:
        if self._use_redis and self._client:
            value = self._client.get(key)
            return value.decode("utf-8") if value else None

        # in-memory fallback
        item = self._local.get(key)
        if not item:
            return None
        value, expires_at = item
        if expires_at is not None and expires_at < time.time():
            self._local.pop(key, None)
            return None
        return value

    def set(self, key: str, value: str, ttl_seconds: int = 3600) -> None:
        if self._use_redis and self._client:
            self._client.setex(key, ttl_seconds, value)
            return

        # in-memory fallback
        expires_at = time.time() + ttl_seconds if ttl_seconds else None
        self._local[key] = (value, expires_at)


cache = Cache()
