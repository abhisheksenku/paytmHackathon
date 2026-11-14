import os
import sys
from sarvamai import SarvamAI

# Load key from .env file if not already set in environment
env_file = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(env_file):
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))

api_key = os.environ.get("SARVAM_API_KEY", "").strip()

if not api_key:
    print("Error: SARVAM_API_KEY is not set in .env")
    sys.exit(1)

client = SarvamAI(api_subscription_key=api_key)

response = client.chat.completions(
    messages=[
        {"role": "user", "content": "Hello! Introduce yourself in one short sentence."}
    ],
    model="sarvam-105b-conversations",
)

print(response.choices[0].message.content)
