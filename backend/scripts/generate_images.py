#!/usr/bin/env python3
"""Admin script: generate AI images for all existing posts and projects.

Calls Gemini to build a prompt from each item's fields, then calls Gemini
image generation to produce a cover image and stores the base64 result in
the `image_data` column.  Errors on individual items are logged but do not
abort the run.

Usage (from the backend directory):
    python -m scripts.generate_images
"""
from __future__ import annotations

import asyncio
import sys
from dataclasses import dataclass
from pathlib import Path

# Allow imports from the app package when run as a module
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select
from sqlalchemy.orm import joinedload, selectinload

from app.core.config import get_settings
from app.db.engine import get_session_factory
from app.db.models import Post, PostTag, Project
from app.services.image_ai_service import generate_image, generate_prompt

_settings = get_settings()


@dataclass
class PostData:
    id: str
    title: str
    body: str
    tags: list[str]


@dataclass
class ProjectData:
    id: str
    title: str
    description: str
    tags: list[str]
    category: str | None


async def _process_posts(session) -> None:
    result = await session.execute(
        select(Post).options(
            selectinload(Post.tags).joinedload(PostTag.tag)
        )
    )
    posts = list(result.unique().scalars().all())

    # Extract all data eagerly before any async AI calls
    # (after rollback, ORM objects expire and cause sync lazy-load errors)
    items: list[PostData] = [
        PostData(
            id=p.id,
            title=p.title,
            body=p.body,
            tags=[pt.tag.name for pt in (p.tags or [])],
        )
        for p in posts
    ]

    print(f"Found {len(items)} post(s)")

    for i, item in enumerate(items, 1):
        print(f"  [{i}/{len(items)}] {item.title!r}")
        try:
            prompt = await generate_prompt(
                title=item.title,
                body=item.body,
                tags=item.tags,
            )
            print(f"    prompt: {prompt[:90]}…")
            image_data = await generate_image(prompt)

            # Re-fetch by PK to avoid working with expired instances
            row = await session.execute(select(Post).where(Post.id == item.id))
            post = row.scalar_one()
            post.image_data = image_data
            await session.commit()
            print(f"    ✓ saved ({len(image_data)} base64 chars)")
        except Exception as exc:
            await session.rollback()
            print(f"    ✗ ERROR: {exc}", file=sys.stderr)


async def _process_projects(session) -> None:
    result = await session.execute(select(Project))
    projects = list(result.scalars().all())

    items: list[ProjectData] = [
        ProjectData(
            id=p.id,
            title=p.title,
            description=p.description,
            tags=p.tags or [],
            category=p.category,
        )
        for p in projects
    ]

    print(f"Found {len(items)} project(s)")

    for i, item in enumerate(items, 1):
        print(f"  [{i}/{len(items)}] {item.title!r}")
        try:
            prompt = await generate_prompt(
                title=item.title,
                body=item.description,
                tags=item.tags,
                category=item.category,
            )
            print(f"    prompt: {prompt[:90]}…")
            image_data = await generate_image(prompt)

            row = await session.execute(select(Project).where(Project.id == item.id))
            project = row.scalar_one()
            project.image_data = image_data
            await session.commit()
            print(f"    ✓ saved ({len(image_data)} base64 chars)")
        except Exception as exc:
            await session.rollback()
            print(f"    ✗ ERROR: {exc}", file=sys.stderr)


async def main() -> None:
    print("=== MiniBlog AI Image Generator ===")
    print(f"Gemini model      : {_settings.GEMINI_MODEL}")
    print(f"Gemini image model: {_settings.GEMINI_IMAGE_MODEL}")
    print()

    if not _settings.GEMINI_API_KEY:
        print("ERROR: GEMINI_API_KEY is not set in .env", file=sys.stderr)
        sys.exit(1)

    factory = get_session_factory()
    async with factory() as session:
        print("--- Posts ---")
        await _process_posts(session)
        print()
        print("--- Projects ---")
        await _process_projects(session)

    print()
    print("Done.")


if __name__ == "__main__":
    asyncio.run(main())
