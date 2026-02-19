"""Initialize database tables on startup (idempotent — safe to run every deploy).

Creates tables that don't exist yet. Never drops existing data.

Usage:
    python scripts/init_db.py
"""

import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine  # noqa: E402

from app.db import models  # noqa: F401, E402 — registers all models
from app.db.base import Base  # noqa: E402
from app.db.engine import _build_async_url  # noqa: E402
from app.core.config import get_settings  # noqa: E402


async def init() -> None:
    settings = get_settings()
    url, connect_args = _build_async_url(settings.DATABASE_URL)
    engine = create_async_engine(url, connect_args=connect_args)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    await engine.dispose()
    print("Database tables ready.")


if __name__ == "__main__":
    asyncio.run(init())
