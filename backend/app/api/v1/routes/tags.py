from fastapi import Depends
from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db
from app.db.models import PostTag, Tag

router = APIRouter(prefix="/tags", tags=["tags"])


class TagWithCount(BaseModel):
    name: str
    postCount: int


class TagListResponse(BaseModel):
    tags: list[TagWithCount]


@router.get("", response_model=TagListResponse)
async def list_tags(
    session: AsyncSession = Depends(get_db),
) -> TagListResponse:
    """Return all tags with their respective post counts, ordered by name."""
    result = await session.execute(
        select(Tag.name, func.count(PostTag.postId).label("post_count"))
        .outerjoin(PostTag, Tag.id == PostTag.tagId)
        .group_by(Tag.id, Tag.name)
        .order_by(Tag.name.asc())
    )
    rows = result.all()
    return TagListResponse(
        tags=[TagWithCount(name=row.name, postCount=row.post_count) for row in rows]
    )
