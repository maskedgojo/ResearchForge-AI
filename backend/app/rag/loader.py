from uuid import uuid4

from app.rag.vectorstore import (
    vector_store
)


class Loader:

    def ingest_sources(
        self,
        sources: list[dict],
        research_id: str
    ) -> None:

        for source in sources:

            content = source.get(
                "content"
            )


            if not content:
                continue


            vector_store.add_document(
                document_id=str(
                    uuid4()
                ),
                text=content,
                metadata={
                    "research_id": (
                        research_id
                    ),
                    "title": source.get(
                        "title",
                        ""
                    ),
                    "url": source.get(
                        "url",
                        ""
                    ),
                    "source_key": (
                        source.get(
                            "source_key",
                            ""
                        )
                    ),
                    "domain": source.get(
                        "domain",
                        ""
                    ),
                    "source_type": (
                        source.get(
                            "source_type",
                            "general_web"
                        )
                    ),
                    "quality_score": float(
                        source.get(
                            "quality_score",
                            0.5
                        )
                    ),
                    "quality_label": (
                        source.get(
                            "quality_label",
                            "medium"
                        )
                    ),
                    "is_primary": bool(
                        source.get(
                            "is_primary",
                            False
                        )
                    )
                }
            )


loader = Loader()