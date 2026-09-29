from pydantic import BaseModel, Field


class SourceReference(BaseModel):
    source_id: str
    title: str
    url: str


class ResearchFinding(BaseModel):
    question: str
    summary: str

    key_points: list[str] = Field(
        default_factory=list
    )

    source_ids: list[str] = Field(
        default_factory=list
    )


class ResearchResult(BaseModel):
    topic: str

    findings: list[ResearchFinding] = Field(
        default_factory=list
    )