from datetime import UTC, datetime

from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import RefreshToken


class TokenRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def create(
        self,
        *,
        token_hash: str,
        user_id: str,
        expires_at: datetime,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> RefreshToken:
        token = RefreshToken(
            tokenHash=token_hash,
            userId=user_id,
            expiresAt=expires_at,
            userAgent=user_agent,
            ipAddress=ip_address,
        )
        self._session.add(token)
        await self._session.commit()
        await self._session.refresh(token)
        return token

    async def get_active_by_hash(self, token_hash: str) -> RefreshToken | None:
        """Return the token only if it is not revoked and not expired."""
        now = datetime.now(UTC)
        result = await self._session.execute(
            select(RefreshToken).where(
                RefreshToken.tokenHash == token_hash,
                RefreshToken.revokedAt.is_(None),
                RefreshToken.expiresAt > now,
            )
        )
        return result.scalar_one_or_none()

    async def revoke(self, token_hash: str) -> None:
        await self._session.execute(
            update(RefreshToken)
            .where(RefreshToken.tokenHash == token_hash)
            .values(revokedAt=datetime.now(UTC))
        )
        await self._session.commit()

    async def revoke_all_for_user(self, user_id: str) -> None:
        """Revoke all active tokens for a user (logout from all devices)."""
        await self._session.execute(
            update(RefreshToken)
            .where(
                RefreshToken.userId == user_id,
                RefreshToken.revokedAt.is_(None),
            )
            .values(revokedAt=datetime.now(UTC))
        )
        await self._session.commit()

    async def cleanup_expired(self) -> int:
        """Delete expired tokens older than 7 days — call periodically."""
        cutoff = datetime.now(UTC).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        result = await self._session.execute(
            delete(RefreshToken).where(RefreshToken.expiresAt < cutoff)
        )
        await self._session.commit()
        return result.rowcount
