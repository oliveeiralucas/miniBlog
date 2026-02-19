from sqlalchemy import delete, func, select, update
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.db.models import Post, PostLike, PostTag, Tag


class PostRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    def _base_query(self):
        """Base select with all relations needed for PostResponse."""
        return select(Post).options(
            joinedload(Post.author),
            selectinload(Post.tags).joinedload(PostTag.tag),
            selectinload(Post.likes),
            selectinload(Post.comments),
        )

    async def find_many(
        self,
        *,
        tag_filter: str | None = None,
        author_id: str | None = None,
        skip: int = 0,
        take: int = 20,
    ) -> tuple[list[Post], int]:
        query = self._base_query()

        if author_id:
            query = query.where(Post.authorId == author_id)

        if tag_filter:
            tag_subq = (
                select(PostTag.postId)
                .join(Tag, PostTag.tagId == Tag.id)
                .where(
                    PostTag.postId == Post.id,
                    func.lower(Tag.name) == tag_filter.strip().lower(),
                )
            )
            query = query.where(tag_subq.exists())

        count_query = select(func.count()).select_from(
            query.order_by(None).options().subquery()
        )
        total_result = await self._session.execute(count_query)
        total = total_result.scalar_one()

        query = query.order_by(Post.createdAt.desc()).offset(skip).limit(take)
        result = await self._session.execute(query)
        posts = list(result.unique().scalars().all())

        return posts, total

    async def get_by_id(self, post_id: str) -> Post | None:
        result = await self._session.execute(
            self._base_query().where(Post.id == post_id)
        )
        return result.unique().scalar_one_or_none()

    async def _upsert_tag(self, tag_name: str) -> Tag:
        """Get or create a tag by name."""
        result = await self._session.execute(
            select(Tag).where(Tag.name == tag_name)
        )
        tag = result.scalar_one_or_none()
        if tag is None:
            tag = Tag(name=tag_name)
            self._session.add(tag)
            await self._session.flush()
        return tag

    async def create(
        self,
        *,
        title: str,
        image: str,
        body: str,
        tags: list[str],
        author_id: str,
    ) -> Post:
        post = Post(title=title, image=image, body=body, authorId=author_id)
        self._session.add(post)
        await self._session.flush()  # get post.id before creating PostTags

        for tag_name in tags:
            tag = await self._upsert_tag(tag_name)
            self._session.add(PostTag(postId=post.id, tagId=tag.id))

        await self._session.commit()
        return await self.get_by_id(post.id)  # type: ignore[return-value]

    async def update(
        self,
        post_id: str,
        *,
        title: str | None = None,
        image: str | None = None,
        body: str | None = None,
        tags: list[str] | None = None,
    ) -> Post:
        update_vals: dict = {}
        if title is not None:
            update_vals["title"] = title
        if image is not None:
            update_vals["image"] = image
        if body is not None:
            update_vals["body"] = body

        if update_vals:
            await self._session.execute(
                update(Post).where(Post.id == post_id).values(**update_vals)
            )

        if tags is not None:
            await self._session.execute(
                delete(PostTag).where(PostTag.postId == post_id)
            )
            for tag_name in tags:
                tag = await self._upsert_tag(tag_name)
                self._session.add(PostTag(postId=post_id, tagId=tag.id))

        await self._session.commit()
        return await self.get_by_id(post_id)  # type: ignore[return-value]

    async def delete(self, post_id: str) -> None:
        await self._session.execute(delete(Post).where(Post.id == post_id))
        await self._session.commit()

    async def get_like_status(self, post_id: str, user_id: str) -> bool:
        """Return True if *user_id* has liked *post_id*."""
        result = await self._session.execute(
            select(PostLike).where(
                PostLike.postId == post_id,
                PostLike.userId == user_id,
            )
        )
        return result.scalar_one_or_none() is not None

    async def add_like(self, post_id: str, user_id: str) -> None:
        """Idempotent like — silently ignores duplicates."""
        stmt = (
            pg_insert(PostLike)
            .values(post_id=post_id, user_id=user_id)
            .on_conflict_do_nothing(index_elements=["post_id", "user_id"])
        )
        await self._session.execute(stmt)
        await self._session.commit()

    async def remove_like(self, post_id: str, user_id: str) -> None:
        await self._session.execute(
            delete(PostLike).where(
                PostLike.postId == post_id,
                PostLike.userId == user_id,
            )
        )
        await self._session.commit()
