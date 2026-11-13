from fastapi import APIRouter
from app.core.config import settings

router = APIRouter()

@router.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint to verify backend status."""
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "free_tier_ready": {
            "gemini_configured": bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_free_gemini_api_key_here"),
            "edge_tts_voice": settings.DEFAULT_TTS_VOICE,
            "database": "sqlite" if settings.DATABASE_URL.startswith("sqlite") else "mysql"
        }
    }
