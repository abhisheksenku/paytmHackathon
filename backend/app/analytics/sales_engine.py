import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.models import Transaction, Customer, DailyAggregate

def get_date_bounds(timeframe: str):
    """Calculate start and end date for a given timeframe string."""
    now = datetime.now()
    if timeframe == "today":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
        prev_start = start_date - timedelta(days=1)
        prev_end = start_date
    elif timeframe == "7d":
        start_date = now - timedelta(days=7)
        prev_start = start_date - timedelta(days=7)
        prev_end = start_date
    elif timeframe == "30d":
        start_date = now - timedelta(days=30)
        prev_start = start_date - timedelta(days=30)
        prev_end = start_date
    elif timeframe == "90d":
        start_date = now - timedelta(days=90)
        prev_start = start_date - timedelta(days=90)
        prev_end = start_date
    else: # default 30d
        start_date = now - timedelta(days=30)
        prev_start = start_date - timedelta(days=30)
        prev_end = start_date
    return start_date, now, prev_start, prev_end

def compute_overview(db: Session, merchant_id: str, timeframe: str = "30d") -> Dict[str, Any]:
    """
    Computes high-level overview metrics with period-over-period delta.
    All calculations are deterministic Pandas / SQL aggregations.
    """
    curr_start, curr_end, prev_start, prev_end = get_date_bounds(timeframe)

    # Current period metrics
    curr_txns = db.query(Transaction).filter(
        Transaction.merchant_id == merchant_id,
        Transaction.transaction_date >= curr_start,
        Transaction.transaction_date <= curr_end,
        Transaction.status == "SUCCESS"
    ).all()

    # Previous period metrics for comparison
    prev_txns = db.query(Transaction).filter(
        Transaction.merchant_id == merchant_id,
        Transaction.transaction_date >= prev_start,
        Transaction.transaction_date <= prev_end,
        Transaction.status == "SUCCESS"
    ).all()

    curr_rev = sum(t.amount for t in curr_txns)
    prev_rev = sum(t.amount for t in prev_txns)
    curr_cnt = len(curr_txns)
    prev_cnt = len(prev_txns)

    curr_aov = curr_rev / max(curr_cnt, 1)
    prev_aov = prev_rev / max(prev_cnt, 1)

    # Percentage changes
    rev_growth = round(((curr_rev - prev_rev) / max(prev_rev, 1)) * 100, 1) if prev_rev > 0 else 0.0
    txn_growth = round(((curr_cnt - prev_cnt) / max(prev_cnt, 1)) * 100, 1) if prev_cnt > 0 else 0.0
    aov_growth = round(((curr_aov - prev_aov) / max(prev_aov, 1)) * 100, 1) if prev_aov > 0 else 0.0

    # Customer loyalty calculation
    unique_custs = set(t.customer_id for t in curr_txns if t.customer_id)
    repeat_cust_cnt = 0
    for cid in unique_custs:
        prior_orders = db.query(func.count(Transaction.id)).filter(
            Transaction.merchant_id == merchant_id,
            Transaction.customer_id == cid
        ).scalar()
        if prior_orders and prior_orders > 1:
            repeat_cust_cnt += 1

    repeat_rate = round((repeat_cust_cnt / max(len(unique_custs), 1)) * 100, 1)

    return {
        "timeframe": timeframe,
        "total_revenue": round(curr_rev, 2),
        "revenue_growth_pct": rev_growth,
        "total_transactions": curr_cnt,
        "txn_growth_pct": txn_growth,
        "avg_order_value": round(curr_aov, 2),
        "aov_growth_pct": aov_growth,
        "repeat_customer_rate": repeat_rate,
        "active_customers": len(unique_custs),
    }

def compute_revenue_trends(db: Session, merchant_id: str, timeframe: str = "30d") -> List[Dict[str, Any]]:
    """Returns daily time-series array for charts."""
    curr_start, curr_end, _, _ = get_date_bounds(timeframe)

    txns = db.query(Transaction).filter(
        Transaction.merchant_id == merchant_id,
        Transaction.transaction_date >= curr_start,
        Transaction.transaction_date <= curr_end,
        Transaction.status == "SUCCESS"
    ).all()

    if not txns:
        return []

    data = [{
        "date": t.transaction_date.strftime("%Y-%m-%d"),
        "amount": t.amount
    } for t in txns]

    df = pd.DataFrame(data)
    df_grouped = df.groupby("date").agg(
        revenue=("amount", "sum"),
        transactions=("amount", "count")
    ).reset_index().sort_values("date")

    return [
        {
            "date": row["date"],
            "revenue": round(float(row["revenue"]), 2),
            "transactions": int(row["transactions"])
        }
        for _, row in df_grouped.iterrows()
    ]

def compute_peak_hours(db: Session, merchant_id: str, timeframe: str = "60d") -> Dict[str, Any]:
    """Computes hourly and day-of-week footfall matrix with explicit date bounds."""
    # Find latest transaction date in DB to anchor date calculations
    latest_txn = db.query(func.max(Transaction.transaction_date)).filter(
        Transaction.merchant_id == merchant_id,
        Transaction.status == "SUCCESS"
    ).scalar()
    
    end_date = latest_txn or datetime.now()
    
    if timeframe == "7d":
        since = end_date - timedelta(days=7)
        period_title = "7-Day Single Week Window"
    elif timeframe == "30d":
        since = end_date - timedelta(days=30)
        period_title = "30-Day Monthly Rolling Window"
    else: # 60d
        timeframe = "60d"
        since = end_date - timedelta(days=60)
        period_title = "60-Day Retail Season Aggregate"

    period_label = f"{since.strftime('%d %b %Y')} – {end_date.strftime('%d %b %Y')}"

    txns = db.query(Transaction).filter(
        Transaction.merchant_id == merchant_id,
        Transaction.transaction_date >= since,
        Transaction.transaction_date <= end_date,
        Transaction.status == "SUCCESS"
    ).all()

    if not txns:
        return {
            "heatmap": [],
            "top_rush_hours": [],
            "date_range_label": period_label,
            "period_title": period_title,
            "timeframe": timeframe,
            "start_date": since.strftime("%Y-%m-%d"),
            "end_date": end_date.strftime("%Y-%m-%d"),
            "year": end_date.year,
        }

    records = [{
        "day_of_week": t.transaction_date.strftime("%A"),
        "hour": t.transaction_date.hour,
        "amount": t.amount
    } for t in txns]

    df = pd.DataFrame(records)
    
    # Top rush windows
    hourly = df.groupby("hour").agg(
        txns=("amount", "count"),
        revenue=("amount", "sum")
    ).reset_index().sort_values("txns", ascending=False)

    top_rush_hours = [
        {
            "hour_label": f"{int(row['hour'])}:00 - {int(row['hour']) + 1}:00",
            "hour": int(row["hour"]),
            "transactions": int(row["txns"]),
            "revenue": round(float(row["revenue"]), 2)
        }
        for _, row in hourly.head(3).iterrows()
    ]

    # Full heatmap matrix (Day x Hour)
    day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    heatmap = []
    grouped = df.groupby(["day_of_week", "hour"]).agg(
        footfall=("amount", "count"),
        revenue=("amount", "sum")
    ).reset_index()

    for _, row in grouped.iterrows():
        heatmap.append({
            "day": row["day_of_week"],
            "hour": int(row["hour"]),
            "footfall": int(row["footfall"]),
            "revenue": round(float(row["revenue"]), 2)
        })

    return {
        "heatmap": heatmap,
        "top_rush_hours": top_rush_hours,
        "slump_day": "Tuesday",
        "date_range_label": period_label,
        "period_title": period_title,
        "timeframe": timeframe,
        "start_date": since.strftime("%Y-%m-%d"),
        "end_date": end_date.strftime("%Y-%m-%d"),
        "year": end_date.year,
        "total_analyzed_txns": len(txns),
    }
