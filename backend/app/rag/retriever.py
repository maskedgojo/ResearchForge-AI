from typing import Any

from app.rag.vectorstore import (
    vector_store
)


SEMANTIC_WEIGHT = 0.72
QUALITY_WEIGHT = 0.23
PRIMARY_SOURCE_WEIGHT = 0.05

DEFAULT_QUALITY_SCORE = 0.50

CANDIDATE_MULTIPLIER = 4
MINIMUM_CANDIDATES = 12


def _to_float(
    value,
    default: float
) -> float:

    try:

        return float(
            value
        )

    except (
        TypeError,
        ValueError
    ):

        return default


def _semantic_score(
    distance
) -> float:

    normalized_distance = max(
        _to_float(
            distance,
            1.0
        ),
        0.0
    )


    return (
        1.0
        / (
            1.0
            + normalized_distance
        )
    )


def _combined_score(
    semantic_score: float,
    quality_score: float,
    is_primary: bool
) -> float:

    primary_score = (
        1.0
        if is_primary
        else 0.0
    )


    return (
        SEMANTIC_WEIGHT
        * semantic_score

        + QUALITY_WEIGHT
        * quality_score

        + PRIMARY_SOURCE_WEIGHT
        * primary_score
    )


class Retriever:

    def retrieve(
        self,
        query: str,
        research_id: str,
        limit: int = 3
    ) -> list[dict[str, Any]]:

        if limit <= 0:
            return []


        candidate_limit = max(
            limit
            * CANDIDATE_MULTIPLIER,
            MINIMUM_CANDIDATES
        )


        results = vector_store.search(
            query=query,
            research_id=research_id,
            limit=candidate_limit
        )


        documents = (
            results.get(
                "documents"
            )
            or [[]]
        )[0]


        metadatas = (
            results.get(
                "metadatas"
            )
            or [[]]
        )[0]


        distances = (
            results.get(
                "distances"
            )
            or [[]]
        )[0]


        candidates = []


        for document, metadata, distance in zip(
            documents,
            metadatas,
            distances
        ):

            semantic_score = (
                _semantic_score(
                    distance
                )
            )


            quality_score = max(
                0.0,
                min(
                    _to_float(
                        metadata.get(
                            "quality_score"
                        ),
                        DEFAULT_QUALITY_SCORE
                    ),
                    1.0
                )
            )


            is_primary = bool(
                metadata.get(
                    "is_primary",
                    False
                )
            )


            final_score = (
                _combined_score(
                    semantic_score=(
                        semantic_score
                    ),
                    quality_score=(
                        quality_score
                    ),
                    is_primary=(
                        is_primary
                    )
                )
            )


            candidates.append(
                {
                    "content": document,
                    "title": metadata.get(
                        "title",
                        ""
                    ),
                    "url": metadata.get(
                        "url",
                        ""
                    ),
                    "source_key": (
                        metadata.get(
                            "source_key",
                            ""
                        )
                    ),
                    "domain": metadata.get(
                        "domain",
                        ""
                    ),
                    "source_type": (
                        metadata.get(
                            "source_type",
                            "general_web"
                        )
                    ),
                    "quality_score": (
                        quality_score
                    ),
                    "quality_label": (
                        metadata.get(
                            "quality_label",
                            "medium"
                        )
                    ),
                    "is_primary": (
                        is_primary
                    ),
                    "distance": (
                        _to_float(
                            distance,
                            1.0
                        )
                    ),
                    "semantic_score": round(
                        semantic_score,
                        4
                    ),
                    "retrieval_score": round(
                        final_score,
                        4
                    )
                }
            )


        candidates.sort(
            key=lambda source: (
                source[
                    "retrieval_score"
                ]
            ),
            reverse=True
        )


        selected_sources = []

        seen_source_keys = set()


        for candidate in candidates:

            source_key = (
                candidate.get(
                    "source_key"
                )
            )


            if (
                source_key
                and source_key
                in seen_source_keys
            ):

                continue


            if source_key:

                seen_source_keys.add(
                    source_key
                )


            selected_sources.append(
                candidate
            )


            if (
                len(selected_sources)
                >= limit
            ):

                break


        return selected_sources


retriever = Retriever()