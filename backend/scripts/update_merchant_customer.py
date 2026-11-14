import os, sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.models import Merchant, Customer
from datetime import datetime, timedelta

def main():
    db = SessionLocal()
    m = db.query(Merchant).first()
    if m:
        m.owner_name = "Abhishek"
        m.phone = "8919581022"
        db.commit()
        print(f"Merchant updated: {m.business_name} | Owner: {m.owner_name} | Phone: {m.phone}")

    # Check or create customer Rajeshwari
    cust = db.query(Customer).filter((Customer.phone == "8374360774") | (Customer.name == "Rajeshwari")).first()
    if not cust:
        cust = Customer(
            merchant_id=m.id,
            name="Rajeshwari",
            phone="8374360774",
            customer_ref="rajeshwari@paytm",
            segment="At Risk",
            total_orders=14,
            total_spent=4850.0,
            last_seen=datetime.utcnow() - timedelta(days=22)
        )
        db.add(cust)
    else:
        cust.name = "Rajeshwari"
        cust.phone = "8374360774"
        cust.customer_ref = "rajeshwari@paytm"
        cust.segment = "At Risk"
        cust.total_orders = 14
        cust.total_spent = 4850.0
        cust.last_seen = datetime.utcnow() - timedelta(days=22)

    db.commit()
    print(f"Customer ready: {cust.name} | Phone: {cust.phone} | Segment: {cust.segment} | Last seen: {cust.last_seen}")
    db.close()

if __name__ == "__main__":
    main()
