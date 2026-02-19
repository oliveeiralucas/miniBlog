from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db, get_optional_user
from app.db.models import User
from app.repositories.post_repository import PostRepository
from app.schemas.common import PaginatedResponse
from app.schemas.post import PostCreate, PostResponse, PostUpdate
from app.services.post_service import PostService

router = APIRouter(prefix="/posts", tags=["posts"])


def _get_service(session: AsyncSession = Depends(get_db)) -> PostService:
    return PostService(post_repo=PostRepository(session))


@router.get("", response_model=PaginatedResponse[PostResponse])
async def list_posts(
    q: str | None = Query(None, description="Filter by tag name"),
    uid: str | None = Query(None, description="Filter by author ID"),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: User | None = Depends(get_optional_user),
    service: PostService = Depends(_get_service),
) -> PaginatedResponse[PostResponse]:
    """List all posts with optional tag or author filtering."""
    return await service.get_posts(
        search=q,
        uid=uid,
        page=page,
        size=size,
        current_user_id=current_user.id if current_user else None,
    )


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: str,
    current_user: User | None = Depends(get_optional_user),
    service: PostService = Depends(_get_service),
) -> PostResponse:
    """Retrieve a single post by ID."""
    return await service.get_post(
        post_id,
        current_user_id=current_user.id if current_user else None,
    )


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    body: PostCreate,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(_get_service),
) -> PostResponse:
    """Create a new blog post. Requires authentication."""
    return await service.create_post(body, author=current_user)


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    body: PostUpdate,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(_get_service),
) -> PostResponse:
    """Update an existing post. Only the post owner can update."""
    return await service.update_post(post_id, body, current_user=current_user)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(_get_service),
) -> None:
    """Delete a post. Only the post owner can delete."""
    await service.delete_post(post_id, current_user=current_user)


@router.post("/{post_id}/like", status_code=status.HTTP_204_NO_CONTENT)
async def like_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(_get_service),
) -> None:
    """Like a post (idempotent)."""
    await service.like_post(post_id, user_id=current_user.id)


@router.delete("/{post_id}/like", status_code=status.HTTP_204_NO_CONTENT)
async def unlike_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
    service: PostService = Depends(_get_service),
) -> None:
    """Remove a like from a post."""
    await service.unlike_post(post_id, user_id=current_user.id)
