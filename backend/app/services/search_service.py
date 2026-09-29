import asyncio
from typing import Any

from tavily import TavilyClient

from app.core.config import settings
from app.services.source_quality import assess_source


MAX_SEARCH_RETRIES = 3
RETRY_BASE_DELAY = 0.75
MAX_IMAGES_PER_SOURCE = 3


class SearchUnavailableError(RuntimeError):
    pass


def _perform_search(
    query: str
) -> dict[str, Any]:
    client = TavilyClient(
        api_key=settings.tavily_api_key
    )

    return client.search(
        query=query,
        search_depth="advanced",
        max_results=6,
        include_images=True
    )


def _normalize_images(
    raw_images: Any
) -> list[dict[str, str]]:
    if not isinstance(raw_images, list):
        return []

    images = []
    seen_urls = set()

    for item in raw_images:
        if isinstance(item, str):
            url = item.strip()
            description = ""

        elif isinstance(item, dict):
            url = str(
                item.get("url")
                or item.get("image_url")
                or ""
            ).strip()

            description = str(
                item.get("description")
                or item.get("alt")
                or ""
            ).strip()

        else:
            continue

        if not url.startswith(
            ("http://", "https://")
        ):
            continue

        if url in seen_urls:
            continue

        seen_urls.add(url)

        images.append(
            {
                "url": url,
                "description": description
            }
        )

        if len(images) >= MAX_IMAGES_PER_SOURCE:
            break

    return images


async def search_web(
    query: str
) -> list[dict[str, Any]]:
    last_error: Exception | None = None

    for attempt in range(
        MAX_SEARCH_RETRIES
    ):
        try:
            response = await asyncio.to_thread(
                _perform_search,
                query
            )

            results = []

            for result in response.get(
                "results",
                []
            ):
                title = (
                    result.get("title")
                    or ""
                ).strip()

                url = (
                    result.get("url")
                    or ""
                ).strip()

                content = (
                    result.get("content")
                    or ""
                ).strip()

                if not url or not content:
                    continue

                assessment = assess_source(
                    title=title,
                    url=url
                )

                normalized_url = assessment[
                    "normalized_url"
                ]

                if not normalized_url:
                    continue

                results.append(
                    {
                        "title": title,
                        "url": normalized_url,
                        "content": content,
                        "source_key": assessment[
                            "source_key"
                        ],
                        "domain": assessment[
                            "domain"
                        ],
                        "source_type": assessment[
                            "source_type"
                        ],
                        "quality_score": assessment[
                            "quality_score"
                        ],
                        "quality_label": assessment[
                            "quality_label"
                        ],
                        "is_primary": assessment[
                            "is_primary"
                        ],
                        "images": _normalize_images(
                            result.get(
                                "images",
                                []
                            )
                        )
                    }
                )

            return results

        except Exception as error:
            last_error = error

            if attempt == MAX_SEARCH_RETRIES - 1:
                break

            delay = (
                RETRY_BASE_DELAY
                * (2 ** attempt)
            )

            await asyncio.sleep(
                delay
            )

    raise SearchUnavailableError(
        "Web search failed after "
        f"{MAX_SEARCH_RETRIES} attempts. "
        f"Last error: {last_error}"
    )