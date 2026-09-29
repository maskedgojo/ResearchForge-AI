import json

from app.schemas.state import ResearchState

from app.schemas.report import (
    ReportSection,
    ReportSource,
    ResearchReport,
    ResearchReportDraft
)

from app.services.llm_service import (
    generate_structured_response
)

from app.services.llm.models import (
    WRITER_MODEL
)

from app.prompts.writer import (
    WRITER_SYSTEM_PROMPT
)



def _build_source_catalog(
    state: ResearchState
) -> dict[str, ReportSource]:

    source_catalog = {}


    for finding in state.findings:

        for source in finding.get(
            "sources",
            []
        ):

            source_id = source.get(
                "source_id"
            )

            title = source.get(
                "title"
            )

            url = source.get(
                "url"
            )


            if not source_id:
                continue


            if not title or not url:
                continue


            source_catalog[
                source_id
            ] = ReportSource(

                source_id=source_id,

                title=title,

                url=url

            )


    return source_catalog




def _validate_source_ids(
    source_ids: list[str],
    source_catalog: dict[str, ReportSource]
) -> list[str]:


    validated_ids = []

    seen_ids = set()


    for source_id in source_ids:


        if source_id not in source_catalog:
            continue


        if source_id in seen_ids:
            continue


        seen_ids.add(
            source_id
        )


        validated_ids.append(
            source_id
        )


    return validated_ids




def _build_writer_findings(
    state: ResearchState
) -> list[dict]:


    writer_findings = []


    for finding in state.findings:


        writer_findings.append(

            {

                "question": finding.get(
                    "question",
                    ""
                ),


                "summary": finding.get(
                    "summary",
                    ""
                ),


                "key_points": finding.get(
                    "key_points",
                    []
                ),


                "sources": finding.get(
                    "sources",
                    []
                ),


                "source_ids": finding.get(
                    "source_ids",
                    []
                )

            }

        )


    return writer_findings




async def run_writer(
    state: ResearchState
) -> ResearchState:


    source_catalog = (
        _build_source_catalog(
            state
        )
    )


    writer_findings = (
        _build_writer_findings(
            state
        )
    )


    findings = json.dumps(

        writer_findings,

        indent=2,

        ensure_ascii=False

    )


    critique = json.dumps(

        state.critique,

        indent=2,

        ensure_ascii=False

    )


    prompt = f"""

Research Topic:

{state.topic}



Evidence-Grounded Research Findings:

{findings}



Critic Feedback:

{critique}



Create a detailed professional research report.



Requirements:


1. Write a detailed executive summary.

2. Create meaningful sections covering every major research question.

3. Expand explanations with proper context.

4. Explain causes, effects, implications, and examples wherever evidence exists.

5. Preserve important information from the findings.

6. Do not shorten the research into small bullet points.

7. Write like a professional analyst research report.

8. Use only information available in the provided findings.

9. Do not invent facts.

10. Every section must contain supporting source IDs.

11. Return only source IDs already present in the findings.

12. Do not return source titles or URLs.



Return valid JSON only.

"""



    draft = await generate_structured_response(

        prompt=prompt,

        schema=ResearchReportDraft,

        system_instruction=WRITER_SYSTEM_PROMPT,

        model=WRITER_MODEL

    )



    report_sections = []

    report_source_ids = []

    seen_report_source_ids = set()



    for section in draft.sections:


        section_source_ids = (

            _validate_source_ids(

                source_ids=section.source_ids,

                source_catalog=source_catalog

            )

        )



        section_sources = [

            source_catalog[source_id]

            for source_id in section_source_ids

        ]



        report_sections.append(

            ReportSection(

                heading=section.heading,

                content=section.content,

                source_ids=section_source_ids,

                sources=section_sources

            )

        )



        for source_id in section_source_ids:


            if source_id in seen_report_source_ids:

                continue


            seen_report_source_ids.add(
                source_id
            )


            report_source_ids.append(
                source_id
            )




    report = ResearchReport(

        title=draft.title,

        executive_summary=draft.executive_summary,

        sections=report_sections,

        conclusion=draft.conclusion,

        sources=[

            source_catalog[source_id]

            for source_id in report_source_ids

        ]

    )



    state.report = report.model_dump()



    return state