from prisma import Prisma
from prisma.models import Post

# Reusable include clause that fetches all relations needed for PostResponse
_POST_INCLUDE = {
    "author": True,
    "tags": {"include": {"tag": True}},
    "likes": True,
    "comments": True,
}


class PostRepository:
    def __init__(self, db: Prisma) -> None:
        self._db = db

    async def find_many(
        self,
        *,
        tag_filter: str | None = None,
        author_id: str | None = None,
        skip: int = 0,
        take: int = 20,
    ) -> tuple[list[Post], int]:
        where: dict = {}

        if author_id:
            where["authorId"] = author_id

        if tag_filter:
            where["tags"] = {
                "some": {"tag": {"is": {"name": tag_filter.strip().lower()}}}
            }

        posts = await self._db.post.find_many(
            where=where,
            order={"createdAt": "desc"},
            skip=skip,
            take=take,
            include=_POST_INCLUDE,  # type: ignore[arg-type]
        )
        total = await self._db.post.count(where=where)
        return posts, total

    async def get_by_id(self, post_id: str) -> Post | None:
        return await self._db.post.find_unique(
            where={"id": post_id},
            include=_POST_INCLUDE,  # type: ignore[arg-type]
        )

    async def create(
        self,
        *,
        title: str,
        image: str,
        body: str,
        tags: list[str],
        author_id: str,
    ) -> Post:
        # Upsert each tag (create if not exists), then link via PostTag
        tag_connect = []
        for tag_name in tags:
            tag = await self._db.tag.upsert(
                where={"name": tag_name},
                data={
                    "create": {"name": tag_name},
                    "update": {},
                },
            )
            tag_connect.append({"postId_tagId": {"postId": "__placeholder__", "tagId": tag.id}})

        post = await self._db.post.create(
            data={
                "title": title,
                "image": image,
                "body": body,
                "authorId": author_id,
            },
            include={"author": True},
        )

        # Create PostTag entries
        for tag_name in tags:
            tag = await self._db.tag.find_unique(where={"name": tag_name})
            if tag:
                await self._db.posttag.create(
                    data={"postId": post.id, "tagId": tag.id}
                )

        # Reload with full includes
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
        update_data: dict = {}
        if title is not None:
            update_data["title"] = title
        if image is not None:
            update_data["image"] = image
        if body is not None:
            update_data["body"] = body

        if update_data:
            await self._db.post.update(where={"id": post_id}, data=update_data)

        if tags is not None:
            # Replace all tags: delete existing PostTag rows, re-create
            await self._db.posttag.delete_many(where={"postId": post_id})
            for tag_name in tags:
                tag = await self._db.tag.upsert(
                    where={"name": tag_name},
                    data={"create": {"name": tag_name}, "update": {}},
                )
                await self._db.posttag.create(
                    data={"postId": post_id, "tagId": tag.id}
                )

        return await self.get_by_id(post_id)  # type: ignore[return-value]

    async def delete(self, post_id: str) -> None:
        await self._db.post.delete(where={"id": post_id})

    async def get_like_status(self, post_id: str, user_id: str) -> bool:
        """Return True if *user_id* has liked *post_id*."""
        like = await self._db.postlike.find_unique(
            where={"postId_userId": {"postId": post_id, "userId": user_id}}
        )
        return like is not None

    async def add_like(self, post_id: str, user_id: str) -> None:
        """Idempotent like — silently ignores duplicates."""
        await self._db.postlike.upsert(
            where={"postId_userId": {"postId": post_id, "userId": user_id}},
            data={
                "create": {"postId": post_id, "userId": user_id},
                "update": {},
            },
        )

    async def remove_like(self, post_id: str, user_id: str) -> None:
        await self._db.postlike.delete_many(
            where={"postId": post_id, "userId": user_id}
        )
