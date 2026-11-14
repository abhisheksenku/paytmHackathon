import os
from typing import List, Any
from pydantic_settings import BaseSettings

# Absolute path for SQLite to prevent working directory mismatches
BASE_BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DEFAULT_DB_FILE = os.path.join(BASE_BACKEND_DIR, "vyapaar_ai.db").replace("\\", "/")

class Settings(BaseSettings):
    PROJECT_NAME: str = "Vyapaar AI"
    VERSION: str = "2.0.0"
    DESCRIPTION: str = "AI-Powered Merchant Growth Copilot & Dukaan Intelligence Engine"
    API_V1_STR: str = "/api/v1"
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: Any = True
    PORT: int = 8000
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    
    # Database - Absolute path to vyapaar_ai.db inside backend/
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DEFAULT_DB_FILE}")
    
    # Free-Tier AI (Google Gemini)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-flash-lite-latest")
    
    # Audio Synthesis (Edge-TTS Indian Voices)
    DEFAULT_TTS_VOICE: str = os.getenv("DEFAULT_TTS_VOICE", "hi-IN-MadhurNeural")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "vyapaar_ai_super_secret_hackathon_key_2026_change_in_prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
