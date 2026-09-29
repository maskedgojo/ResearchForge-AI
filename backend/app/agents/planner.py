from app.prompts.planner import PLANNER_SYSTEM_PROMPT
from app.schemas.research import ResearchPlan
from app.services.llm.router import generate_response


async def create_research_plan(
    topic: str
) -> ResearchPlan:

    response = await generate_response(
        agent="planner",
        prompt=f"""
{PLANNER_SYSTEM_PROMPT}

Topic:
{topic}

Return JSON only.
"""
    )

    return ResearchPlan.model_validate_json(
        response
    )