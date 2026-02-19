from fastapi import APIRouter
from pydantic import BaseModel

from app.db.prisma_client import prisma

router = APIRouter(prefix="/tags", tags=["tags"])


class TagWithCount(BaseModel):
    name: str
    postCount: int


class TagListResponse(BaseModel):
    tags: list[TagWithCount]


@router.get("", response_model=TagListResponse)
async def list_tags() -> TagListResponse:
    """Return all tags with their respective post counts, ordered by post count desc."""
    tags = await prisma.tag.find_many(
        include={"_count": {"select": {"posts": True}}},  # type: ignore[arg-type]
        order={"name": "asc"},
    )
    return TagListResponse(
        tags=[
            TagWithCount(
                name=tag.name,
                postCount=tag._count.posts if tag._count else 0,  # type: ignore[union-attr]
            )
            for tag in tags
        ]
    )
