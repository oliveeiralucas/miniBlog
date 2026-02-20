from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse


class AppException(HTTPException):
    """Base exception for all application-level errors.

    Provides a structured ``{ code, message }`` detail instead of a plain string.
    """

    def __init__(self, status_code: int, code: str, message: str) -> None:
        super().__init__(
            status_code=status_code,
            detail={"code": code, "message": message},
        )


# ─── 400 Bad Request ──────────────────────────────────────────────────────────


class PasswordMismatchError(AppException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_400_BAD_REQUEST,
            "PASSWORD_MISMATCH",
            "The passwords do not match.",
        )


# ─── 401 Unauthorized ─────────────────────────────────────────────────────────


class InvalidCredentialsError(AppException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_401_UNAUTHORIZED,
            "INVALID_CREDENTIALS",
            "Email or password is incorrect.",
        )


class InvalidTokenError(AppException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_401_UNAUTHORIZED,
            "INVALID_TOKEN",
            "The provided token is invalid or has expired.",
        )


class TokenRevokedError(AppException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_401_UNAUTHORIZED,
            "TOKEN_REVOKED",
            "The refresh token has been revoked.",
        )


# ─── 403 Forbidden ────────────────────────────────────────────────────────────


class ForbiddenError(AppException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_403_FORBIDDEN,
            "FORBIDDEN",
            "You do not have permission to perform this action.",
        )


class AccountInactiveError(AppException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_403_FORBIDDEN,
            "ACCOUNT_INACTIVE",
            "This account has been deactivated.",
        )


# ─── 404 Not Found ────────────────────────────────────────────────────────────


class PostNotFoundError(AppException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_404_NOT_FOUND,
            "POST_NOT_FOUND",
            "The requested post was not found.",
        )


class CommentNotFoundError(AppException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_404_NOT_FOUND,
            "COMMENT_NOT_FOUND",
            "The requested comment was not found.",
        )


# ─── 409 Conflict ─────────────────────────────────────────────────────────────


class EmailAlreadyExistsError(AppException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_409_CONFLICT,
            "EMAIL_TAKEN",
            "An account with this email already exists.",
        )


# ─── 404 Not Found (Projects) ─────────────────────────────────────────────────


class ProjectNotFoundError(AppException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_404_NOT_FOUND,
            "PROJECT_NOT_FOUND",
            "The requested project was not found.",
        )


# ─── 409 Conflict (Projects) ──────────────────────────────────────────────────


class ProjectSlugTakenError(AppException):
    def __init__(self) -> None:
        super().__init__(
            status.HTTP_409_CONFLICT,
            "SLUG_TAKEN",
            "A project with this slug already exists.",
        )


# ─── Exception Handlers ───────────────────────────────────────────────────────


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppException)
    async def app_exception_handler(
        request: Request, exc: AppException
    ) -> JSONResponse:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)

    @app.exception_handler(Exception)
    async def generic_exception_handler(
        request: Request, exc: Exception
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={"code": "INTERNAL_ERROR", "message": "An unexpected error occurred."},
        )
