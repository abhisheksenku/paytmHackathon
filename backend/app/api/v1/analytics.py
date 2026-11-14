from fastapi import APIRouter, Depends, Query, HTTPException
from typing import Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Merchant, Customer
from app.analytics.sales_engine import (
    compute_overview, compute_revenue_trends, compute_peak_hours
)
from app.analytics.customer_engine import compute_customer_cohorts

router = APIRouter(prefix="/analytics", tags=["Analytics"])

def get_default_merchant(db: Session) -> Merchant:
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="No merchant found. Please seed data first.")
    return merchant

@router.get("/overview")
def get_overview(
    timeframe: str = Query("30d", pattern="^(today|7d|30d|90d)$"),
    db: Session = Depends(get_db)
):
    merchant = get_default_merchant(db)
    overview = compute_overview(db, merchant.id, timeframe)
    return {"success": True, "data": overview}

@router.get("/trends")
def get_trends(
    timeframe: str = Query("30d", pattern="^(today|7d|30d|90d)$"),
    db: Session = Depends(get_db)
):
    merchant = get_default_merchant(db)
    trends = compute_revenue_trends(db, merchant.id, timeframe)
    return {"success": True, "data": trends}

@router.get("/peak-hours")
def get_peak_hours_endpoint(
    timeframe: str = Query("60d", pattern="^(7d|30d|60d)$"),
    db: Session = Depends(get_db)
):
    merchant = get_default_merchant(db)
    peak_data = compute_peak_hours(db, merchant.id, timeframe=timeframe)
    return {"success": True, "data": peak_data}

@router.get("/cohorts")
def get_customer_cohorts_endpoint(db: Session = Depends(get_db)):
    merchant = get_default_merchant(db)
    cohorts = compute_customer_cohorts(db, merchant.id)
    return {"success": True, "data": cohorts}

@router.get("/customers")
def get_customers_endpoint(
    segment: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    merchant = get_default_merchant(db)
    now = datetime.now()
    
    query = db.query(Customer).filter(Customer.merchant_id == merchant.id)
    if search:
        s_term = f"%{search.strip()}%"
        query = query.filter(
            (Customer.name.ilike(s_term)) | 
            (Customer.customer_ref.ilike(s_term)) |
            (Customer.phone.ilike(s_term))
        )
    
    all_custs = query.order_by(Customer.total_spent.desc()).all()
    
    results = []
    for c in all_custs:
        days_ago = (now - c.last_seen).days if c.last_seen else 999
        
        if days_ago > 21 and c.total_orders >= 5:
            seg = "At Risk"
            freq_label = f"⚠️ Inactive {days_ago}d (Used to visit 1-2x/wk)"
        elif c.total_orders >= 18:
            seg = "Champion"
            freq_label = f"~3-4 visits/wk (Seen {days_ago}d ago)"
        elif c.total_orders >= 8:
            seg = "Regular"
            freq_label = f"~1-2 visits/wk (Seen {days_ago}d ago)"
        elif days_ago > 30:
            seg = "At Risk"
            freq_label = f"⚠️ Inactive {days_ago}d"
        else:
            seg = "Occasional Walk-in"
            freq_label = f"Passing / 1-2 visits total"
            
        if segment and segment.lower() != "all" and seg.lower() != segment.lower():
            continue
            
        vpa = c.customer_ref or "user@paytm"
        vpa_parts = vpa.split("@")
        masked_vpa = (vpa_parts[0][:3] + "***@" + vpa_parts[1]) if len(vpa_parts) == 2 else vpa[:4] + "***"
        
        phone = c.phone or "9876543210"
        masked_phone = phone[:2] + "****" + phone[-4:] if len(phone) >= 8 else phone
        
        results.append({
            "id": c.id,
            "name": c.name or "Shopper",
            "masked_vpa": masked_vpa,
            "masked_phone": masked_phone,
            "segment": seg,
            "frequency_label": freq_label,
            "days_ago": days_ago,
            "total_orders": c.total_orders,
            "total_spent": round(c.total_spent, 2),
            "last_seen": c.last_seen.strftime("%d %b %Y") if c.last_seen else "N/A"
        })
        
    total_count = len(results)
    paged = results[offset : offset + limit]
    
    return {
        "success": True,
        "total": total_count,
        "data": paged
    }
