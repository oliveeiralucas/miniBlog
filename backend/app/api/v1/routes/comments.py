from fastapi import APIRouter, Depends, status
from prisma.models import User

from app.api.deps import get_current_user
from app.db.prisma_client import prisma
from app.repositories.comment_repository import CommentRepository
from app.repositories.post_repository import PostRepository
from app.schemas.comment import CommentCreate, CommentResponse
from app.services.comment_service import CommentService

router = APIRouter(tags=["comments"])


def _get_service() -> CommentService:
    return CommentService(
        comment_repo=CommentRepository(prisma),
        post_repo=PostRepository(prisma),
    )


@router.get("/posts/{post_id}/comments", response_model=list[CommentResponse])
async def list_comments(post_id: str) -> list[CommentResponse]:
    """List all top-level comments for a post."""
    return await _get_service().get_comments(post_id)


@router.post(
    "/posts/{post_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_comment(
    post_id: str,
    body: CommentCreate,
    current_user: User = Depends(get_current_user),
) -> CommentResponse:
    """Add a comment to a post. Requires authentication."""
    return await _get_service().create_comment(post_id, body, author=current_user)


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: str,
    current_user: User = Depends(get_current_user),
) -> None:
    """Delete a comment. Only the author can delete their comment."""
    await _get_service().delete_comment(comment_id, current_user=current_user)
