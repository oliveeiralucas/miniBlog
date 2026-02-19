from sqlalchemy import exists, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import User


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, user_id: str) -> User | None:
        result = await self._session.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        result = await self._session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()

    async def create(
        self,
        *,
        email: str,
        display_name: str,
        password_hash: str,
    ) -> User:
        user = User(
            email=email,
            displayName=display_name,
            passwordHash=password_hash,
        )
        self._session.add(user)
        await self._session.commit()
        await self._session.refresh(user)
        return user

    async def email_exists(self, email: str) -> bool:
        result = await self._session.execute(
            select(exists().where(User.email == email))
        )
        return result.scalar_one()
