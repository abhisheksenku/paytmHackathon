import urllib.parse
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Campaign, Merchant

router = APIRouter(prefix="/campaigns", tags=["WhatsApp Campaigns"])

class CampaignCreate(BaseModel):
    target_segment: str
    objective: str = "Retention"
    discount_pct: int = 10
    custom_instruction: Optional[str] = None

class CampaignResponse(BaseModel):
    id: str
    name: str
    target_segment: str
    objective: str
    message_text: str
    discount_code: Optional[str]
    discount_pct: int
    status: str
    whatsapp_share_url: str
    created_at: str

def format_whatsapp_url(message: str) -> str:
    encoded_text = urllib.parse.quote(message)
    return f"https://wa.me/?text={encoded_text}"

@router.get("")
def list_campaigns(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    if not merchant:
        return {"success": True, "data": []}

    campaigns = db.query(Campaign).filter(
        Campaign.merchant_id == merchant.id
    ).order_by(Campaign.created_at.desc()).all()

    results = []
    for c in campaigns:
        results.append({
            "id": c.id,
            "name": c.name,
            "target_segment": c.target_segment,
            "objective": c.objective,
            "message_text": c.message_text,
            "discount_code": c.discount_code,
            "discount_pct": c.discount_pct,
            "status": c.status,
            "whatsapp_share_url": format_whatsapp_url(c.message_text),
            "created_at": c.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return {"success": True, "data": results}

@router.post("/generate")
def generate_campaign(req: CampaignCreate, db: Session = Depends(get_db)):
    """
    AI drafts an actionable WhatsApp promotion message tailored to the chosen segment.
    """
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found.")

    code = f"SAVE{req.discount_pct}"
    
    # Build localized WhatsApp copy with high conversion hooks
    if "Risk" in req.target_segment:
        name = "Special Reconnect Offer"
        message = (
            f"Namaste! 🙏\n"
            f"We noticed it's been a while since your last visit to *{merchant.business_name}*.\n\n"
            f"As a valued customer, here is an exclusive *Flat {req.discount_pct}% OFF* on your next purchase!\n"
            f"🎟️ Use Code: *{code}* at the billing counter.\n\n"
            f"📍 Visit us today in {merchant.city} or pay via Paytm UPI to claim your discount. Valid till this Sunday!"
        )
    elif "Weekend" in req.objective or "Spurt" in req.objective:
        name = "Weekend Evening Flash Sale"
        message = (
            f"🌟 *Weekend Special at {merchant.business_name}!* 🌟\n\n"
            f"Stock up on daily essentials, snacks & beverages with *Flat {req.discount_pct}% OFF* on all bills above ₹499.\n"
            f"⚡ Show this WhatsApp message at our counter to avail discount.\n"
            f"⏰ Offer valid Saturday & Sunday 5 PM - 9 PM only!\n\n"
            f"Pay easily with Paytm QR Soundbox. See you soon! 😊"
        )
    else:
        name = f"{req.target_segment} Delight Offer"
        message = (
            f"🎉 Exclusive Greeting from *{merchant.business_name}*!\n\n"
            f"Enjoy *Flat {req.discount_pct}% OFF* on your favorite grocery & household items this week.\n"
            f"🎟️ Promo Code: *{code}*\n\n"
            f"Thank you for being our loyal customer! Pay seamlessly via Paytm QR."
        )

    camp = Campaign(
        merchant_id=merchant.id,
        name=name,
        target_segment=req.target_segment,
        objective=req.objective,
        message_text=message,
        discount_code=code,
        discount_pct=req.discount_pct,
        status="DRAFT"
    )
    db.add(camp)
    db.commit()
    db.refresh(camp)

    return {
        "success": True,
        "data": {
            "id": camp.id,
            "name": camp.name,
            "target_segment": camp.target_segment,
            "objective": camp.objective,
            "message_text": camp.message_text,
            "discount_code": camp.discount_code,
            "discount_pct": camp.discount_pct,
            "status": camp.status,
            "whatsapp_share_url": format_whatsapp_url(camp.message_text),
            "created_at": camp.created_at.strftime("%Y-%m-%d %H:%M")
        }
    }

@router.post("/{campaign_id}/approve")
def approve_campaign(campaign_id: str, db: Session = Depends(get_db)):
    camp = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not camp:
        raise HTTPException(status_code=404, detail="Campaign not found")

    camp.status = "APPROVED"
    db.commit()

    return {
        "success": True,
        "message": "Campaign approved and ready to broadcast via WhatsApp!",
        "whatsapp_url": format_whatsapp_url(camp.message_text)
    }
