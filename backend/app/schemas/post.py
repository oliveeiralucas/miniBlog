from datetime import datetime

from pydantic import BaseModel, HttpUrl, field_validator, model_validator


class PostCreate(BaseModel):
    title: str
    image: HttpUrl | None = None
    image_data: str | None = None
    body: str
    tags: list[str]

    @model_validator(mode="after")
    def check_image_source(self) -> "PostCreate":
        if not self.image and not self.image_data:
            raise ValueError("Either 'image' (URL) or 'image_data' (base64) must be provided")
        return self

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()

    @field_validator("body")
    @classmethod
    def body_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Body cannot be empty")
        return v

    @field_validator("tags")
    @classmethod
    def normalize_tags(cls, v: list[str]) -> list[str]:
        normalized = list({tag.strip().lower() for tag in v if tag.strip()})
        if not normalized:
            raise ValueError("At least one tag is required")
        if len(normalized) > 10:
            raise ValueError("Maximum of 10 tags allowed")
        return normalized


class PostUpdate(BaseModel):
    title: str | None = None
    image: HttpUrl | None = None
    image_data: str | None = None
    body: str | None = None
    tags: list[str] | None = None

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str | None) -> str | None:
        if v is not None and not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip() if v else v

    @field_validator("tags")
    @classmethod
    def normalize_tags(cls, v: list[str] | None) -> list[str] | None:
        if v is None:
            return v
        normalized = list({tag.strip().lower() for tag in v if tag.strip()})
        if not normalized:
            raise ValueError("At least one tag is required")
        if len(normalized) > 10:
            raise ValueError("Maximum of 10 tags allowed")
        return normalized


class PostResponse(BaseModel):
    """Frontend-compatible response shape.

    ``uid`` maps to ``authorId`` and ``createdBy`` maps to ``author.displayName``
    to maintain backward compatibility with the existing React hooks.
    """

    id: str
    title: str
    image: str
    image_data: str | None = None
    body: str
    tags: list[str]
    uid: str           # = authorId
    createdBy: str     # = author.displayName
    createdAt: datetime
    likeCount: int = 0
    commentCount: int = 0
    likedByMe: bool = False
