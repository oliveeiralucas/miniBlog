from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import get_settings

_engine: AsyncEngine | None = None
_async_session_factory: async_sessionmaker[AsyncSession] | None = None


def _build_async_url(raw_url: str) -> tuple[str, dict]:
    """Convert a raw DATABASE_URL to asyncpg format.

    - Normalises postgres:// and postgresql:// to postgresql+asyncpg://
    - Extracts sslmode (psycopg2 syntax) and converts it to asyncpg's ssl arg
      returned as part of connect_args, since asyncpg does not accept sslmode.

    Returns (url_string, connect_args).
    """
    # Normalise scheme
    if raw_url.startswith("postgres://"):
        raw_url = "postgresql+asyncpg://" + raw_url[len("postgres://"):]
    elif raw_url.startswith("postgresql://"):
        raw_url = "postgresql+asyncpg://" + raw_url[len("postgresql://"):]

    parsed = urlparse(raw_url)
    query_params = parse_qs(parsed.query, keep_blank_values=True)

    # asyncpg does not understand sslmode — extract and convert it
    sslmode = query_params.pop("sslmode", [None])[0]
    connect_args: dict = {}
    if sslmode == "disable":
        connect_args["ssl"] = False
    elif sslmode in ("require", "verify-ca", "verify-full"):
        connect_args["ssl"] = True
    # sslmode=prefer/allow → let asyncpg use its default (no explicit ssl arg)

    clean_query = urlencode(query_params, doseq=True)
    clean_url = urlunparse(parsed._replace(query=clean_query))

    return clean_url, connect_args


def get_engine() -> AsyncEngine:
    global _engine
    if _engine is None:
        settings = get_settings()
        db_url, connect_args = _build_async_url(settings.DATABASE_URL)
        _engine = create_async_engine(
            db_url,
            echo=settings.DEBUG,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,
            connect_args=connect_args,
        )
    return _engine


def get_session_factory() -> async_sessionmaker[AsyncSession]:
    global _async_session_factory
    if _async_session_factory is None:
        _async_session_factory = async_sessionmaker(
            bind=get_engine(),
            class_=AsyncSession,
            expire_on_commit=False,
        )
    return _async_session_factory


async def close_engine() -> None:
    global _engine, _async_session_factory
    if _engine is not None:
        await _engine.dispose()
        _engine = None
        _async_session_factory = None
