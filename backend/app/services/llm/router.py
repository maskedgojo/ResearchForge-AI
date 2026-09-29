from app.services.llm.gemini import generate
from app.services.llm.models import (
    PLANNER_MODEL,
    RESEARCHER_MODEL,
    CRITIC_MODEL,
    WRITER_MODEL
)


MODEL_MAP = {
    "planner": PLANNER_MODEL,
    "researcher": RESEARCHER_MODEL,
    "critic": CRITIC_MODEL,
    "writer": WRITER_MODEL
}


async def generate_response(
    agent: str,
    prompt: str
) -> str:

    model = MODEL_MAP.get(agent)

    if not model:
        raise ValueError(
            f"Unknown agent: {agent}"
        )

    return await generate(
        model=model,
        prompt=prompt
    )