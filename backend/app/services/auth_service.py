from starlette.requests import Request

from app.core.exceptions import (
    AccountInactiveError,
    EmailAlreadyExistsError,
    InvalidCredentialsError,
    InvalidTokenError,
    TokenRevokedError,
)
from app.core.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    refresh_token_expiry,
    verify_password,
)
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


def _user_response(user: object) -> UserResponse:
    return UserResponse(
        id=user.id,  # type: ignore[attr-defined]
        email=user.email,  # type: ignore[attr-defined]
        displayName=user.displayName,  # type: ignore[attr-defined]
        isAdmin=user.isAdmin,  # type: ignore[attr-defined]
        createdAt=user.createdAt,  # type: ignore[attr-defined]
    )


def _build_token_response(user: object, raw_refresh: str) -> TokenResponse:
    access_token = create_access_token(
        user_id=user.id,  # type: ignore[attr-defined]
        email=user.email,  # type: ignore[attr-defined]
        display_name=user.displayName,  # type: ignore[attr-defined]
    )
    return TokenResponse(
        accessToken=access_token,
        refreshToken=raw_refresh,
        user=_user_response(user),
    )


class AuthService:
    def __init__(
        self,
        user_repo: UserRepository,
        token_repo: TokenRepository,
    ) -> None:
        self._users = user_repo
        self._tokens = token_repo

    async def register(self, data: RegisterRequest) -> UserResponse:
        if await self._users.email_exists(data.email):
            raise EmailAlreadyExistsError()

        hashed = hash_password(data.password)
        user = await self._users.create(
            email=data.email,
            display_name=data.displayName,
            password_hash=hashed,
        )
        return _user_response(user)

    async def login(self, data: LoginRequest, request: Request) -> TokenResponse:
        user = await self._users.get_by_email(data.email)
        if not user or not verify_password(data.password, user.passwordHash):
            raise InvalidCredentialsError()
        if not user.isActive:
            raise AccountInactiveError()

        raw_refresh = generate_refresh_token()
        await self._tokens.create(
            token_hash=hash_refresh_token(raw_refresh),
            user_id=user.id,
            expires_at=refresh_token_expiry(),
            user_agent=request.headers.get("User-Agent"),
            ip_address=request.client.host if request.client else None,
        )
        return _build_token_response(user, raw_refresh)

    async def logout(self, data: LogoutRequest) -> None:
        token_hash = hash_refresh_token(data.refreshToken)
        await self._tokens.revoke(token_hash)

    async def refresh(self, data: RefreshRequest, request: Request) -> TokenResponse:
        token_hash = hash_refresh_token(data.refreshToken)
        stored = await self._tokens.get_active_by_hash(token_hash)

        if not stored:
            raise TokenRevokedError()

        user = await self._users.get_by_id(stored.userId)
        if not user or not user.isActive:
            raise InvalidTokenError()

        # Token rotation: revoke old, issue new
        await self._tokens.revoke(token_hash)
        raw_refresh = generate_refresh_token()
        await self._tokens.create(
            token_hash=hash_refresh_token(raw_refresh),
            user_id=user.id,
            expires_at=refresh_token_expiry(),
            user_agent=request.headers.get("User-Agent"),
            ip_address=request.client.host if request.client else None,
        )
        return _build_token_response(user, raw_refresh)

    async def get_me(self, user_id: str) -> UserResponse:
        user = await self._users.get_by_id(user_id)
        if not user:
            raise InvalidTokenError()
        return _user_response(user)
