import asyncio

from app.rag.loader import loader
from app.schemas.state import ResearchState
from app.services.search_service import (
    SearchUnavailableError,
    search_web
)
from app.services.source_quality import (
    build_source_key
)


MAX_SEARCH_CONCURRENCY = 3


def _get_existing_source_keys(
    state: ResearchState
) -> set[str]:
    source_keys = set()

    for source in state.sources:
        source_key = source.get(
            "source_key"
        )

        if not source_key:
            source_key = build_source_key(
                url=source.get(
                    "url",
                    ""
                ),
                title=source.get(
                    "title",
                    ""
                )
            )

        if source_key:
            source_keys.add(
                source_key
            )

    return source_keys


def _prefer_source(
    current: dict,
    candidate: dict
) -> dict:
    current_quality = float(
        current.get(
            "quality_score",
            0.0
        )
    )

    candidate_quality = float(
        candidate.get(
            "quality_score",
            0.0
        )
    )

    if candidate_quality > current_quality:
        return candidate

    if candidate_quality < current_quality:
        return current

    current_content = current.get(
        "content",
        ""
    )

    candidate_content = candidate.get(
        "content",
        ""
    )

    if len(candidate_content) > len(current_content):
        return candidate

    return current


async def _search_query(
    query: str,
    semaphore: asyncio.Semaphore
) -> list[dict] | None:
    async with semaphore:
        try:
            return await search_web(
                query
            )

        except SearchUnavailableError:
            return None


async def _search_queries(
    state: ResearchState,
    queries: list[str]
) -> ResearchState:
    if not queries:
        return state

    existing_source_keys = (
        _get_existing_source_keys(
            state
        )
    )

    semaphore = asyncio.Semaphore(
        MAX_SEARCH_CONCURRENCY
    )

    search_results = await asyncio.gather(
        *[
            _search_query(
                query=query,
                semaphore=semaphore
            )
            for query in queries
        ]
    )

    successful_results = [
        results
        for results in search_results
        if results is not None
    ]

    if not successful_results:
        raise SearchUnavailableError(
            "All web search requests failed "
            "after retry attempts."
        )

    candidates_by_key = {}

    for results in successful_results:
        for result in results:
            source_key = result.get(
                "source_key"
            )

            if not source_key:
                continue

            if source_key in existing_source_keys:
                continue

            existing_candidate = (
                candidates_by_key.get(
                    source_key
                )
            )

            if existing_candidate is None:
                candidates_by_key[
                    source_key
                ] = result

                continue

            candidates_by_key[
                source_key
            ] = _prefer_source(
                current=existing_candidate,
                candidate=result
            )

    new_sources = list(
        candidates_by_key.values()
    )

    if not new_sources:
        return state

    new_sources.sort(
        key=lambda source: (
            float(
                source.get(
                    "quality_score",
                    0.0
                )
            ),
            bool(
                source.get(
                    "is_primary",
                    False
                )
            )
        ),
        reverse=True
    )

    state.sources.extend(
        new_sources
    )

    loader.ingest_sources(
        sources=new_sources,
        research_id=state.research_id
    )

    return state


async def run_searcher(
    state: ResearchState
) -> ResearchState:
    return await _search_queries(
        state=state,
        queries=state.questions
    )


async def run_targeted_searcher(
    state: ResearchState,
    questions: list[str]
) -> ResearchState:
    return await _search_queries(
        state=state,
        queries=questions
    )