from __future__ import annotations

import re
from datetime import datetime
from typing import Any

from pydantic import BaseModel, field_validator, model_validator


class TechStackItem(BaseModel):
    name: str


class StatItem(BaseModel):
    label: str
    value: str


class ProjectCreate(BaseModel):
    slug: str
    title: str
    tagline: str
    description: str
    category: str
    url: str
    githubUrl: str | None = None
    image: str = ""
    image_data: str | None = None
    tags: list[str] = []
    techStack: list[TechStackItem] = []
    stats: list[StatItem] = []
    features: list[str] = []
    year: int
    featured: bool = False

    @model_validator(mode="after")
    def check_image_source(self) -> "ProjectCreate":
        if not self.image and not self.image_data:
            raise ValueError("Either 'image' (URL) or 'image_data' (base64) must be provided")
        return self

    @field_validator("slug")
    @classmethod
    def slug_format(cls, v: str) -> str:
        if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", v):
            raise ValueError("Slug must be lowercase alphanumeric with hyphens only")
        return v

    @field_validator("title")
    @classmethod
    def title_not_empty(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Title cannot be empty")
        return v.strip()

    @field_validator("year")
    @classmethod
    def year_valid(cls, v: int) -> int:
        if v < 2000 or v > 2100:
            raise ValueError("Year must be between 2000 and 2100")
        return v


class ProjectUpdate(BaseModel):
    slug: str | None = None
    title: str | None = None
    tagline: str | None = None
    description: str | None = None
    category: str | None = None
    url: str | None = None
    githubUrl: str | None = None
    image: str | None = None
    image_data: str | None = None
    tags: list[str] | None = None
    techStack: list[TechStackItem] | None = None
    stats: list[StatItem] | None = None
    features: list[str] | None = None
    year: int | None = None
    featured: bool | None = None

    @field_validator("slug")
    @classmethod
    def slug_format(cls, v: str | None) -> str | None:
        if v is not None and not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", v):
            raise ValueError("Slug must be lowercase alphanumeric with hyphens only")
        return v

    @field_validator("year")
    @classmethod
    def year_valid(cls, v: int | None) -> int | None:
        if v is not None and (v < 2000 or v > 2100):
            raise ValueError("Year must be between 2000 and 2100")
        return v


class ProjectResponse(BaseModel):
    id: str
    slug: str
    title: str
    tagline: str
    description: str
    category: str
    url: str
    githubUrl: str | None
    image: str
    image_data: str | None = None
    tags: list[str]
    techStack: list[dict[str, Any]]
    stats: list[dict[str, Any]]
    features: list[str]
    year: int
    featured: bool
    createdAt: datetime
    updatedAt: datetime

    model_config = {"from_attributes": True}
