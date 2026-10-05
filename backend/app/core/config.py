"""
Core Application Configuration and Settings.
"""

from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "TomatoCare AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "*"
    ]
    
    ARTIFACTS_DIR: str = "backend/artifacts"
    DATA_DIR: str = "backend/data"
    MAX_IMAGE_SIZE_MB: float = 10.0
    
    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
