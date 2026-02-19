from datetime import datetime

from pydantic import BaseModel, field_validator


class CommentCreate(BaseModel):
    body: str
    parentId: str | None = None

    @field_validator("body")
    @classmethod
    def body_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Comment body cannot be empty")
        return v.strip()


class CommentResponse(BaseModel):
    id: str
    body: str
    postId: str
    authorId: str
    authorName: str
    parentId: str | None
    createdAt: datetime
    replyCount: int = 0
