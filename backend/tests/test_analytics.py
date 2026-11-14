import pytest
from datetime import datetime, timedelta
from app.core.database import SessionLocal, Base, engine
from app.models.models import Merchant, Transaction, DailyAggregate
from app.analytics.sales_engine import compute_overview, compute_peak_hours
from app.analytics.customer_engine import compute_customer_cohorts

@pytest.fixture(scope="module")
def db():
    Base.metadata.create_all(bind=engine)
    session = SessionLocal()
    yield session
    session.close()

def test_merchant_exists(db):
    merchant = db.query(Merchant).first()
    assert merchant is not None, "Demo merchant must exist in database"
    assert merchant.phone == "9876543210"

def test_deterministic_sales_overview(db):
    merchant = db.query(Merchant).first()
    overview = compute_overview(db, merchant.id, timeframe="30d")
    
    assert "total_revenue" in overview
    assert overview["total_revenue"] > 0, "30-day revenue must be positive"
    assert "total_transactions" in overview
    assert overview["total_transactions"] > 0
    assert "avg_order_value" in overview
    assert overview["avg_order_value"] > 0
    assert "repeat_customer_rate" in overview
    assert 0 <= overview["repeat_customer_rate"] <= 100

def test_peak_hours_calculation(db):
    merchant = db.query(Merchant).first()
    peak_data = compute_peak_hours(db, merchant.id)
    
    assert "top_rush_hours" in peak_data
    assert len(peak_data["top_rush_hours"]) > 0
    assert "heatmap" in peak_data
    assert len(peak_data["heatmap"]) > 0

def test_customer_cohorts_segmentation(db):
    merchant = db.query(Merchant).first()
    cohorts = compute_customer_cohorts(db, merchant.id)
    
    assert len(cohorts) == 4
    segments = [c["segment"] for c in cohorts]
    assert "Champions" in segments
    assert "Regulars" in segments
    assert "At Risk" in segments
    assert "Occasional Walk-ins" in segments
