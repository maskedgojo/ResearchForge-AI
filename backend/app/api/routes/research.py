from fastapi import (
    APIRouter,
    HTTPException,
    status
)

from app.agents.critic import run_critic
from app.agents.planner import create_research_plan
from app.agents.refiner import create_refinement_plan
from app.agents.researcher import run_researcher
from app.agents.searcher import (
    run_searcher,
    run_targeted_searcher
)
from app.agents.writer import run_writer

from app.schemas.critic import CriticFeedback
from app.schemas.report import ResearchReport
from app.schemas.research import (
    ResearchPlan,
    ResearchPlanRequest
)
from app.schemas.research_response import (
    PublicResearchFinding,
    PublicSource,
    RefinementRound,
    ResearchAnalysisResponse
)
from app.schemas.state import ResearchState

from app.services.llm_service import (
    LLMUnavailableError,
    StructuredOutputError
)
from app.services.search_service import (
    SearchUnavailableError
)


router = APIRouter(
    prefix="/research",
    tags=["Research"]
)


MAX_REFINEMENT_ROUNDS = 2


def _needs_refinement(
    state: ResearchState
) -> bool:
    score = state.critique.get(
        "overall_score",
        0
    )

    missing_points = state.critique.get(
        "missing_points",
        []
    )

    if score < 8:
        return True

    if score == 8 and missing_points:
        return True

    return False


def _get_new_questions(
    state: ResearchState,
    generated_questions: list[str]
) -> list[str]:
    existing_questions = {
        question.strip().lower()
        for question in state.questions
    }

    new_questions = []

    for question in generated_questions:
        normalized_question = (
            question.strip()
        )

        if not normalized_question:
            continue

        normalized_key = (
            normalized_question.lower()
        )

        if normalized_key in existing_questions:
            continue

        existing_questions.add(
            normalized_key
        )

        new_questions.append(
            normalized_question
        )

    return new_questions


def _build_public_sources(
    state: ResearchState
) -> list[PublicSource]:
    public_sources = []

    for index, source in enumerate(
        state.sources,
        start=1
    ):
        public_sources.append(
            PublicSource(
                source_id=f"S{index}",
                title=source.get(
                    "title",
                    ""
                ),
                url=source.get(
                    "url",
                    ""
                ),
                domain=source.get(
                    "domain",
                    ""
                ),
                source_type=source.get(
                    "source_type",
                    "general_web"
                ),
                quality_score=float(
                    source.get(
                        "quality_score",
                        0.5
                    )
                ),
                quality_label=source.get(
                    "quality_label",
                    "medium"
                ),
                is_primary=bool(
                    source.get(
                        "is_primary",
                        False
                    )
                ),
                images=source.get(
                    "images",
                    []
                )
            )
        )

    return public_sources


def _build_response(
    state: ResearchState
) -> ResearchAnalysisResponse:
    return ResearchAnalysisResponse(
        research_id=state.research_id,
        topic=state.topic,
        questions=state.questions,
        sources=_build_public_sources(
            state
        ),
        findings=[
            PublicResearchFinding.model_validate(
                finding
            )
            for finding in state.findings
        ],
        critique=CriticFeedback.model_validate(
            state.critique
        ),
        refinement_history=[
            RefinementRound.model_validate(
                round_data
            )
            for round_data
            in state.refinement_history
        ],
        report=ResearchReport.model_validate(
            state.report
        )
    )


@router.post(
    "/plan",
    response_model=ResearchPlan
)
async def plan_research(
    request: ResearchPlanRequest
) -> ResearchPlan:
    try:
        return await create_research_plan(
            request.topic
        )

    except StructuredOutputError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_502_BAD_GATEWAY
            ),
            detail=str(error)
        ) from error

    except LLMUnavailableError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_503_SERVICE_UNAVAILABLE
            ),
            detail=str(error)
        ) from error


@router.post(
    "/analyze",
    response_model=ResearchAnalysisResponse
)
async def analyze_research(
    request: ResearchPlanRequest
) -> ResearchAnalysisResponse:
    try:
        plan = await create_research_plan(
            request.topic
        )

        state = ResearchState(
            topic=plan.topic,
            questions=plan.questions
        )

        state = await run_searcher(
            state
        )

        state = await run_researcher(
            state
        )

        state = await run_critic(
            state
        )

        for round_number in range(
            1,
            MAX_REFINEMENT_ROUNDS + 1
        ):
            if not _needs_refinement(
                state
            ):
                break

            critique_before = (
                state.critique.copy()
            )

            refinement_plan = (
                await create_refinement_plan(
                    state
                )
            )

            new_questions = _get_new_questions(
                state=state,
                generated_questions=(
                    refinement_plan.questions
                )
            )

            if not new_questions:
                break

            state.questions.extend(
                new_questions
            )

            state = await run_targeted_searcher(
                state=state,
                questions=new_questions
            )

            state = await run_researcher(
                state=state,
                questions=new_questions
            )

            state = await run_critic(
                state
            )

            state.refinement_history.append(
                {
                    "round": round_number,
                    "questions": new_questions,
                    "score_before": (
                        critique_before.get(
                            "overall_score"
                        )
                    ),
                    "score_after": (
                        state.critique.get(
                            "overall_score"
                        )
                    ),
                    "missing_points_before": (
                        critique_before.get(
                            "missing_points",
                            []
                        )
                    ),
                    "missing_points_after": (
                        state.critique.get(
                            "missing_points",
                            []
                        )
                    )
                }
            )

        state = await run_writer(
            state
        )

        return _build_response(
            state
        )

    except SearchUnavailableError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_503_SERVICE_UNAVAILABLE
            ),
            detail=str(error)
        ) from error

    except StructuredOutputError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_502_BAD_GATEWAY
            ),
            detail=str(error)
        ) from error

    except LLMUnavailableError as error:
        raise HTTPException(
            status_code=(
                status.HTTP_503_SERVICE_UNAVAILABLE
            ),
            detail=str(error)
        ) from error