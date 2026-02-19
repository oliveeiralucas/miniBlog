from app.core.exceptions import ForbiddenError, PostNotFoundError
from app.repositories.post_repository import PostRepository
from app.schemas.common import PaginatedResponse
from app.schemas.post import PostCreate, PostResponse, PostUpdate


def _to_response(post: object, *, current_user_id: str | None = None) -> PostResponse:
    tags = [pt.tag.name for pt in (post.tags or [])]  # type: ignore[attr-defined]
    like_count: int = len(post.likes or [])  # type: ignore[attr-defined]
    comment_count: int = len(post.comments or [])  # type: ignore[attr-defined]

    return PostResponse(
        id=post.id,  # type: ignore[attr-defined]
        title=post.title,  # type: ignore[attr-defined]
        image=post.image,  # type: ignore[attr-defined]
        body=post.body,  # type: ignore[attr-defined]
        tags=tags,
        uid=post.authorId,  # type: ignore[attr-defined]
        createdBy=post.author.displayName,  # type: ignore[attr-defined]
        createdAt=post.createdAt,  # type: ignore[attr-defined]
        likeCount=like_count,
        commentCount=comment_count,
        likedByMe=False,  # enriched separately if user is authenticated
    )


class PostService:
    def __init__(self, post_repo: PostRepository) -> None:
        self._posts = post_repo

    async def get_posts(
        self,
        *,
        search: str | None,
        uid: str | None,
        page: int,
        size: int,
        current_user_id: str | None = None,
    ) -> PaginatedResponse[PostResponse]:
        posts, total = await self._posts.find_many(
            tag_filter=search,
            author_id=uid,
            skip=(page - 1) * size,
            take=size,
        )
        items = []
        for post in posts:
            response = _to_response(post, current_user_id=current_user_id)
            if current_user_id:
                response.likedByMe = await self._posts.get_like_status(
                    post.id, current_user_id  # type: ignore[attr-defined]
                )
            items.append(response)

        return PaginatedResponse.build(items=items, total=total, page=page, size=size)

    async def get_post(
        self, post_id: str, *, current_user_id: str | None = None
    ) -> PostResponse:
        post = await self._posts.get_by_id(post_id)
        if not post:
            raise PostNotFoundError()

        response = _to_response(post)
        if current_user_id:
            response.likedByMe = await self._posts.get_like_status(
                post_id, current_user_id
            )
        return response

    async def create_post(self, data: PostCreate, *, author: object) -> PostResponse:
        post = await self._posts.create(
            title=data.title,
            image=str(data.image),
            body=data.body,
            tags=data.tags,
            author_id=author.id,  # type: ignore[attr-defined]
        )
        return _to_response(post)

    async def update_post(
        self,
        post_id: str,
        data: PostUpdate,
        *,
        current_user: object,
    ) -> PostResponse:
        post = await self._posts.get_by_id(post_id)
        if not post:
            raise PostNotFoundError()
        if post.authorId != current_user.id:  # type: ignore[attr-defined]
            raise ForbiddenError()

        updated = await self._posts.update(
            post_id,
            title=data.title,
            image=str(data.image) if data.image else None,
            body=data.body,
            tags=data.tags,
        )
        return _to_response(updated)

    async def delete_post(self, post_id: str, *, current_user: object) -> None:
        post = await self._posts.get_by_id(post_id)
        if not post:
            raise PostNotFoundError()
        if post.authorId != current_user.id:  # type: ignore[attr-defined]
            raise ForbiddenError()
        await self._posts.delete(post_id)

    async def like_post(self, post_id: str, *, user_id: str) -> None:
        post = await self._posts.get_by_id(post_id)
        if not post:
            raise PostNotFoundError()
        await self._posts.add_like(post_id, user_id)

    async def unlike_post(self, post_id: str, *, user_id: str) -> None:
        post = await self._posts.get_by_id(post_id)
        if not post:
            raise PostNotFoundError()
        await self._posts.remove_like(post_id, user_id)
