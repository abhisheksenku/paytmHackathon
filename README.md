# Vyapaar AI 2.0 (Paytm Edition)
### AI-Powered Merchant Growth Copilot & Dukaan Intelligence Engine

> **Paytm Build for India AI Hackathon – Hyderabad Edition**  
> **Track:** Merchant Growth AI  
> **Tagline:** *Dukaan Aapki, Dimag AI Ka.* (From Daily Soundbox Pings to Business Growth)  
> **Languages Supported:** Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), English, Hinglish  
> **Tech Stack:** 100% Free-Tier & Open Source (Google Gemini 1.5 Flash, Microsoft Edge-TTS Neural Voices, Next.js 14, FastAPI, SQLite)

---

## 🌟 Executive Overview

**Vyapaar AI** is a purpose-built, India-first business copilot for small & medium retailers (Kiranas, food stalls, pharmacies, clothing stores). 

Rather than overwhelming a busy shopkeeper with corporate dashboards or hallucinating generic AI chatbots, Vyapaar AI:
1. **Listens to Daily Dukaan Briefings (AI Soundbox):** Synthesizes a 30-second morning audio wrap-up in natural Hinglish before the shop shutters open.
2. **Answers Voice & Hinglish Queries:** Ask *"Pichle hafte se aaj ka dhandha kaisa hai?"* or *"Mera peak bheed wala time kab hai?"* with zero financial hallucinations.
3. **Calculates Paytm Loan Readiness:** Evaluates daily cash flow consistency and pre-approves working capital limits (e.g., ₹2.5 Lakhs).
4. **Generates WhatsApp Micro-Campaigns:** Detects retail slumps (e.g. Tuesday afternoon dip) and drafts localized WhatsApp broadcasts with QR discount codes ready to send in 1 click.

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 14 FRONTEND                             │
│   • Recharts Area & Bar Charts       • Web Speech API (Voice STT)      │
│   • Digital Soundbox Audio Player     • Smartphone WhatsApp Simulator   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST (/api/v1)
┌───────────────────────────────────▼────────────────────────────────────┐
│                        FASTAPI BACKEND                                 │
│   • Pure Deterministic Analytics     • Edge-TTS Neural Voice Engine    │
│   • Sales, Cohorts & Loan Engines     • Ingestion & Column Normalizer   │
└──────────────┬──────────────────────────────────────────┬──────────────┘
               │                                          │
┌──────────────▼────────────────┐        ┌────────────────▼──────────────┐
│  SQLITE / MYSQL DATABASE      │        │  GOOGLE GEMINI 1.5 FLASH      │
│  5,499 Realistic Txns         │        │  Intent Routing & Synthesis   │
│  600 Customers, 35 SKUs       │        │  (100% Free-Tier Key)         │
└───────────────────────────────┘        └───────────────────────────────┘
```

---

## 🚀 Quick Start Guide (Run Locally in 2 Minutes)

### Prerequisites
- Python 3.11+ (Python 3.13 supported)
- Node.js 18+ (Node 20 / 24 supported)

---

### Step 1: Start the FastAPI Backend

```powershell
# Open terminal 1
cd backend

# Create virtual environment (if not already created)
python -m venv venv
.\venv\Scripts\activate

# Install requirements
pip install -r requirements.txt

# Run the 5,000-transaction synthetic seeder
python scripts\seed_synthetic_data.py

# Start the FastAPI server on port 8000
uvicorn app.main:app --reload --port 8000
```
Backend will be live at: **`http://localhost:8000`**  
Interactive Swagger Docs: **`http://localhost:8000/docs`**

---

### Step 2: Start the Next.js Frontend

```powershell
# Open terminal 2
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the Next.js development server
npm run dev
```
Frontend will be live at: **`http://localhost:3000`**

---

## 🔑 Demo Login & Sandbox

| Role | Email | Password | Store Profile |
| :--- | :--- | :--- | :--- |
| **Demo Merchant** | `demo@vyapaarai.in` | `demo123` | Sharma General Store (Hyderabad) |

*Pre-seeded dataset includes:*
- **5,499 Transactions** spanning 180 continuous days.
- **600 Customers** across Champions, Regulars, and At-Risk segments.
- **35 FMCG Kirana Products** with realistic margins and reorder alerts.
- **Realistic retail anomalies:** Tuesday footfall slump (-30%), weekend surge (+40%), and 6:00 PM - 9:00 PM evening peak.

---

## ⏱️ Judges' 3-Minute Winning Demo Script

1. **The Hook (0:00 - 0:30):**
   * Open `http://localhost:3000`. Show **Sharma General Store** dashboard: ₹4.8 Lakh monthly revenue, 1,420 bills, and a **Paytm Loan Readiness Score of 810/900 (Pre-Approved for ₹2.5 Lakhs)**.
2. **The AI Soundbox (0:30 - 1:00):**
   * Click **"AI Soundbox Briefing"** in the sidebar. Click **"Play Briefing"**.
   * Listen to the natural Hinglish voice summary:  
     *"Namaste Sharma ji! Kal aapka collection ₹18,450 raha. Shaam 7 baje sabse zyada bheed dekhi gayi..."*
3. **The Voice/Hinglish Query (1:00 - 1:45):**
   * Switch to **"AI Business Copilot"**. Click the microphone or select:  
     *"Pichle hafte se compare karke batao business kaisa hai?"*
   * Point out the **`⚡ Tool Executed: compare_sales_periods()`** badge showing zero financial hallucinations.
4. **The Retail Anomaly & Action (1:45 - 2:30):**
   * Open **"Sales & Rush Hours"** to show the Day vs. Hour Heatmap highlighting the Tuesday afternoon slump.
   * Switch to **"WhatsApp Campaigns"**. Click **"Generate AI WhatsApp Message"**.
   * Inspect the formatted message preview inside the **Smartphone Simulator**.
   * Click **"Approve Campaign"** and click **"Send via WhatsApp"** to launch direct sharing (`wa.me/?text=...`).
5. **The Conclusion (2:30 - 3:00):**
   * Conclude: *"Vyapaar AI transforms passive Soundbox alerts into proactive daily dhandha intelligence, customer retention, and loan readiness on a 100% free-tier stack."*

---

## 🛡️ Key Technical Guardrails

- **Zero Hallucination Guarantee:** Financial totals, growth percentages, and customer counts are computed in deterministic Python Pandas; LLMs only format and synthesize the final message.
- **100% Free-Tier:** Built without OpenAI or paid subscriptions. Works with Google Gemini 1.5 Flash free tier, Edge-TTS, and browser-native Web Speech API.
- **Privacy & Compliance:** All customer phone numbers and VPAs are masked (e.g. `rahul***@paytm`), respecting DPDP Act guidelines.
