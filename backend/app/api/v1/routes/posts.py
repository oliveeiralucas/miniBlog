from fastapi import APIRouter, Depends, Query, status
from prisma.models import User

from app.api.deps import get_current_user, get_optional_user
from app.db.prisma_client import prisma
from app.repositories.post_repository import PostRepository
from app.schemas.common import PaginatedResponse
from app.schemas.post import PostCreate, PostResponse, PostUpdate
from app.services.post_service import PostService

router = APIRouter(prefix="/posts", tags=["posts"])


def _get_service() -> PostService:
    return PostService(post_repo=PostRepository(prisma))


@router.get("", response_model=PaginatedResponse[PostResponse])
async def list_posts(
    q: str | None = Query(None, description="Filter by tag name"),
    uid: str | None = Query(None, description="Filter by author ID"),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: User | None = Depends(get_optional_user),
) -> PaginatedResponse[PostResponse]:
    """List all posts with optional tag or author filtering."""
    return await _get_service().get_posts(
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
) -> PostResponse:
    """Retrieve a single post by ID."""
    return await _get_service().get_post(
        post_id,
        current_user_id=current_user.id if current_user else None,
    )


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    body: PostCreate,
    current_user: User = Depends(get_current_user),
) -> PostResponse:
    """Create a new blog post. Requires authentication."""
    return await _get_service().create_post(body, author=current_user)


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: str,
    body: PostUpdate,
    current_user: User = Depends(get_current_user),
) -> PostResponse:
    """Update an existing post. Only the post owner can update."""
    return await _get_service().update_post(post_id, body, current_user=current_user)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
) -> None:
    """Delete a post. Only the post owner can delete."""
    await _get_service().delete_post(post_id, current_user=current_user)


@router.post("/{post_id}/like", status_code=status.HTTP_204_NO_CONTENT)
async def like_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
) -> None:
    """Like a post (idempotent)."""
    await _get_service().like_post(post_id, user_id=current_user.id)


@router.delete("/{post_id}/like", status_code=status.HTTP_204_NO_CONTENT)
async def unlike_post(
    post_id: str,
    current_user: User = Depends(get_current_user),
) -> None:
    """Remove a like from a post."""
    await _get_service().unlike_post(post_id, user_id=current_user.id)
