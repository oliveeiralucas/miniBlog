from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin, get_db
from app.core.exceptions import ProjectNotFoundError, ProjectSlugTakenError
from app.db.models import User
from app.repositories.project_repository import ProjectRepository
from app.schemas.common import PaginatedResponse
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectUpdate
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


def _get_service(session: AsyncSession = Depends(get_db)) -> ProjectService:
    return ProjectService(project_repo=ProjectRepository(session))


@router.get("", response_model=PaginatedResponse[ProjectResponse])
async def list_projects(
    featured: bool = Query(False, description="Return only featured projects"),
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=100),
    service: ProjectService = Depends(_get_service),
) -> PaginatedResponse[ProjectResponse]:
    """List all projects. Public endpoint."""
    return await service.get_projects(featured_only=featured, page=page, size=size)


@router.get("/{slug}", response_model=ProjectResponse)
async def get_project(
    slug: str,
    service: ProjectService = Depends(_get_service),
) -> ProjectResponse:
    """Retrieve a single project by slug. Public endpoint."""
    return await service.get_project(slug)


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    body: ProjectCreate,
    _: User = Depends(get_current_admin),
    service: ProjectService = Depends(_get_service),
) -> ProjectResponse:
    """Create a new project. Admin only."""
    return await service.create_project(body)


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    body: ProjectUpdate,
    _: User = Depends(get_current_admin),
    service: ProjectService = Depends(_get_service),
) -> ProjectResponse:
    """Update a project. Admin only."""
    return await service.update_project(project_id, body)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    _: User = Depends(get_current_admin),
    service: ProjectService = Depends(_get_service),
) -> Response:
    """Delete a project. Admin only."""
    await service.delete_project(project_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
