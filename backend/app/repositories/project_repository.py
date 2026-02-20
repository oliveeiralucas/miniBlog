from __future__ import annotations

from sqlalchemy import delete, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Project


class ProjectRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def find_many(
        self,
        *,
        featured_only: bool = False,
        skip: int = 0,
        take: int = 50,
    ) -> tuple[list[Project], int]:
        base_query = select(Project)
        if featured_only:
            base_query = base_query.where(Project.featured.is_(True))

        count_query = select(func.count()).select_from(
            base_query.order_by(None).subquery()
        )
        total_result = await self._session.execute(count_query)
        total: int = total_result.scalar_one()

        data_query = (
            base_query
            .order_by(Project.year.desc(), Project.createdAt.desc())
            .offset(skip)
            .limit(take)
        )
        result = await self._session.execute(data_query)
        return list(result.scalars().all()), total

    async def get_by_id(self, project_id: str) -> Project | None:
        result = await self._session.execute(
            select(Project).where(Project.id == project_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Project | None:
        result = await self._session.execute(
            select(Project).where(Project.slug == slug)
        )
        return result.scalar_one_or_none()

    async def slug_exists(self, slug: str, exclude_id: str | None = None) -> bool:
        query = select(Project.id).where(Project.slug == slug)
        if exclude_id:
            query = query.where(Project.id != exclude_id)
        result = await self._session.execute(query)
        return result.scalar_one_or_none() is not None

    async def create(self, *, data: dict) -> Project:
        project = Project(**data)
        self._session.add(project)
        await self._session.commit()
        await self._session.refresh(project)
        return project

    async def update(self, project_id: str, *, data: dict) -> Project:
        if data:
            await self._session.execute(
                update(Project).where(Project.id == project_id).values(**data)
            )
            await self._session.commit()
        project = await self.get_by_id(project_id)
        assert project is not None
        return project

    async def delete(self, project_id: str) -> None:
        await self._session.execute(
            delete(Project).where(Project.id == project_id)
        )
        await self._session.commit()
