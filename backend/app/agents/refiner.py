import json

from app.prompts.refiner import (
    REFINER_SYSTEM_PROMPT
)

from app.schemas.refinement import (
    RefinementPlan
)

from app.schemas.state import (
    ResearchState
)

from app.services.llm.models import (
    PLANNER_MODEL
)

from app.services.llm_service import (
    generate_structured_response
)


async def create_refinement_plan(
    state: ResearchState
) -> RefinementPlan:

    existing_questions = json.dumps(
        state.questions,
        indent=2,
        ensure_ascii=False
    )

    critique = json.dumps(
        state.critique,
        indent=2,
        ensure_ascii=False
    )

    prompt = f"""
Research Topic:

{state.topic}


Existing Research Questions:

{existing_questions}


Critic Feedback:

{critique}


Generate targeted follow-up research questions that address
the most important unresolved weaknesses identified by the critic.

Do not repeat any existing research question.
"""

    return await generate_structured_response(
        prompt=prompt,
        schema=RefinementPlan,
        system_instruction=REFINER_SYSTEM_PROMPT,
        model=PLANNER_MODEL
    )