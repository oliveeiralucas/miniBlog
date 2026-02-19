"""Unit tests for core security utilities."""

import pytest
from jose import JWTError

from app.core.security import (
    create_access_token,
    decode_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)


class TestPasswordHashing:
    def test_hash_is_not_plain(self) -> None:
        hashed = hash_password("secret")
        assert hashed != "secret"

    def test_verify_correct_password(self) -> None:
        hashed = hash_password("correct")
        assert verify_password("correct", hashed) is True

    def test_verify_wrong_password(self) -> None:
        hashed = hash_password("correct")
        assert verify_password("wrong", hashed) is False

    def test_two_hashes_are_different(self) -> None:
        h1 = hash_password("same")
        h2 = hash_password("same")
        assert h1 != h2  # bcrypt uses random salt


class TestJWT:
    def test_create_and_decode_token(self) -> None:
        token = create_access_token("user-1", "a@b.com", "Alice")
        payload = decode_access_token(token)
        assert payload["sub"] == "user-1"
        assert payload["email"] == "a@b.com"
        assert payload["display_name"] == "Alice"
        assert payload["type"] == "access"

    def test_tampered_token_raises(self) -> None:
        token = create_access_token("user-1", "a@b.com", "Alice")
        tampered = token[:-4] + "XXXX"
        with pytest.raises(JWTError):
            decode_access_token(tampered)


class TestRefreshToken:
    def test_generate_is_unique(self) -> None:
        t1 = generate_refresh_token()
        t2 = generate_refresh_token()
        assert t1 != t2

    def test_hash_is_deterministic(self) -> None:
        raw = "some-token"
        assert hash_refresh_token(raw) == hash_refresh_token(raw)

    def test_different_tokens_produce_different_hashes(self) -> None:
        assert hash_refresh_token("a") != hash_refresh_token("b")
