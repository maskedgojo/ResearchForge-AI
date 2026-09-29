from pydantic import BaseModel, Field


class ReportSource(BaseModel):
    source_id: str
    title: str
    url: str


class ReportSectionDraft(BaseModel):
    heading: str
    content: str

    source_ids: list[str] = Field(
        default_factory=list
    )


class ResearchReportDraft(BaseModel):
    title: str
    executive_summary: str

    sections: list[ReportSectionDraft] = Field(
        default_factory=list
    )

    conclusion: str


class ReportSection(BaseModel):
    heading: str
    content: str

    source_ids: list[str] = Field(
        default_factory=list
    )

    sources: list[ReportSource] = Field(
        default_factory=list
    )


class ResearchReport(BaseModel):
    title: str
    executive_summary: str

    sections: list[ReportSection] = Field(
        default_factory=list
    )

    conclusion: str

    sources: list[ReportSource] = Field(
        default_factory=list
    )