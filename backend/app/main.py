from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.v1.router import api_v1_router
from app.core.config import get_settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import configure_logging, get_logger
from app.db.engine import close_engine, get_engine
from app.middleware.cors import setup_cors
from app.middleware.rate_limit import limiter
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):  # type: ignore[type-arg]
    """Manage application startup and shutdown lifecycle."""
    configure_logging()
    get_engine()
    logger.info("Database engine initialized")
    yield
    await close_engine()
    logger.info("Database engine disposed")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="MiniBlog API",
        version="1.0.0",
        description="REST API for MiniBlog — FastAPI + SQLAlchemy + PostgreSQL",
        # Disable interactive docs in production
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        openapi_url="/openapi.json" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    # ── Rate limiter state ───────────────────────────────────────────────────
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)  # type: ignore[arg-type]

    # ── Middleware (last registered = innermost) ─────────────────────────────
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    setup_cors(app, settings)
    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RequestIDMiddleware)

    # ── Custom exception handlers ────────────────────────────────────────────
    register_exception_handlers(app)

    # ── Routers ─────────────────────────────────────────────────────────────
    app.include_router(api_v1_router, prefix="/api/v1")

    # ── Health check ─────────────────────────────────────────────────────────
    @app.get("/health", include_in_schema=False)
    async def health() -> dict:
        return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

    return app


app = create_app()
