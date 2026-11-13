import os
import base64
import tempfile
import edge_tts
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Merchant, Conversation, Message
from app.ai.agent import run_agentic_query

router = APIRouter(prefix="/ai", tags=["AI Copilot"])

NEURAL_VOICE_MAP = {
    "Hindi": "hi-IN-MadhurNeural",
    "Telugu": "te-IN-MohanNeural",
    "Tamil": "ta-IN-ValluvarNeural",
    "Kannada": "kn-IN-GaganNeural",
    "English": "en-IN-NeerjaNeural",
    "Hinglish": "hi-IN-MadhurNeural",
}

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    language: Optional[str] = "Hinglish"

class TTSRequest(BaseModel):
    text: str
    language: Optional[str] = "Hinglish"

@router.post("/chat")
def chat_with_copilot(req: ChatRequest, db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant data not found. Please seed data first.")

    res = run_agentic_query(db, merchant.id, req.message, language=req.language or "Hinglish")
    return {"success": True, "data": res}

@router.post("/tts")
async def generate_neural_tts(req: TTSRequest):
    """
    Generates realistic, studio-quality Indian neural voice audio via Edge-TTS.
    Returns base64 data URI MP3 for zero-latency browser playback.
    """
    voice = NEURAL_VOICE_MAP.get(req.language or "Hinglish", "hi-IN-MadhurNeural")
    clean_text = (
        req.text.replace("**", "")
        .replace("*", "")
        .replace("`", "")
        .replace("#", "")
        .replace("•", "")
        .strip()[:600]
    )

    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tf:
        temp_path = tf.name

    try:
        comm = edge_tts.Communicate(clean_text, voice)
        await comm.save(temp_path)
        with open(temp_path, "rb") as f:
            audio_bytes = f.read()
        b64_str = base64.b64encode(audio_bytes).decode("utf-8")
        return {"success": True, "audio_base64": f"data:audio/mp3;base64,{b64_str}"}
    except Exception as e:
        return {"success": False, "error": str(e)}
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
