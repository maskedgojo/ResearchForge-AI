from fastapi import APIRouter

from app.api.routes import (
    health,
    research,
    ai
)


router = APIRouter()


router.include_router(
    health.router
)


router.include_router(
    research.router
)


router.include_router(
    ai.router
)