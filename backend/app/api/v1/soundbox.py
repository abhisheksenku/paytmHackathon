from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Merchant
from app.ai.voice_summary import generate_soundbox_briefing

router = APIRouter(prefix="/soundbox", tags=["Soundbox Audio Briefing"])

@router.get("/briefing")
def get_daily_briefing(db: Session = Depends(get_db)):
    """
    Returns today's audio briefing (Edge-TTS base64 MP3) + natural Hinglish transcript.
    Zero external paid API cost.
    """
    merchant = db.query(Merchant).first()
    if not merchant:
        return {"success": False, "error": "No merchant found. Seed data first."}

    briefing = generate_soundbox_briefing(db, merchant.id)
    return {"success": True, "data": briefing}
