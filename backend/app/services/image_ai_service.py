from __future__ import annotations

import base64

from google import genai
from google.genai import types

from app.core.config import get_settings

_settings = get_settings()
_client: genai.Client | None = None


def _get_client() -> genai.Client:
    global _client
    if _client is None:
        _client = genai.Client(api_key=_settings.GEMINI_API_KEY)
    return _client


async def generate_prompt(
    title: str,
    body: str,
    tags: list[str],
    category: str | None = None,
) -> str:
    """Use Gemini to generate an optimised image-generation prompt.

    Receives the post/project fields and returns a detailed English prompt
    suitable for generating a cover image.
    """
    client = _get_client()

    context_parts = [f"Title: {title}"]
    if tags:
        context_parts.append(f"Tags: {', '.join(tags)}")
    if category:
        context_parts.append(f"Category: {category}")
    if body:
        context_parts.append(f"Content summary: {body[:600]}")

    context = "\n".join(context_parts)

    system_instruction = (
        "You are an expert at writing prompts for AI image generation. "
        "Your prompts produce artistic, high-quality images suitable for "
        "technical blog posts and portfolio covers. "
        "Images must be abstract or conceptual — no text, no UI mockups, "
        "no faces. Emphasise mood, colour palette, and visual metaphor."
    )

    user_prompt = (
        f"Write a detailed image generation prompt in English for a cover image "
        f"that visually represents the following content.\n\n"
        f"{context}\n\n"
        f"Return ONLY the prompt text, no explanation or preamble."
    )

    response = await client.aio.models.generate_content(
        model=_settings.GEMINI_MODEL,
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
        ),
    )
    return response.text.strip()


async def generate_image(prompt: str) -> str:
    """Generate an image with Gemini and return it as a base64-encoded PNG string."""
    client = _get_client()

    response = await client.aio.models.generate_content(
        model=_settings.GEMINI_IMAGE_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE"],
        ),
    )

    for part in response.candidates[0].content.parts:
        if part.inline_data and part.inline_data.data:
            return base64.b64encode(part.inline_data.data).decode("utf-8")

    raise RuntimeError("Gemini did not return an image. Try adjusting the prompt.")
