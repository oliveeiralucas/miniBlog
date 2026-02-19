from app.core.exceptions import CommentNotFoundError, ForbiddenError, PostNotFoundError
from app.repositories.comment_repository import CommentRepository
from app.repositories.post_repository import PostRepository
from app.schemas.comment import CommentCreate, CommentResponse


def _to_response(comment: object) -> CommentResponse:
    reply_count = getattr(comment, "reply_count", 0)

    return CommentResponse(
        id=comment.id,  # type: ignore[attr-defined]
        body=comment.body,  # type: ignore[attr-defined]
        postId=comment.postId,  # type: ignore[attr-defined]
        authorId=comment.authorId,  # type: ignore[attr-defined]
        authorName=comment.author.displayName,  # type: ignore[attr-defined]
        parentId=comment.parentId,  # type: ignore[attr-defined]
        createdAt=comment.createdAt,  # type: ignore[attr-defined]
        replyCount=reply_count,
    )


class CommentService:
    def __init__(
        self,
        comment_repo: CommentRepository,
        post_repo: PostRepository,
    ) -> None:
        self._comments = comment_repo
        self._posts = post_repo

    async def get_comments(self, post_id: str) -> list[CommentResponse]:
        post = await self._posts.get_by_id(post_id)
        if not post:
            raise PostNotFoundError()
        comments = await self._comments.find_by_post(post_id)
        return [_to_response(c) for c in comments]

    async def create_comment(
        self,
        post_id: str,
        data: CommentCreate,
        *,
        author: object,
    ) -> CommentResponse:
        post = await self._posts.get_by_id(post_id)
        if not post:
            raise PostNotFoundError()

        comment = await self._comments.create(
            body=data.body,
            post_id=post_id,
            author_id=author.id,  # type: ignore[attr-defined]
            parent_id=data.parentId,
        )
        return _to_response(comment)

    async def delete_comment(
        self, comment_id: str, *, current_user: object
    ) -> None:
        comment = await self._comments.get_by_id(comment_id)
        if not comment:
            raise CommentNotFoundError()
        if comment.authorId != current_user.id:  # type: ignore[attr-defined]
            raise ForbiddenError()
        await self._comments.delete(comment_id)
