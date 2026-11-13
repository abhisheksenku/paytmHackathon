from datetime import datetime, timedelta
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.models import Customer, Transaction

def compute_customer_cohorts(db: Session, merchant_id: str) -> List[Dict[str, Any]]:
    """
    Computes RFM (Recency, Frequency, Monetary) Customer Cohorts:
    - Champions (High frequency + high spend)
    - Regulars (Consistent repeat visitors)
    - At Risk (Haven't visited in >25 days)
    - Occasionals (New or infrequent buyers)
    """
    customers = db.query(Customer).filter(Customer.merchant_id == merchant_id).all()
    if not customers:
        return []

    now = datetime.now()
    total_custs = len(customers)

    champions = []
    regulars = []
    at_risk = []
    occasionals = []

    for c in customers:
        days_since_seen = (now - c.last_seen).days if c.last_seen else 999
        # At Risk: Frequent or regular shoppers who have not visited in >21 days (Churn Alert)
        if days_since_seen > 21 and c.total_orders >= 5:
            at_risk.append(c)
        elif c.total_orders >= 18:
            champions.append(c)
        elif c.total_orders >= 8:
            regulars.append(c)
        elif days_since_seen > 30:
            at_risk.append(c)
        else:
            occasionals.append(c)

    cohorts = [
        {
            "segment": "Champions",
            "count": len(champions),
            "pct": round((len(champions) / max(total_custs, 1)) * 100, 1),
            "avg_spend": round(sum(c.total_spent for c in champions) / max(len(champions), 1), 2),
            "recommended_action": "Reward with VIP loyalty perks & early access to seasonal products.",
            "color": "#16A34A"
        },
        {
            "segment": "Regulars",
            "count": len(regulars),
            "pct": round((len(regulars) / max(total_custs, 1)) * 100, 1),
            "avg_spend": round(sum(c.total_spent for c in regulars) / max(len(regulars), 1), 2),
            "recommended_action": "Upsell bundle packages (e.g. Milk + Bread combos).",
            "color": "#00BAF2"
        },
        {
            "segment": "At Risk",
            "count": len(at_risk),
            "pct": round((len(at_risk) / max(total_custs, 1)) * 100, 1),
            "avg_spend": round(sum(c.total_spent for c in at_risk) / max(len(at_risk), 1), 2),
            "recommended_action": "Send re-engagement WhatsApp discount coupon (Flat ₹50 OFF).",
            "color": "#DC2626"
        },
        {
            "segment": "Occasional Walk-ins",
            "count": len(occasionals),
            "pct": round((len(occasionals) / max(total_custs, 1)) * 100, 1),
            "avg_spend": round(sum(c.total_spent for c in occasionals) / max(len(occasionals), 1), 2),
            "recommended_action": "Incentivize 2nd visit with Soundbox UPI cashback offer.",
            "color": "#94A3B8"
        }
    ]

    return cohorts
