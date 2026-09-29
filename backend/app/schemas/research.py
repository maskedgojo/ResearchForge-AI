from pydantic import BaseModel, Field


class ResearchPlanRequest(BaseModel):
    topic: str = Field(
        min_length=3,
        max_length=300
    )


class ResearchPlan(BaseModel):
    topic: str

    research_objective: str

    questions: list[str] = Field(
        min_length=5
    )

    expected_sections: list[str] = Field(
        min_length=3
    )

    difficulty_level: str