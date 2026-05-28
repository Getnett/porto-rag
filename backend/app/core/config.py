from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    GCS_BUCKET_NAME: str = "rag_prod_docs"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()