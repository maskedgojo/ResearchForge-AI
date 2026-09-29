from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    app_name: str = "ResearchForge AI"

    environment: str = "development"


    gemini_api_key: str

    tavily_api_key: str


    frontend_url: str = (
        "http://localhost:3000"
    )


    chroma_path: str = (
        "./chroma_db"
    )


    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()