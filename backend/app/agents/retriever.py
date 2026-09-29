from app.schemas.state import ResearchState
from app.schemas.research_result import ResearchResult

from app.services.llm.models import RESEARCHER_MODEL

from app.services.llm_service import generate_structured_response

from app.prompts.researcher import RESEARCHER_SYSTEM_PROMPT

from app.rag.retriever import retriever



async def run_researcher(
    state: ResearchState
):


    retrieved_sources = []


    for question in state.questions:


        results = retriever.retrieve(

            query=question,

            limit=3

        )


        retrieved_sources.extend(
            results
        )



    context = ""


    for index, source in enumerate(
        retrieved_sources
    ):


        context += f"""

SOURCE {index+1}

Title:
{source['title']}

URL:
{source['url']}

Content:
{source['content']}


"""



    prompt=f"""

Topic:

{state.topic}



Research Context:

{context}



Questions:

{state.questions}



Answer every question.

For every finding include:

- summary
- key_points
- sources used

Only use provided sources.

Return JSON only.

"""



    result = await generate_structured_response(

        prompt=prompt,

        schema=ResearchResult,

        system_instruction=RESEARCHER_SYSTEM_PROMPT,

        model=RESEARCHER_MODEL

    )



    state.findings=[

        finding.model_dump()

        for finding in result.findings

    ]


    return state