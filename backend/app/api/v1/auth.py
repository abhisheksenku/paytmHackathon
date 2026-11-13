from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Merchant, User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/demo-login")
def demo_login(db: Session = Depends(get_db)):
    """
    Zero-friction login endpoint for Hackathon judges.
    Instantly returns authenticated demo merchant profile.
    """
    merchant = db.query(Merchant).filter(Merchant.phone == "9876543210").first()
    if not merchant:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Demo merchant data not found. Please run the seed script."
        )

    user = db.query(User).filter(User.merchant_id == merchant.id).first()

    return {
        "success": True,
        "token": "demo_jwt_token_for_hackathon_evaluation",
        "merchant": {
            "id": merchant.id,
            "business_name": merchant.business_name,
            "owner_name": merchant.owner_name,
            "phone": merchant.phone,
            "email": merchant.email,
            "category": merchant.category,
            "upi_vpa": merchant.upi_vpa,
            "city": merchant.city,
        },
        "user": {
            "id": user.id if user else "user-1",
            "email": user.email if user else "demo@vyapaarai.in",
            "full_name": user.full_name if user else "Ramesh Sharma",
            "role": "owner"
        }
    }
