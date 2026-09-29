import re

from urllib.parse import (
    parse_qsl,
    urlencode,
    urlsplit,
    urlunsplit
)


TRACKING_QUERY_KEYS = {
    "fbclid",
    "gclid",
    "mc_cid",
    "mc_eid",
    "ref",
    "ref_src"
}


SOCIAL_DOMAINS = {
    "facebook.com",
    "linkedin.com",
    "medium.com",
    "reddit.com",
    "substack.com",
    "twitter.com",
    "x.com",
    "youtube.com",
    "youtu.be"
}


ACADEMIC_PRIMARY_DOMAINS = {
    "dl.acm.org": 0.96,
    "doi.org": 0.97,
    "ieeexplore.ieee.org": 0.96,
    "jstor.org": 0.92,
    "nature.com": 0.96,
    "science.org": 0.96,
    "sciencedirect.com": 0.92,
    "link.springer.com": 0.92,
    "springer.com": 0.90,
    "tandfonline.com": 0.90,
    "wiley.com": 0.90
}


ACADEMIC_PREPRINT_DOMAINS = {
    "arxiv.org": 0.88,
    "ssrn.com": 0.82
}


ACADEMIC_REPOSITORY_DOMAINS = {
    "diva-portal.org": 0.86
}


INDEPENDENT_RESEARCH_DOMAINS = {
    "metr.org": 0.92
}


OFFICIAL_TECH_DOMAINS = {
    "anthropic.com",
    "github.blog",
    "github.com",
    "gitlab.com",
    "google.com",
    "microsoft.com",
    "openai.com",
    "research.google"
}


TECH_VENDOR_DOMAINS = {
    "circleci.com",
    "digitalocean.com",
    "hitachidigital.com",
    "infosys.com",
    "jetbrains.com",
    "sonarsource.com",
    "snyk.io",
    "veracode.com"
}


TECH_PUBLICATION_DOMAINS = {
    "csoonline.com",
    "infoq.com",
    "theregister.com"
}


LOW_VALUE_AGGREGATOR_DOMAINS = {
    "alphaxiv.org",
    "awesomepapers.io"
}


ARXIV_ID_PATTERN = re.compile(
    r"(?<!\d)(\d{4}\.\d{4,5})(?:v\d+)?(?!\d)"
)


def _matches_domain(
    domain: str,
    candidate: str
) -> bool:

    return (
        domain == candidate
        or domain.endswith(
            f".{candidate}"
        )
    )


def _matches_any_domain(
    domain: str,
    candidates: set[str]
) -> bool:

    return any(
        _matches_domain(
            domain,
            candidate
        )
        for candidate in candidates
    )


def normalize_url(
    url: str
) -> str:

    if not url:
        return ""


    value = url.strip()


    if not value:
        return ""


    parsed = urlsplit(
        value
        if "://" in value
        else f"https://{value}"
    )


    hostname = (
        parsed.hostname
        or ""
    ).lower()


    if not hostname:
        return ""


    if hostname.startswith(
        "www."
    ):

        hostname = hostname[4:]


    scheme = "https"


    if parsed.port:

        netloc = (
            f"{hostname}:{parsed.port}"
        )

    else:

        netloc = hostname


    path = re.sub(
        r"/{2,}",
        "/",
        parsed.path or "/"
    )


    if hostname == "arxiv.org":

        arxiv_match = (
            ARXIV_ID_PATTERN.search(
                path
            )
        )


        if arxiv_match:

            path = (
                f"/abs/"
                f"{arxiv_match.group(1)}"
            )


    if path != "/":

        path = path.rstrip("/")


    filtered_query = []


    for key, value in parse_qsl(
        parsed.query,
        keep_blank_values=True
    ):

        normalized_key = (
            key.lower()
        )


        if normalized_key.startswith(
            "utm_"
        ):
            continue


        if normalized_key in (
            TRACKING_QUERY_KEYS
        ):
            continue


        filtered_query.append(
            (
                key,
                value
            )
        )


    query = urlencode(
        sorted(
            filtered_query
        ),
        doseq=True
    )


    return urlunsplit(
        (
            scheme,
            netloc,
            path,
            query,
            ""
        )
    )


def build_source_key(
    url: str,
    title: str = ""
) -> str:

    normalized_url = (
        normalize_url(
            url
        )
    )


    if not normalized_url:
        return ""


    parsed = urlsplit(
        normalized_url
    )


    domain = (
        parsed.hostname
        or ""
    ).lower()


    arxiv_match = (
        ARXIV_ID_PATTERN.search(
            normalized_url
        )
    )


    if arxiv_match:

        title_lower = (
            title.lower()
        )


        if (
            _matches_domain(
                domain,
                "arxiv.org"
            )
            or "/papers/" in parsed.path
            or "arxiv" in title_lower
        ):

            return (
                f"arxiv:"
                f"{arxiv_match.group(1)}"
            )


    if _matches_domain(
        domain,
        "doi.org"
    ):

        doi = (
            parsed.path
            .strip("/")
            .lower()
        )


        if doi:

            return f"doi:{doi}"


    return (
        f"url:{normalized_url}"
    )


def _academic_domain_score(
    domain: str
) -> tuple[str, float] | None:

    for candidate, score in (
        ACADEMIC_PRIMARY_DOMAINS.items()
    ):

        if _matches_domain(
            domain,
            candidate
        ):

            return (
                "academic_primary",
                score
            )


    for candidate, score in (
        ACADEMIC_PREPRINT_DOMAINS.items()
    ):

        if _matches_domain(
            domain,
            candidate
        ):

            return (
                "academic_preprint",
                score
            )


    for candidate, score in (
        ACADEMIC_REPOSITORY_DOMAINS.items()
    ):

        if _matches_domain(
            domain,
            candidate
        ):

            return (
                "academic_repository",
                score
            )


    return None


def _quality_label(
    score: float
) -> str:

    if score >= 0.85:
        return "high"

    if score >= 0.70:
        return "medium_high"

    if score >= 0.50:
        return "medium"

    return "low"


def assess_source(
    title: str,
    url: str
) -> dict:

    normalized_url = (
        normalize_url(
            url
        )
    )


    parsed = urlsplit(
        normalized_url
    )


    domain = (
        parsed.hostname
        or ""
    ).lower()


    title_lower = (
        title.lower()
    )


    score = 0.55
    source_type = "general_web"
    is_primary = False


    academic_result = (
        _academic_domain_score(
            domain
        )
    )


    if academic_result:

        (
            source_type,
            score
        ) = academic_result

        is_primary = True


    elif domain.endswith(
        ".gov"
    ):

        score = 0.95
        source_type = (
            "government"
        )
        is_primary = True


    elif (
        domain.endswith(
            ".edu"
        )
        or ".ac." in domain
    ):

        score = 0.88
        source_type = (
            "academic_institution"
        )
        is_primary = True


    elif _matches_any_domain(
        domain,
        set(
            INDEPENDENT_RESEARCH_DOMAINS
        )
    ):

        score = 0.92
        source_type = (
            "independent_research"
        )
        is_primary = True


    elif _matches_any_domain(
        domain,
        SOCIAL_DOMAINS
    ):

        score = 0.30
        source_type = (
            "social_or_personal"
        )


    elif _matches_any_domain(
        domain,
        LOW_VALUE_AGGREGATOR_DOMAINS
    ):

        score = 0.42
        source_type = (
            "research_aggregator"
        )


    elif _matches_any_domain(
        domain,
        OFFICIAL_TECH_DOMAINS
    ):

        score = 0.76
        source_type = (
            "official_technical"
        )


        if any(
            keyword in (
                normalized_url.lower()
                + " "
                + title_lower
            )
            for keyword in (
                "research",
                "study",
                "report",
                "paper",
                "whitepaper"
            )
        ):

            score = 0.84
            is_primary = True


    elif _matches_any_domain(
        domain,
        TECH_VENDOR_DOMAINS
    ):

        score = 0.64
        source_type = (
            "vendor_technical"
        )


    elif _matches_any_domain(
        domain,
        TECH_PUBLICATION_DOMAINS
    ):

        score = 0.68
        source_type = (
            "technical_publication"
        )


    if source_type not in {
        "social_or_personal",
        "research_aggregator"
    }:

        if any(
            phrase in title_lower
            for phrase in (
                "empirical study",
                "systematic review",
                "peer-reviewed",
                "proceedings",
                "randomized",
                "controlled study"
            )
        ):

            score += 0.04


    if any(
        phrase in title_lower
        for phrase in (
            "sponsored",
            "ultimate guide",
            "best tools",
            "top 10"
        )
    ):

        score -= 0.05


    score = max(
        0.0,
        min(
            score,
            1.0
        )
    )


    return {
        "normalized_url": normalized_url,
        "source_key": build_source_key(
            normalized_url,
            title
        ),
        "domain": domain,
        "source_type": source_type,
        "quality_score": round(
            score,
            3
        ),
        "quality_label": (
            _quality_label(
                score
            )
        ),
        "is_primary": is_primary
    }