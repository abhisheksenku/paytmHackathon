import os
import sys
import random
import uuid
import hashlib
from datetime import datetime, timedelta

# Add backend to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from sqlalchemy.orm import Session

from app.core.database import SessionLocal, engine, Base
from app.models.models import (
    Merchant, User, Product, Customer,
    Transaction, TransactionItem, Campaign, DailyAggregate
)

def hash_password(password: str) -> str:
    """Safe, zero-dependency password hash for demo and production."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

# 35 Realistic Indian Kirana & FMCG Products
PRODUCT_CATALOG = [
    # Grains & Staples
    {"name": "Aashirvaad Shudh Chakki Atta 5kg", "category": "Grains & Staples", "price": 245.0, "cost": 215.0, "stock": 45},
    {"name": "India Gate Basmati Rice 1kg", "category": "Grains & Staples", "price": 135.0, "cost": 115.0, "stock": 60},
    {"name": "Tata Salt 1kg", "category": "Grains & Staples", "price": 28.0, "cost": 22.0, "stock": 120},
    {"name": "Fortune Sunlite Sunflower Oil 1L", "category": "Grains & Staples", "price": 145.0, "cost": 128.0, "stock": 50},
    {"name": "Toor Dal Premium 1kg", "category": "Grains & Staples", "price": 165.0, "cost": 142.0, "stock": 40},
    {"name": "Madhur Pure & Hygienic Sugar 1kg", "category": "Grains & Staples", "price": 52.0, "cost": 44.0, "stock": 80},
    {"name": "Catch Turmeric Powder 200g", "category": "Grains & Staples", "price": 48.0, "cost": 38.0, "stock": 70},
    {"name": "Everest Red Chilli Powder 100g", "category": "Grains & Staples", "price": 42.0, "cost": 33.0, "stock": 65},

    # Dairy & Breakfast
    {"name": "Amul Taaza Homogenised Toned Milk 500ml", "category": "Dairy & Breakfast", "price": 28.0, "cost": 25.0, "stock": 85},
    {"name": "Amul Butter Pasteurised 100g", "category": "Dairy & Breakfast", "price": 58.0, "cost": 52.0, "stock": 40},
    {"name": "Modern White Bread 400g", "category": "Dairy & Breakfast", "price": 40.0, "cost": 32.0, "stock": 30},
    {"name": "Heritage Special Curd 500g", "category": "Dairy & Breakfast", "price": 40.0, "cost": 34.0, "stock": 45},
    {"name": "Amul Paneer 200g", "category": "Dairy & Breakfast", "price": 92.0, "cost": 80.0, "stock": 25},
    {"name": "Farm Fresh Eggs 6pcs", "category": "Dairy & Breakfast", "price": 48.0, "cost": 38.0, "stock": 50},

    # Snacks & Biscuits
    {"name": "Parle-G Gold Biscuits 1kg", "category": "Snacks & Biscuits", "price": 90.0, "cost": 76.0, "stock": 90},
    {"name": "Britannia Good Day Butter 200g", "category": "Snacks & Biscuits", "price": 45.0, "cost": 37.0, "stock": 75},
    {"name": "Haldiram's Bhujia Sev 400g", "category": "Snacks & Biscuits", "price": 125.0, "cost": 102.0, "stock": 55},
    {"name": "Kurkure Masala Munch 85g", "category": "Snacks & Biscuits", "price": 20.0, "cost": 16.0, "stock": 110},
    {"name": "Lay's India's Magic Masala 50g", "category": "Snacks & Biscuits", "price": 20.0, "cost": 16.0, "stock": 120},
    {"name": "Maggi 2-Minute Noodles 4-pack", "category": "Snacks & Biscuits", "price": 56.0, "cost": 47.0, "stock": 95},

    # Beverages
    {"name": "Tata Tea Gold 250g", "category": "Beverages", "price": 160.0, "cost": 135.0, "stock": 40},
    {"name": "Bru Instant Coffee 100g", "category": "Beverages", "price": 195.0, "cost": 165.0, "stock": 35},
    {"name": "Thums Up 750ml PET", "category": "Beverages", "price": 40.0, "cost": 33.0, "stock": 60},
    {"name": "Frooti Mango Drink 1.2L", "category": "Beverages", "price": 65.0, "cost": 52.0, "stock": 40},
    {"name": "Red Bull Energy Drink 250ml", "category": "Beverages", "price": 125.0, "cost": 105.0, "stock": 20},

    # Personal & Home Care
    {"name": "Dettol Original Bathing Soap 75g (Buy 3 Get 1)", "category": "Personal & Home Care", "price": 140.0, "cost": 118.0, "stock": 50},
    {"name": "Colgate Strong Teeth Toothpaste 200g", "category": "Personal & Home Care", "price": 115.0, "cost": 95.0, "stock": 60},
    {"name": "Surf Excel Quick Wash Detergent Powder 1kg", "category": "Personal & Home Care", "price": 155.0, "cost": 132.0, "stock": 40},
    {"name": "Vim Dishwash Liquid Gel 500ml", "category": "Personal & Home Care", "price": 105.0, "cost": 86.0, "stock": 45},
    {"name": "Harpic Power Plus Toilet Cleaner 500ml", "category": "Personal & Home Care", "price": 99.0, "cost": 82.0, "stock": 35},
    {"name": "Clinic Plus Strong & Long Shampoo 340ml", "category": "Personal & Home Care", "price": 185.0, "cost": 155.0, "stock": 30},
    {"name": "Good Knight Gold Flash Mosquito Liquid Refill", "category": "Personal & Home Care", "price": 85.0, "cost": 70.0, "stock": 50},
    {"name": "Patanjali Dant Kanti 100g", "category": "Personal & Home Care", "price": 55.0, "cost": 45.0, "stock": 40},
    {"name": "Lizol Disinfectant Floor Cleaner Citrus 500ml", "category": "Personal & Home Care", "price": 112.0, "cost": 92.0, "stock": 35},
    {"name": "Whisper Choice Sanitary Pads 6pcs", "category": "Personal & Home Care", "price": 38.0, "cost": 30.0, "stock": 60},
]

INDIAN_FIRST_NAMES = [
    "Rahul", "Priya", "Anand", "Suresh", "Lakshmi", "Karthik", "Sneha", "Vikram",
    "Pooja", "Arjun", "Deepa", "Manish", "Kavita", "Ramesh", "Sunita", "Rajesh",
    "Meena", "Venkat", "Swati", "Naveen", "Divya", "Ganesh", "Asha", "Sanjay",
    "Bhavani", "Harish", "Geeta", "Prasad", "Anitha", "Ravi", "Sandhya", "Srikanth",
    "Padma", "Mohan", "Shylaja", "Satish", "Rekha", "Manoj", "Sudha", "Mahesh"
]

INDIAN_LAST_NAMES = [
    "Sharma", "Reddy", "Verma", "Rao", "Gupta", "Nair", "Patel", "Kumar",
    "Singh", "Choudhary", "Iyer", "Mishra", "Joshi", "Bose", "Menon", "Agarwal"
]

def seed_data():
    print("=" * 60)
    print("VYAPAAR AI - SEEDING REALISTIC SYNTHETIC MERCHANT DATA")
    print("=" * 60)

    # 1. Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        existing_merchant = db.query(Merchant).filter(Merchant.phone == "9876543210").first()
        if existing_merchant:
            print("[INFO] Existing demo merchant found. Clearing existing dataset to refresh...")
            db.delete(existing_merchant)
            db.commit()

        # 2. Create Demo Merchant
        merchant = Merchant(
            business_name="Sharma General Store",
            owner_name="Ramesh Sharma",
            phone="9876543210",
            email="ramesh.sharma@paytmbusiness.com",
            category="Kirana & Daily Essentials",
            upi_vpa="sharmakirana@paytm",
            city="Hyderabad"
        )
        db.add(merchant)
        db.flush()

        # 3. Create Demo User
        demo_user = User(
            merchant_id=merchant.id,
            email="demo@vyapaarai.in",
            hashed_password=hash_password("demo123"),
            full_name="Ramesh Sharma",
            role="owner"
        )
        db.add(demo_user)

        # 4. Create Product Records
        created_products = []
        for p in PRODUCT_CATALOG:
            prod = Product(
                merchant_id=merchant.id,
                sku=f"SKU-{random.randint(1000, 9999)}",
                name=p["name"],
                category=p["category"],
                unit_price=p["price"],
                cost_price=p["cost"],
                stock_qty=p["stock"]
            )
            db.add(prod)
            created_products.append(prod)
        db.flush()
        print(f"[SUCCESS] Created {len(created_products)} catalog products.")

        # 5. Create 600 Unique Customers
        customers = []
        for i in range(600):
            first = random.choice(INDIAN_FIRST_NAMES)
            last = random.choice(INDIAN_LAST_NAMES)
            vpa_handle = random.choice(["paytm", "okhdfcbank", "okaxis", "ybl", "ibl"])
            ref = f"{first.lower()}{random.randint(10, 999)}@{vpa_handle}"
            phone = f"98{random.randint(10000000, 99999999)}"
            
            cust = Customer(
                merchant_id=merchant.id,
                customer_ref=ref,
                name=f"{first} {last}",
                phone=phone,
                total_spent=0.0,
                total_orders=0
            )
            db.add(cust)
            customers.append(cust)
        db.flush()
        print(f"[SUCCESS] Created {len(customers)} unique customer profiles.")

        # 6. Generate 5,000 Transactions over the last 180 Days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=180)
        
        # Customer tiers: Champions (top 50), Regulars (next 150), Occasionals (next 250), Walk-ins (remaining 150)
        champions = customers[:50]
        regulars = customers[50:200]
        occasionals = customers[200:450]
        walkins = customers[450:]

        total_txns = 0

        current_day = start_date
        while current_day <= end_date:
            date_str = current_day.strftime("%Y-%m-%d")
            weekday = current_day.weekday() # 0 = Mon, 1 = Tue, ..., 5 = Sat, 6 = Sun
            
            # Base daily volume: 24 to 32 txns
            if weekday == 1:
                # Tuesday slump in retail (-30%)
                num_txns = random.randint(16, 22)
            elif weekday in [5, 6]:
                # Weekend boost (+40%)
                num_txns = random.randint(34, 45)
            else:
                num_txns = random.randint(25, 32)

            day_revenue = 0.0
            day_customers = set()

            for _ in range(num_txns):
                # Pick transaction time according to realistic retail distribution
                hour_roll = random.random()
                if hour_roll < 0.25:
                    # Morning rush (7:30 AM to 10:30 AM)
                    txn_hour = random.randint(7, 10)
                elif hour_roll < 0.40:
                    # Afternoon lull (11:00 AM to 4:30 PM)
                    txn_hour = random.randint(11, 16)
                else:
                    # Evening peak (5:00 PM to 9:45 PM) - 60% of volume!
                    txn_hour = random.randint(17, 21)
                
                txn_minute = random.randint(0, 59)
                txn_second = random.randint(0, 59)
                txn_time = current_day.replace(hour=txn_hour, minute=txn_minute, second=txn_second)

                # Select customer based on realistic repeat distribution
                cust_roll = random.random()
                if cust_roll < 0.40:
                    cust = random.choice(champions)
                elif cust_roll < 0.70:
                    cust = random.choice(regulars)
                elif cust_roll < 0.90:
                    cust = random.choice(occasionals)
                else:
                    cust = random.choice(walkins)

                day_customers.add(cust.id)

                # Select 1 to 4 basket items
                basket_size = random.choices([1, 2, 3, 4], weights=[0.45, 0.35, 0.15, 0.05])[0]
                selected_products = random.sample(created_products, basket_size)
                
                txn_amount = 0.0
                txn_items = []
                for sp in selected_products:
                    qty = random.choices([1, 2, 3], weights=[0.8, 0.15, 0.05])[0]
                    item_total = sp.unit_price * qty
                    txn_amount += item_total
                    txn_items.append({
                        "product_id": sp.id,
                        "product_name": sp.name,
                        "quantity": qty,
                        "unit_price": sp.unit_price,
                        "total_price": item_total
                    })

                # Payment modes: 72% UPI (Paytm QR), 15% Cash, 8% Card, 5% Paytm Wallet
                mode = random.choices(
                    ["UPI", "CASH", "CARD", "WALLET"],
                    weights=[0.72, 0.15, 0.08, 0.05]
                )[0]

                txn = Transaction(
                    merchant_id=merchant.id,
                    customer_id=cust.id,
                    external_txn_id=f"TXN-PTM-{random.randint(100000000, 999999999)}",
                    transaction_date=txn_time,
                    amount=round(txn_amount, 2),
                    payment_mode=mode,
                    status="SUCCESS"
                )
                db.add(txn)
                db.flush()

                for ti in txn_items:
                    item_record = TransactionItem(
                        transaction_id=txn.id,
                        product_id=ti["product_id"],
                        product_name=ti["product_name"],
                        quantity=ti["quantity"],
                        unit_price=ti["unit_price"],
                        total_price=ti["total_price"]
                    )
                    db.add(item_record)

                # Update customer stats
                cust.total_spent += round(txn_amount, 2)
                cust.total_orders += 1
                cust.last_seen = max(cust.last_seen, txn_time)

                day_revenue += txn_amount
                total_txns += 1

            # Save daily aggregate
            agg = DailyAggregate(
                merchant_id=merchant.id,
                date=date_str,
                total_revenue=round(day_revenue, 2),
                total_transactions=num_txns,
                unique_customers=len(day_customers),
                avg_order_value=round(day_revenue / max(num_txns, 1), 2)
            )
            db.add(agg)
            current_day += timedelta(days=1)

        # 7. Assign Customer Segments based on RFM
        for c in customers:
            if c.total_orders >= 18:
                c.segment = "Champion"
            elif c.total_orders >= 8:
                c.segment = "Regular"
            elif (end_date - c.last_seen).days > 25:
                c.segment = "At Risk"
            else:
                c.segment = "Occasional"

        # 8. Add Seed Campaigns
        camp1 = Campaign(
            merchant_id=merchant.id,
            name="Weekend Shaam Flash Offer",
            target_segment="Regulars & Champions",
            objective="Weekend Spurt",
            message_text="Namaste! Weekend special at Sharma General Store. Flat 10% off on all snacks & beverages on purchases above Rs 499. Show this message at billing counter! Valid till Sunday 9 PM.",
            discount_code="WEEKEND10",
            discount_pct=10,
            status="APPROVED"
        )
        camp2 = Campaign(
            merchant_id=merchant.id,
            name="Tuesday Slump Booster",
            target_segment="At Risk Customers",
            objective="Retention",
            message_text="Aapka kaafi dino se aana nahi hua! Special greeting from Sharma Kirana: Flat Rs 50 OFF on fresh dairy & staples this Tuesday. Use code TUESDAY50.",
            discount_code="TUESDAY50",
            discount_pct=15,
            status="DRAFT"
        )
        db.add(camp1)
        db.add(camp2)

        db.commit()
        print(f"[SUCCESS] Successfully seeded {total_txns} transactions across 180 days!")
        print(f"[LOGIN DEMO] Email: demo@vyapaarai.in | Password: demo123")
        print("=" * 60)

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Failed to seed data: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
