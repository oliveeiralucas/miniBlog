from collections.abc import AsyncGenerator

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token
from app.db.engine import get_session_factory
from app.db.models import User
from app.repositories.user_repository import UserRepository

_bearer = HTTPBearer(auto_error=True)
_optional_bearer = HTTPBearer(auto_error=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Yield a fresh AsyncSession per request, auto-closed on completion."""
    async with get_session_factory()() as session:
        yield session


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
    session: AsyncSession = Depends(get_db),
) -> User:
    """Require a valid JWT Bearer token and return the authenticated User.

    Raises HTTP 401 on missing, invalid, or expired token.
    """
    try:
        payload = decode_access_token(credentials.credentials)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_TOKEN", "message": "Invalid or expired access token."},
        )

    user_repo = UserRepository(session)
    user = await user_repo.get_by_id(payload["sub"])

    if not user or not user.isActive:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "INVALID_TOKEN", "message": "User not found or inactive."},
        )
    return user


async def get_current_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    """Require that the authenticated user is an admin.

    Raises HTTP 403 if the user is authenticated but not admin.
    """
    from app.core.exceptions import ForbiddenError
    if not current_user.isAdmin:
        raise ForbiddenError()
    return current_user


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(_optional_bearer),
    session: AsyncSession = Depends(get_db),
) -> User | None:
    """Return the authenticated User if a valid token is present, otherwise None.

    Used for public endpoints that show extra information when the user is logged in.
    """
    if credentials is None:
        return None
    try:
        payload = decode_access_token(credentials.credentials)
    except JWTError:
        return None

    user_repo = UserRepository(session)
    user = await user_repo.get_by_id(payload["sub"])
    return user if user and user.isActive else None
