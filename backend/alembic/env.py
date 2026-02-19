import asyncio
from logging.config import fileConfig

from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine

from app.db.base import Base
from app.db import models  # noqa: F401 — registers all models in Base.metadata
from app.db.engine import _build_async_url
from app.core.config import get_settings

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def _get_url_and_connect_args() -> tuple[str, dict]:
    # get_settings() uses pydantic-settings which auto-loads .env
    raw = get_settings().DATABASE_URL
    return _build_async_url(raw)


def run_migrations_offline() -> None:
    """Run migrations without a live DB connection (generates SQL script)."""
    url, _ = _get_url_and_connect_args()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Run migrations against a live async PostgreSQL connection."""
    url, connect_args = _get_url_and_connect_args()
    engine = create_async_engine(url, echo=False, connect_args=connect_args)

    async with engine.begin() as conn:
        await conn.run_sync(
            lambda sync_conn: context.configure(
                connection=sync_conn,
                target_metadata=target_metadata,
                compare_type=True,
            )
        )
        await conn.run_sync(lambda _: context.run_migrations())

    await engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
