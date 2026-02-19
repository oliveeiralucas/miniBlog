from fastapi import APIRouter

from app.api.v1.routes.auth import router as auth_router
from app.api.v1.routes.comments import router as comments_router
from app.api.v1.routes.posts import router as posts_router
from app.api.v1.routes.tags import router as tags_router

api_v1_router = APIRouter()

api_v1_router.include_router(auth_router)
api_v1_router.include_router(posts_router)
api_v1_router.include_router(tags_router)
api_v1_router.include_router(comments_router)
