from __future__ import annotations

from app.db.models import Project
from app.repositories.project_repository import ProjectRepository
from app.schemas.common import PaginatedResponse
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate


def _to_response(project: Project) -> ProjectResponse:
    return ProjectResponse(
        id=project.id,
        slug=project.slug,
        title=project.title,
        tagline=project.tagline,
        description=project.description,
        category=project.category,
        url=project.url,
        githubUrl=project.githubUrl,
        image=project.image,
        tags=project.tags or [],
        techStack=project.techStack or [],
        stats=project.stats or [],
        features=project.features or [],
        year=project.year,
        featured=project.featured,
        createdAt=project.createdAt,
        updatedAt=project.updatedAt,
    )


class ProjectService:
    def __init__(self, project_repo: ProjectRepository) -> None:
        self._projects = project_repo

    async def get_projects(
        self,
        *,
        featured_only: bool = False,
        page: int = 1,
        size: int = 50,
    ) -> PaginatedResponse[ProjectResponse]:
        projects, total = await self._projects.find_many(
            featured_only=featured_only,
            skip=(page - 1) * size,
            take=size,
        )
        items = [_to_response(p) for p in projects]
        return PaginatedResponse.build(items=items, total=total, page=page, size=size)

    async def get_project(self, slug: str) -> ProjectResponse:
        from app.core.exceptions import ProjectNotFoundError
        project = await self._projects.get_by_slug(slug)
        if not project:
            raise ProjectNotFoundError()
        return _to_response(project)

    async def create_project(self, data: ProjectCreate) -> ProjectResponse:
        from app.core.exceptions import ProjectSlugTakenError
        if await self._projects.slug_exists(data.slug):
            raise ProjectSlugTakenError()
        payload = data.model_dump()
        payload["techStack"] = [item.model_dump() for item in (data.techStack or [])]
        payload["stats"] = [item.model_dump() for item in (data.stats or [])]
        project = await self._projects.create(data=payload)
        return _to_response(project)

    async def update_project(
        self, project_id: str, data: ProjectUpdate
    ) -> ProjectResponse:
        from app.core.exceptions import ProjectNotFoundError, ProjectSlugTakenError
        project = await self._projects.get_by_id(project_id)
        if not project:
            raise ProjectNotFoundError()
        if data.slug and await self._projects.slug_exists(data.slug, exclude_id=project_id):
            raise ProjectSlugTakenError()
        update_dict: dict = {}
        for field, value in data.model_dump(exclude_unset=True).items():
            if field == "techStack" and value is not None:
                update_dict["techStack"] = [item.model_dump() for item in (data.techStack or [])]
            elif field == "stats" and value is not None:
                update_dict["stats"] = [item.model_dump() for item in (data.stats or [])]
            else:
                update_dict[field] = value
        updated = await self._projects.update(project_id, data=update_dict)
        return _to_response(updated)

    async def delete_project(self, project_id: str) -> None:
        from app.core.exceptions import ProjectNotFoundError
        project = await self._projects.get_by_id(project_id)
        if not project:
            raise ProjectNotFoundError()
        await self._projects.delete(project_id)
