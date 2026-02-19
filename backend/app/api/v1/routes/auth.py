from fastapi import APIRouter, Depends, Request, status
from prisma.models import User

from app.api.deps import get_current_user
from app.db.prisma_client import prisma
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


def _get_service() -> AuthService:
    return AuthService(
        user_repo=UserRepository(prisma),
        token_repo=TokenRepository(prisma),
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
async def register(
    request: Request,
    body: RegisterRequest,
) -> UserResponse:
    """Create a new user account."""
    return await _get_service().register(body)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(
    request: Request,
    body: LoginRequest,
) -> TokenResponse:
    """Authenticate and receive access + refresh tokens."""
    return await _get_service().login(body, request)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    body: LogoutRequest,
    _: User = Depends(get_current_user),
) -> None:
    """Revoke the provided refresh token."""
    await _get_service().logout(body)


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Return the currently authenticated user's profile."""
    return await _get_service().get_me(current_user.id)


@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("20/minute")
async def refresh(
    request: Request,
    body: RefreshRequest,
) -> TokenResponse:
    """Rotate the refresh token and issue a new access token."""
    return await _get_service().refresh(body, request)
