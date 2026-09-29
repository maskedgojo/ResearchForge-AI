import asyncio
import logging

from typing import TypeVar

from google import genai
from google.genai import types

from pydantic import BaseModel, ValidationError

from app.core.config import settings


logger = logging.getLogger(
    "researchforge.llm"
)


T = TypeVar(
    "T",
    bound=BaseModel
)


client = genai.Client(
    api_key=settings.gemini_api_key
)


# Structured JSON validation retries
MAX_STRUCTURED_RETRIES = 2


# API failure retries
MAX_LLM_RETRIES = 3


class LLMUnavailableError(RuntimeError):
    pass


class StructuredOutputError(RuntimeError):
    pass



async def _retry_delay(
    attempt: int
):

    delay = 2 ** attempt

    logger.warning(
        f"LLM retry waiting {delay}s"
    )

    await asyncio.sleep(
        delay
    )



async def generate_response(
    prompt: str,
    model: str
) -> str:


    for attempt in range(
        MAX_LLM_RETRIES
    ):

        try:

            logger.info(
                f"LLM request started | model={model}"
            )


            response = await client.aio.models.generate_content(
                model=model,
                contents=prompt
            )


            if not response.text:

                raise ValueError(
                    "Gemini returned empty response"
                )


            logger.info(
                "LLM request completed"
            )


            return response.text



        except Exception as error:


            error_message = str(error)


            logger.error(
                f"LLM failure attempt {attempt + 1}: {error_message}"
            )


            # Retry temporary failures
            if (
                "429" in error_message
                or "RESOURCE_EXHAUSTED" in error_message
                or "503" in error_message
                or "timeout" in error_message.lower()
            ):

                if attempt < MAX_LLM_RETRIES - 1:

                    await _retry_delay(
                        attempt
                    )

                    continue


            raise LLMUnavailableError(
                f"LLM request failed: {error_message}"
            ) from error



    raise LLMUnavailableError(
        "LLM unavailable after retries"
    )




async def generate_structured_response(
    prompt: str,
    schema: type[T],
    system_instruction: str,
    model: str
) -> T:


    last_validation_error = None


    for attempt in range(
        MAX_STRUCTURED_RETRIES + 1
    ):


        retry_instruction = ""


        if attempt > 0:

            retry_instruction = """

The previous response failed validation.

Return the complete JSON again.

Follow the schema exactly.

Rules:
- JSON only
- No markdown
- No explanations
- No code fences
"""



        for llm_attempt in range(
            MAX_LLM_RETRIES
        ):


            try:


                logger.info(
                    f"Structured LLM call | model={model} | attempt={attempt + 1}"
                )


                response = await client.aio.models.generate_content(

                    model=model,

                    contents=f"""
{prompt}

{retry_instruction}
""",

                    config=types.GenerateContentConfig(

                        system_instruction=(
                            system_instruction
                        ),

                        response_mime_type=(
                            "application/json"
                        ),

                        response_schema=schema,

                        max_output_tokens=8192
                    )
                )


                break



            except Exception as error:


                error_message = str(error)


                logger.error(
                    f"Structured LLM failure: {error_message}"
                )


                if (
                    (
                        "429" in error_message
                        or "RESOURCE_EXHAUSTED" in error_message
                        or "503" in error_message
                    )
                    and llm_attempt < MAX_LLM_RETRIES - 1
                ):

                    await _retry_delay(
                        llm_attempt
                    )

                    continue


                raise LLMUnavailableError(
                    f"Structured LLM request failed: {error_message}"
                ) from error



        try:


            if response.parsed is not None:


                return schema.model_validate(
                    response.parsed
                )



            if not response.text:

                raise ValueError(
                    "Gemini returned empty structured output"
                )



            return schema.model_validate_json(
                response.text
            )



        except (
            ValidationError,
            ValueError
        ) as error:


            last_validation_error = error


            logger.warning(
                f"Schema validation failed attempt {attempt + 1}: {error}"
            )



    raise StructuredOutputError(

        "Gemini returned invalid structured output "
        f"after {MAX_STRUCTURED_RETRIES + 1} attempts. "
        f"Last error: {last_validation_error}"

    )