# Vyapaar AI 2.0 (Paytm Edition)
### AI-Powered Merchant Growth Copilot & Dukaan Intelligence Engine

> **Paytm Build for India AI Hackathon – Hyderabad Edition**  
> **Track:** Merchant Growth AI  
> **Tagline:** *Dukaan Aapki, Dimag AI Ka.* (From Daily Soundbox Pings to Business Growth)  
> **Languages Supported:** Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), English, Hinglish  
> **Tech Stack:** 100% Free-Tier & Open Source (Google Gemini 1.5 Flash, Microsoft Edge-TTS Neural Voices, Next.js 14, FastAPI, SQLite)

---

## 🌟 Executive Overview

**Vyapaar AI** is a purpose-built, India-first voice and retention copilot for small & medium retailers (Kiranas, kiosk owners, tea stalls, pharmacies). 

Rather than overwhelming a busy shopkeeper with complex English dashboards or generic hallucinated chatbots, Vyapaar AI delivers 3 core pillars:
1. **Customer Retention via Soundbox RFM:** Tracks UPI transaction VPAs to identify regular customers whose visit frequency has dropped. Flags **42 At-Risk regular customers** (e.g. Rajesh-ji, inactive for 22 days) and generates personalized 1-click WhatsApp coupon recovery campaigns.
2. **AI Business Copilot in 6 Indian Languages:** Full voice conversation in Hindi, Telugu, Tamil, Kannada, English, and Hinglish. Merchants ask queries aloud (*"How much collection today?"*, *"Compare sales with last month"*), powered by deterministic analytics and Sarvam AI / Indian neural audio.
3. **Scenario 3: Eyes-Free Accessibility (Voice-Only Commerce for Blind & Elderly Merchants):** Complete screen-free operation designed for visually impaired or elderly shopkeepers (e.g. Venkat-ji, 58 yrs, severe low vision). They query the Soundbox directly in Telugu (*"ఈ రోజు మొత్తం ఎంత కలెక్షన్ అయింది?"*), receive native audio answers, and approve customer retention offers with simple spoken affirmations (*"అవును, పంపించు"*).

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
│   • Pure Deterministic Analytics     • Sarvam AI & Edge-TTS Voice Engine│
│   • Sales, Cohorts & Retention       • Eyes-Free Audio Dialog Engine   │
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

1. **The Hook & Overview (0:00 - 0:30):**
   * Open `http://localhost:3000`. Show **Sharma General Store** dashboard: ₹4.8 Lakh monthly revenue, 1,420 bills, 68.4% repeat customer rate, and real-time Soundbox connection status.
2. **Scenario 3: Eyes-Free Voice Copilot for Accessibility (0:30 - 1:15):**
   * Click **"🎙️ Launch Eyes-Free Voice Demo (Scenario 3)"** on the main dashboard.
   * Introduce Venkat-ji (58-year-old shopkeeper with low vision / cataracts).
   * Demonstrate 100% screen-free voice querying: speak in Telugu (*"ఈ రోజు మొత్తం ఎంత కలెక్షన్ అయింది?"*), hear the authentic audio response (*"85 లావాదేవీలు • ₹9,420 కలెక్షన్..."*), and approve the retention offer for Rajesh-ji with a spoken *"అవును, పంపించు"*.
3. **The Voice Multilingual Copilot (1:15 - 1:55):**
   * Switch to **"AI Business Copilot"**. Click the microphone or choose queries in Hindi, Telugu, Tamil, Kannada, or Hinglish:
     *"Pichle hafte se compare karke batao business kaisa hai?"*
   * Point out the **`⚡ Tool Executed: compare_sales_periods()`** badge showing zero financial hallucinations.
4. **Soundbox Customer Retention & Slump Recovery (1:55 - 2:30):**
   * Open **"Customer Loyalty"** to reveal the **42 At-Risk regular customers** identified via Soundbox UPI VPAs.
   * Switch to **"WhatsApp Campaigns"**. Click **"Generate AI WhatsApp Message"**.
   * Inspect the formatted message preview inside the **Smartphone Simulator**.
   * Click **"Approve Campaign"** and click **"Send via WhatsApp"** to launch direct sharing (`wa.me/?text=...`).
5. **The Conclusion (2:30 - 3:00):**
   * Conclude: *"Vyapaar AI transforms passive Soundbox pings into an active voice copilot, inclusive eyes-free accessibility for blind merchants, and 1-click customer retention on a 100% free-tier stack."*

---

## 🛡️ Key Technical Guardrails

- **Zero Hallucination Guarantee:** Financial totals, growth percentages, and customer counts are computed in deterministic Python Pandas; LLMs only format and synthesize the final message.
- **100% Free-Tier:** Built without OpenAI or paid subscriptions. Works with Google Gemini 1.5 Flash free tier, Edge-TTS, and browser-native Web Speech API.
- **Privacy & Compliance:** All customer phone numbers and VPAs are masked (e.g. `rahul***@paytm`), respecting DPDP Act guidelines.
