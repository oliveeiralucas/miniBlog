from __future__ import annotations

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.api.deps import get_current_admin
from app.db.models import User
from app.services.image_ai_service import generate_image, generate_prompt

router = APIRouter(prefix="/image-ai", tags=["image-ai"])


class GeneratePromptRequest(BaseModel):
    title: str
    body: str
    tags: list[str] = []
    category: str | None = None


class GeneratePromptResponse(BaseModel):
    prompt: str


class GenerateImageRequest(BaseModel):
    prompt: str


class GenerateImageResponse(BaseModel):
    image_data: str


@router.post("/generate-prompt", response_model=GeneratePromptResponse)
async def generate_prompt_endpoint(
    body: GeneratePromptRequest,
    _: User = Depends(get_current_admin),
) -> GeneratePromptResponse:
    """Generate an optimised Imagen prompt from post/project fields. Admin only."""
    prompt = await generate_prompt(
        title=body.title,
        body=body.body,
        tags=body.tags,
        category=body.category,
    )
    return GeneratePromptResponse(prompt=prompt)


@router.post("/generate-image", response_model=GenerateImageResponse)
async def generate_image_endpoint(
    body: GenerateImageRequest,
    _: User = Depends(get_current_admin),
) -> GenerateImageResponse:
    """Generate a 16:9 image via Imagen and return base64-encoded PNG. Admin only."""
    image_data = await generate_image(body.prompt)
    return GenerateImageResponse(image_data=image_data)
