from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.db.models import User
from app.repositories.comment_repository import CommentRepository
from app.repositories.post_repository import PostRepository
from app.schemas.comment import CommentCreate, CommentResponse
from app.services.comment_service import CommentService

router = APIRouter(tags=["comments"])


def _get_service(session: AsyncSession = Depends(get_db)) -> CommentService:
    return CommentService(
        comment_repo=CommentRepository(session),
        post_repo=PostRepository(session),
    )


@router.get("/posts/{post_id}/comments", response_model=list[CommentResponse])
async def list_comments(
    post_id: str,
    service: CommentService = Depends(_get_service),
) -> list[CommentResponse]:
    """List all top-level comments for a post."""
    return await service.get_comments(post_id)


@router.post(
    "/posts/{post_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_comment(
    post_id: str,
    body: CommentCreate,
    current_user: User = Depends(get_current_user),
    service: CommentService = Depends(_get_service),
) -> CommentResponse:
    """Add a comment to a post. Requires authentication."""
    return await service.create_comment(post_id, body, author=current_user)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: str,
    current_user: User = Depends(get_current_user),
    service: CommentService = Depends(_get_service),
) -> None:
    """Delete a comment. Only the author can delete their comment."""
    await service.delete_comment(comment_id, current_user=current_user)
