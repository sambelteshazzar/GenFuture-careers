from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")
    
    DATABASE_URL: str = "sqlite:///./genfuture.db"
    ONET_API_KEY: Optional[str] = None
    BLS_API_KEY: Optional[str] = None

    # Environment
    ENVIRONMENT: str = "development"  # 'development' | 'staging' | 'production'

    # Security / Auth settings loaded from environment
    SECRET_KEY: Optional[str] = None
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS and Host protection (comma-separated lists)
    CORS_ALLOW_ORIGINS: Optional[str] = None
    ALLOWED_HOSTS: Optional[str] = None

settings = Settings()
