import hashlib
import uuid
from datetime import UTC, datetime, timedelta
from typing import Any

import bcrypt
from jose import JWTError, jwt

from app.core.config import get_settings

_settings = get_settings()

# ─── Password ─────────────────────────────────────────────────────────────────


def hash_password(plain: str) -> str:
    """Return a bcrypt hash of *plain*."""
    salt = bcrypt.gensalt(rounds=_settings.BCRYPT_ROUNDS)
    return bcrypt.hashpw(plain.encode(), salt).decode()


def verify_password(plain: str, hashed: str) -> bool:
    """Return True if *plain* matches *hashed*."""
    return bcrypt.checkpw(plain.encode(), hashed.encode())


# ─── Access Token (JWT) ───────────────────────────────────────────────────────


def create_access_token(
    user_id: str,
    email: str,
    display_name: str,
) -> str:
    """Return a signed JWT access token valid for ACCESS_TOKEN_EXPIRE_MINUTES."""
    expires_at = datetime.now(UTC) + timedelta(
        minutes=_settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload: dict[str, Any] = {
        "sub": user_id,
        "email": email,
        "display_name": display_name,
        "type": "access",
        "exp": expires_at,
        "iat": datetime.now(UTC),
    }
    return jwt.encode(payload, _settings.SECRET_KEY, algorithm=_settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    """Decode and validate a JWT access token.

    Raises ``JWTError`` on invalid / expired tokens — callers should convert
    this to an HTTP 401 response.
    """
    payload = jwt.decode(
        token,
        _settings.SECRET_KEY,
        algorithms=[_settings.JWT_ALGORITHM],
    )
    if payload.get("type") != "access":
        raise JWTError("Invalid token type")
    return payload


# ─── Refresh Token (opaque UUID) ─────────────────────────────────────────────


def generate_refresh_token() -> str:
    """Return a cryptographically random refresh token (UUID v4)."""
    return str(uuid.uuid4())


def hash_refresh_token(raw_token: str) -> str:
    """Return the SHA-256 hex digest of *raw_token* for safe DB storage."""
    return hashlib.sha256(raw_token.encode()).hexdigest()


def refresh_token_expiry() -> datetime:
    """Return the expiry datetime for a new refresh token."""
    return datetime.now(UTC) + timedelta(days=_settings.REFRESH_TOKEN_EXPIRE_DAYS)
