from datetime import UTC, datetime

from prisma import Prisma
from prisma.models import RefreshToken


class TokenRepository:
    def __init__(self, db: Prisma) -> None:
        self._db = db

    async def create(
        self,
        *,
        token_hash: str,
        user_id: str,
        expires_at: datetime,
        user_agent: str | None = None,
        ip_address: str | None = None,
    ) -> RefreshToken:
        return await self._db.refreshtoken.create(
            data={
                "tokenHash": token_hash,
                "userId": user_id,
                "expiresAt": expires_at,
                "userAgent": user_agent,
                "ipAddress": ip_address,
            }
        )

    async def get_active_by_hash(self, token_hash: str) -> RefreshToken | None:
        """Return the token only if it is not revoked and not expired."""
        return await self._db.refreshtoken.find_first(
            where={
                "tokenHash": token_hash,
                "revokedAt": None,
                "expiresAt": {"gt": datetime.now(UTC)},
            }
        )

    async def revoke(self, token_hash: str) -> None:
        await self._db.refreshtoken.update_many(
            where={"tokenHash": token_hash},
            data={"revokedAt": datetime.now(UTC)},
        )

    async def revoke_all_for_user(self, user_id: str) -> None:
        """Revoke all active tokens for a user (logout from all devices)."""
        await self._db.refreshtoken.update_many(
            where={"userId": user_id, "revokedAt": None},
            data={"revokedAt": datetime.now(UTC)},
        )

    async def cleanup_expired(self) -> int:
        """Delete expired tokens older than 7 days — call periodically."""
        cutoff = datetime.now(UTC).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        result = await self._db.refreshtoken.delete_many(
            where={"expiresAt": {"lt": cutoff}}
        )
        return result
