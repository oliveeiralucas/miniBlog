from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.db.models import Comment


class CommentRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def _fetch_with_reply_counts(self, query) -> list[Comment]:
        """Execute a comment query and annotate each result with its reply count."""
        result = await self._session.execute(
            query.options(joinedload(Comment.author))
        )
        comments = list(result.unique().scalars().all())

        if comments:
            ids = [c.id for c in comments]
            count_result = await self._session.execute(
                select(Comment.parentId, func.count(Comment.id).label("cnt"))
                .where(Comment.parentId.in_(ids))
                .group_by(Comment.parentId)
            )
            count_map = {row.parentId: row.cnt for row in count_result}
            for c in comments:
                c.reply_count = count_map.get(c.id, 0)

        return comments

    async def find_by_post(
        self,
        post_id: str,
        *,
        parent_id: str | None = None,
    ) -> list[Comment]:
        """Return top-level comments (parent_id=None) or replies to a comment."""
        query = (
            select(Comment)
            .where(Comment.postId == post_id, Comment.parentId == parent_id)
            .order_by(Comment.createdAt.asc())
        )
        return await self._fetch_with_reply_counts(query)

    async def get_by_id(self, comment_id: str) -> Comment | None:
        query = select(Comment).where(Comment.id == comment_id)
        comments = await self._fetch_with_reply_counts(query)
        return comments[0] if comments else None

    async def create(
        self,
        *,
        body: str,
        post_id: str,
        author_id: str,
        parent_id: str | None = None,
    ) -> Comment:
        comment = Comment(
            body=body,
            postId=post_id,
            authorId=author_id,
            parentId=parent_id,
        )
        self._session.add(comment)
        await self._session.commit()
        # Reload with author and reply count
        return await self.get_by_id(comment.id)  # type: ignore[return-value]

    async def delete(self, comment_id: str) -> None:
        await self._session.execute(
            delete(Comment).where(Comment.id == comment_id)
        )
        await self._session.commit()
