from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import router
from app.core.config import settings


app = FastAPI(
    title=settings.app_name,
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        settings.frontend_url
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)


app.include_router(
    router
)


@app.get("/")
async def root():

    return {
        "message": "ResearchForge AI API running"
    }