from prisma import Prisma
from prisma.models import User


class UserRepository:
    def __init__(self, db: Prisma) -> None:
        self._db = db

    async def get_by_id(self, user_id: str) -> User | None:
        return await self._db.user.find_unique(where={"id": user_id})

    async def get_by_email(self, email: str) -> User | None:
        return await self._db.user.find_unique(where={"email": email})

    async def create(
        self,
        *,
        email: str,
        display_name: str,
        password_hash: str,
    ) -> User:
        return await self._db.user.create(
            data={
                "email": email,
                "displayName": display_name,
                "passwordHash": password_hash,
            }
        )

    async def email_exists(self, email: str) -> bool:
        count = await self._db.user.count(where={"email": email})
        return count > 0
