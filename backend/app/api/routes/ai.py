from fastapi import APIRouter

from app.services.llm_service import generate_response


router = APIRouter()


@router.post("/test-ai")
async def test_ai(prompt: str):
    return {
        "response": await generate_response(prompt)
    }