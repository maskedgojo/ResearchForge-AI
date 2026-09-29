from pydantic import BaseModel, Field


class CriticFeedback(BaseModel):

    overall_score: int = Field(
        default=0,
        ge=0,
        le=10
    )

    strengths: list[str] = Field(
        default_factory=list
    )

    missing_points: list[str] = Field(
        default_factory=list
    )

    recommendations: list[str] = Field(
        default_factory=list
    )