import sys
sys.path.insert(0, '.')

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
res = client.get("/api/v1/analytics/customers?limit=2")
print("Status:", res.status_code)
data = res.json()
print("Total:", data.get("total"))
for cust in data.get("data", []):
    print(f"Customer: {cust.get('name')} | Phone: {cust.get('phone')} | Segment: {cust.get('segment')}")

camp_res = client.get("/api/v1/campaigns")
print("Campaigns Status:", camp_res.status_code)
c_data = camp_res.json()
for c in c_data.get("data", [])[:2]:
    print(f"Campaign: {c.get('name')} | URL: {c.get('whatsapp_share_url')}")
