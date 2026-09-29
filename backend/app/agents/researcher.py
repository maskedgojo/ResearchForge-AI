import asyncio

from app.prompts.researcher import (
    RESEARCHER_SYSTEM_PROMPT
)

from app.rag.retriever import retriever

from app.schemas.research_result import (
    ResearchResult,
    SourceReference
)

from app.schemas.state import ResearchState

from app.services.llm.models import (
    RESEARCHER_MODEL
)

from app.services.llm_service import (
    generate_structured_response
)


MAX_RESEARCH_CONCURRENCY = 3


def _normalize_question(
    question: str
) -> str:

    return question.strip().lower()


def _build_source_id_lookup(
    state: ResearchState
) -> dict[str, str]:

    source_ids_by_url = {}

    for index, source in enumerate(
        state.sources,
        start=1
    ):

        url = source.get(
            "url"
        )

        if not url:
            continue

        source_ids_by_url[
            url
        ] = f"S{index}"

    return source_ids_by_url


def _validate_source_ids(
    source_ids: list[str],
    trusted_sources: dict[str, SourceReference]
) -> list[str]:

    validated_ids = []
    seen_ids = set()

    for source_id in source_ids:

        if source_id not in trusted_sources:
            continue

        if source_id in seen_ids:
            continue

        seen_ids.add(
            source_id
        )

        validated_ids.append(
            source_id
        )

    return validated_ids


async def _research_question(
    state: ResearchState,
    question: str,
    source_ids_by_url: dict[str, str],
    semaphore: asyncio.Semaphore
) -> tuple[str, dict | None]:

    normalized_question = (
        _normalize_question(
            question
        )
    )

    retrieved_sources = retriever.retrieve(
        query=question,
        research_id=state.research_id,
        limit=8
    )

    if not retrieved_sources:

        return (
            normalized_question,
            None
        )

    context_parts = []
    trusted_sources = {}

    for source in retrieved_sources:

        url = source.get(
            "url",
            ""
        )

        source_id = (
            source_ids_by_url.get(
                url
            )
        )

        if not source_id:
            continue

        trusted_source = SourceReference(
            source_id=source_id,
            title=source.get(
                "title",
                ""
            ),
            url=url
        )

        trusted_sources[
            source_id
        ] = trusted_source

        context_parts.append(
            f"""
SOURCE ID:
{source_id}

Title:
{trusted_source.title}

URL:
{trusted_source.url}

Content:
{source.get("content", "")}
"""
        )

    if not trusted_sources:

        return (
            normalized_question,
            None
        )

    context = "\n\n".join(
        context_parts
    )

    prompt = f"""
Research Topic:

{state.topic}


Research Question:

{question}


Retrieved Research Context:

{context}


Answer ONLY the research question above.

Use only the supplied research context.

For every factual statement, use evidence from the supplied sources.

Return the source IDs that actually support your answer.

Do not return source titles or URLs.

Do not invent source IDs.

Return valid JSON only.
"""

    async with semaphore:

        result = await generate_structured_response(
            prompt=prompt,
            schema=ResearchResult,
            system_instruction=RESEARCHER_SYSTEM_PROMPT,
            model=RESEARCHER_MODEL
        )

    if not result.findings:

        return (
            normalized_question,
            None
        )

    finding = result.findings[0]

    finding.question = question

    validated_source_ids = (
        _validate_source_ids(
            source_ids=finding.source_ids,
            trusted_sources=trusted_sources
        )
    )

    return (
        normalized_question,
        {
            "question": question,
            "summary": finding.summary,
            "key_points": finding.key_points,
            "source_ids": validated_source_ids,
            "sources": [
                trusted_sources[
                    source_id
                ].model_dump()

                for source_id in validated_source_ids
            ]
        }
    )


async def run_researcher(
    state: ResearchState,
    questions: list[str] | None = None
) -> ResearchState:

    target_questions = (
        questions
        if questions is not None
        else state.questions
    )

    findings_by_question = {
        _normalize_question(
            finding.get(
                "question",
                ""
            )
        ): finding

        for finding in state.findings

        if finding.get(
            "question"
        )
    }

    unanswered_questions = [
        question

        for question in target_questions

        if _normalize_question(
            question
        ) not in findings_by_question
    ]

    if not unanswered_questions:

        return state

    source_ids_by_url = (
        _build_source_id_lookup(
            state
        )
    )

    semaphore = asyncio.Semaphore(
        MAX_RESEARCH_CONCURRENCY
    )

    research_results = await asyncio.gather(
        *[
            _research_question(
                state=state,
                question=question,
                source_ids_by_url=(
                    source_ids_by_url
                ),
                semaphore=semaphore
            )
            for question in unanswered_questions
        ]
    )

    for (
        normalized_question,
        finding
    ) in research_results:

        if finding is None:
            continue

        findings_by_question[
            normalized_question
        ] = finding

    state.findings = [
        findings_by_question[
            normalized_question
        ]

        for question in state.questions

        if (
            normalized_question := (
                _normalize_question(
                    question
                )
            )
        ) in findings_by_question
    ]

    return state