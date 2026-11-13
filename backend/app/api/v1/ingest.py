import io
import pandas as pd
from datetime import datetime
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Merchant, Transaction, Customer, DailyAggregate
import subprocess
import sys
import os

router = APIRouter(prefix="/ingest", tags=["Data Ingestion & Demo Seeding"])

@router.post("/upload")
async def upload_statement(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Accepts raw CSV / Excel transaction dumps (e.g. Paytm statement export).
    Intelligently maps columns and stores validated records.
    """
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found.")

    contents = await file.read()
    filename = file.filename.lower()

    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        elif filename.endswith((".xlsx", ".xls")):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Only CSV and Excel (.xlsx) files are supported.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse file: {str(e)}")

    # Normalize column names
    col_map = {}
    for c in df.columns:
        clow = c.lower().strip()
        if "amount" in clow or "amt" in clow or "total" in clow or "value" in clow:
            col_map[c] = "amount"
        elif "date" in clow or "time" in clow or "timestamp" in clow:
            col_map[c] = "transaction_date"
        elif "cust" in clow or "vpa" in clow or "upi" in clow or "payer" in clow:
            col_map[c] = "customer_ref"
        elif "status" in clow:
            col_map[c] = "status"

    df = df.rename(columns=col_map)
    if "amount" not in df.columns:
        raise HTTPException(status_code=400, detail="File must contain an amount or bill value column.")

    imported_count = 0
    total_amount = 0.0

    for _, row in df.iterrows():
        try:
            amt = float(row.get("amount", 0.0))
            if amt <= 0:
                continue
            
            raw_date = row.get("transaction_date", datetime.now())
            if isinstance(raw_date, str):
                try:
                    parsed_date = pd.to_datetime(raw_date).to_pydatetime()
                except Exception:
                    parsed_date = datetime.now()
            elif isinstance(raw_date, datetime):
                parsed_date = raw_date
            else:
                parsed_date = datetime.now()

            ref = str(row.get("customer_ref", f"cust_{int(amt)}@paytm"))
            
            txn = Transaction(
                merchant_id=merchant.id,
                external_txn_id=f"IMP-{imported_count + 1}",
                transaction_date=parsed_date,
                amount=round(amt, 2),
                payment_mode="UPI",
                status="SUCCESS"
            )
            db.add(txn)
            imported_count += 1
            total_amount += amt
        except Exception:
            continue

    db.commit()

    return {
        "success": True,
        "message": f"Successfully ingested {imported_count} transactions!",
        "total_revenue_imported": round(total_amount, 2)
    }

@router.post("/seed-demo")
def reseed_demo_data():
    """Triggers the synthetic 5,000 transaction dataset seeder."""
    python_exe = sys.executable
    script_path = os.path.join(os.path.dirname(__file__), "..", "..", "scripts", "seed_synthetic_data.py")
    res = subprocess.run([python_exe, script_path], capture_output=True, text=True)
    return {
        "success": res.returncode == 0,
        "output": res.stdout,
        "error": res.stderr if res.returncode != 0 else None
    }
