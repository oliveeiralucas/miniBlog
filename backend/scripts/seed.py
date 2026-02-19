"""Development seed script — populates the database with sample data.

Usage (from backend/ directory):
    python scripts/seed.py
"""

import asyncio
import os
import sys

# Ensure the app package is importable when running from the backend/ dir
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from prisma import Prisma  # noqa: E402

from app.core.security import hash_password  # noqa: E402

SAMPLE_USERS = [
    {"email": "alice@example.com", "displayName": "Alice", "password": "password123"},
    {"email": "bob@example.com", "displayName": "Bob", "password": "password123"},
]

SAMPLE_POSTS = [
    {
        "title": "Getting Started with FastAPI",
        "image": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png",
        "body": "FastAPI is a modern, fast web framework for building APIs with Python...",
        "tags": ["fastapi", "python", "backend"],
    },
    {
        "title": "Why PostgreSQL?",
        "image": "https://www.postgresql.org/media/img/about/press/elephant.png",
        "body": "PostgreSQL is a powerful, open-source object-relational database system...",
        "tags": ["postgresql", "database", "sql"],
    },
    {
        "title": "React Hooks Deep Dive",
        "image": "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
        "body": "React Hooks changed the way we write functional components...",
        "tags": ["react", "javascript", "frontend"],
    },
]


async def seed() -> None:
    db = Prisma()
    await db.connect()

    print("Seeding users...")
    user_ids = []
    for user_data in SAMPLE_USERS:
        existing = await db.user.find_unique(where={"email": user_data["email"]})
        if existing:
            user_ids.append(existing.id)
            print(f"  Skipped (already exists): {user_data['email']}")
            continue

        user = await db.user.create(
            data={
                "email": user_data["email"],
                "displayName": user_data["displayName"],
                "passwordHash": hash_password(user_data["password"]),
            }
        )
        user_ids.append(user.id)
        print(f"  Created: {user.email}")

    print("Seeding posts...")
    for i, post_data in enumerate(SAMPLE_POSTS):
        author_id = user_ids[i % len(user_ids)]
        post = await db.post.create(
            data={
                "title": post_data["title"],
                "image": post_data["image"],
                "body": post_data["body"],
                "authorId": author_id,
            }
        )

        for tag_name in post_data["tags"]:
            tag = await db.tag.upsert(
                where={"name": tag_name},
                data={"create": {"name": tag_name}, "update": {}},
            )
            await db.posttag.create(data={"postId": post.id, "tagId": tag.id})

        print(f"  Created: {post.title}")

    await db.disconnect()
    print("Seed complete.")


if __name__ == "__main__":
    asyncio.run(seed())
