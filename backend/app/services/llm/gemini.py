from google import genai

from app.core.config import settings


client = genai.Client(
    api_key=settings.gemini_api_key
)


async def generate(
    model: str,
    prompt: str
) -> str:

    response = await client.aio.models.generate_content(
        model=model,
        contents=prompt
    )

    if not response.text:
        raise RuntimeError(
            "Empty response from Gemini"
        )

    return response.text