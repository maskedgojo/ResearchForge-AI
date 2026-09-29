from pydantic import BaseModel, Field


class RefinementPlan(BaseModel):

    questions: list[str] = Field(
        default_factory=list,
        max_length=3
    )