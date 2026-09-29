from pydantic import BaseModel, Field

from app.schemas.critic import CriticFeedback
from app.schemas.report import ResearchReport
from app.schemas.research_result import SourceReference


class PublicSourceImage(BaseModel):
    url: str
    description: str = ""


class PublicSource(BaseModel):
    source_id: str
    title: str
    url: str

    domain: str = ""
    source_type: str = "general_web"

    quality_score: float = 0.5
    quality_label: str = "medium"

    is_primary: bool = False

    images: list[PublicSourceImage] = Field(
        default_factory=list
    )


class PublicResearchFinding(BaseModel):
    question: str
    summary: str

    key_points: list[str] = Field(
        default_factory=list
    )

    source_ids: list[str] = Field(
        default_factory=list
    )

    sources: list[SourceReference] = Field(
        default_factory=list
    )


class RefinementRound(BaseModel):
    round: int

    questions: list[str] = Field(
        default_factory=list
    )

    score_before: int | None = None
    score_after: int | None = None

    missing_points_before: list[str] = Field(
        default_factory=list
    )

    missing_points_after: list[str] = Field(
        default_factory=list
    )


class ResearchAnalysisResponse(BaseModel):
    research_id: str
    topic: str

    questions: list[str] = Field(
        default_factory=list
    )

    sources: list[PublicSource] = Field(
        default_factory=list
    )

    findings: list[PublicResearchFinding] = Field(
        default_factory=list
    )

    critique: CriticFeedback

    refinement_history: list[RefinementRound] = Field(
        default_factory=list
    )

    report: ResearchReport