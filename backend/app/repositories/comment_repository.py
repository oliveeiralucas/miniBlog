from prisma import Prisma
from prisma.models import Comment

_COMMENT_INCLUDE = {
    "author": True,
    "_count": {"select": {"replies": True}},
}


class CommentRepository:
    def __init__(self, db: Prisma) -> None:
        self._db = db

    async def find_by_post(
        self,
        post_id: str,
        *,
        parent_id: str | None = None,
    ) -> list[Comment]:
        """Return top-level comments (parent_id=None) or replies to a comment."""
        return await self._db.comment.find_many(
            where={"postId": post_id, "parentId": parent_id},
            order={"createdAt": "asc"},
            include=_COMMENT_INCLUDE,  # type: ignore[arg-type]
        )

    async def get_by_id(self, comment_id: str) -> Comment | None:
        return await self._db.comment.find_unique(
            where={"id": comment_id},
            include=_COMMENT_INCLUDE,  # type: ignore[arg-type]
        )

    async def create(
        self,
        *,
        body: str,
        post_id: str,
        author_id: str,
        parent_id: str | None = None,
    ) -> Comment:
        return await self._db.comment.create(
            data={
                "body": body,
                "postId": post_id,
                "authorId": author_id,
                "parentId": parent_id,
            },
            include=_COMMENT_INCLUDE,  # type: ignore[arg-type]
        )

    async def delete(self, comment_id: str) -> None:
        await self._db.comment.delete(where={"id": comment_id})
