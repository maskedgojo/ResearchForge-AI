from typing import Any
from uuid import uuid4

from pydantic import BaseModel, Field


class ResearchState(BaseModel):

    research_id: str = Field(
        default_factory=lambda: str(uuid4())
    )

    topic: str

    questions: list[str]

    sources: list[dict[str, Any]] = Field(
        default_factory=list
    )

    context: list[str] = Field(
        default_factory=list
    )

    findings: list[dict[str, Any]] = Field(
        default_factory=list
    )

    critique: dict[str, Any] = Field(
        default_factory=dict
    )

    refinement_history: list[dict[str, Any]] = Field(
        default_factory=list
    )

    report: dict[str, Any] = Field(
        default_factory=dict
    )