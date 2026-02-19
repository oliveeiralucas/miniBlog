from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.db.models import User
from app.middleware.rate_limit import limiter
from app.repositories.token_repository import TokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import (
    LoginRequest,
    LogoutRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


def _get_service(session: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(
        user_repo=UserRepository(session),
        token_repo=TokenRepository(session),
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(
    request: Request,
    body: RegisterRequest,
    service: AuthService = Depends(_get_service),
) -> UserResponse:
    """Create a new user account."""
    return await service.register(body)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(
    request: Request,
    body: LoginRequest,
    service: AuthService = Depends(_get_service),
) -> TokenResponse:
    """Authenticate and receive access + refresh tokens."""
    return await service.login(body, request)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    body: LogoutRequest,
    _: User = Depends(get_current_user),
    service: AuthService = Depends(_get_service),
) -> None:
    """Revoke the provided refresh token."""
    await service.logout(body)


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
    service: AuthService = Depends(_get_service),
) -> UserResponse:
    """Return the currently authenticated user's profile."""
    return await service.get_me(current_user.id)


@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("20/minute")
async def refresh(
    request: Request,
    body: RefreshRequest,
    service: AuthService = Depends(_get_service),
) -> TokenResponse:
    """Rotate the refresh token and issue a new access token."""
    return await service.refresh(body, request)
