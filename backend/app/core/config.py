import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartPresence AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "user")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "password")
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5432")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "smartpresence")
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}"
    )

    # JWT SECURITY
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_key_for_smart_presence_ai")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    # AI SERVICE
    ML_SERVICE_URL: str = os.getenv("ML_SERVICE_URL", "http://localhost:8001")

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
