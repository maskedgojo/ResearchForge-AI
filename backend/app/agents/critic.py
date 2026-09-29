import json

from app.schemas.state import ResearchState
from app.schemas.critic import CriticFeedback

from app.services.llm_service import (
    generate_structured_response
)

from app.services.llm.models import (
    CRITIC_MODEL
)

from app.prompts.critic import (
    CRITIC_SYSTEM_PROMPT
)


async def run_critic(
    state: ResearchState
) -> ResearchState:

    findings = json.dumps(
        state.findings,
        indent=2,
        ensure_ascii=False
    )

    prompt = f"""
Research Topic:

{state.topic}


Research Findings:

{findings}


Review the research findings carefully.

Evaluate:

- accuracy
- completeness
- quality of evidence
- whether sources support the findings
- missing information
- weak arguments
- areas that should be improved

Provide an overall research quality score from 0 to 10.
"""

    result = await generate_structured_response(
        prompt=prompt,
        schema=CriticFeedback,
        system_instruction=CRITIC_SYSTEM_PROMPT,
        model=CRITIC_MODEL
    )

    state.critique = result.model_dump()

    return state