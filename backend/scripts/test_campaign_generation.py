import sys
sys.path.insert(0, '.')

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Test 1: Telugu Retention
res1 = client.post("/api/v1/campaigns/generate", json={
    "target_segment": "At Risk Inactive Customers",
    "objective": "Customer Win-Back",
    "category": "Customer Win-Back",
    "language": "Telugu",
    "discount_pct": 20,
    "recipient_name": "Rajeshwari",
    "recipient_phone": "8374360774"
})
print("Test 1 Telugu status:", res1.status_code)
d1 = res1.json().get("data", {})
print("Name:", d1.get("name"))
print("Message preview:")
print(d1.get("message_text"))
print("WhatsApp Share URL:", d1.get("whatsapp_share_url"))
print("-" * 50)

# Test 2: Hindi Festival Special with custom requirement
res2 = client.post("/api/v1/campaigns/generate", json={
    "target_segment": "All Shoppers",
    "objective": "Festival Special",
    "category": "Festival Special",
    "language": "Hindi",
    "discount_pct": 25,
    "custom_instruction": "दिवाली पर फॉर्च्यून तेल और आशीर्वाद आटे पर विशेष छूट",
    "recipient_name": "राजेश जी",
    "recipient_phone": "8374360774"
})
print("Test 2 Hindi status:", res2.status_code)
d2 = res2.json().get("data", {})
print("Name:", d2.get("name"))
print("Message preview:")
print(d2.get("message_text"))
print("-" * 50)

# Test 3: Hinglish Afternoon Flash Deal
res3 = client.post("/api/v1/campaigns/generate", json={
    "target_segment": "Regulars",
    "objective": "Afternoon Flash Deal",
    "category": "Afternoon Flash Deal",
    "language": "Hinglish",
    "discount_pct": 15,
    "recipient_name": "Rajeshwari",
    "recipient_phone": "8374360774"
})
print("Test 3 Hinglish status:", res3.status_code)
d3 = res3.json().get("data", {})
print("Name:", d3.get("name"))
print("Message preview:")
print(d3.get("message_text"))
