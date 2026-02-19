"""Shared pytest fixtures for unit and integration tests."""

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.security import create_access_token, hash_password
from app.main import app


@pytest.fixture
async def client() -> AsyncClient:
    """Async test client that talks directly to the ASGI app (no network)."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest.fixture
def sample_password() -> str:
    return "TestPassword123"


@pytest.fixture
def sample_password_hash(sample_password: str) -> str:
    return hash_password(sample_password)


def make_auth_headers(user_id: str, email: str, display_name: str) -> dict[str, str]:
    """Build Authorization header with a valid access token for tests."""
    token = create_access_token(
        user_id=user_id, email=email, display_name=display_name
    )
    return {"Authorization": f"Bearer {token}"}
