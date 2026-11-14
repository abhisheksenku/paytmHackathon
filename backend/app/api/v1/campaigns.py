import json
import urllib.parse
import urllib.request
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.database import get_db
from app.models.models import Campaign, Merchant

router = APIRouter(prefix="/campaigns", tags=["WhatsApp Campaigns"])

class CampaignCreate(BaseModel):
    target_segment: str
    objective: str = "Retention"
    category: Optional[str] = "Retention"
    language: Optional[str] = "Hinglish"
    discount_pct: int = 15
    custom_instruction: Optional[str] = None
    recipient_name: Optional[str] = "Rajeshwari"
    recipient_phone: Optional[str] = "8374360774"

class CampaignResponse(BaseModel):
    id: str
    name: str
    target_segment: str
    objective: str
    message_text: str
    discount_code: Optional[str]
    discount_pct: int
    status: str
    whatsapp_share_url: str
    created_at: str

def format_whatsapp_url(message: str, phone: str = "8374360774") -> str:
    encoded_text = urllib.parse.quote(message)
    clean = "".join(filter(str.isdigit, phone)) if phone else "8374360774"
    return f"https://wa.me/91{clean}?text={encoded_text}"

def build_deterministic_multilingual_campaign(
    merchant: Merchant,
    recipient_name: str,
    category: str,
    objective: str,
    discount_pct: int,
    code: str,
    language: str,
    custom_instruction: Optional[str] = None
) -> tuple[str, str]:
    """
    Generates culturally tuned, high-converting WhatsApp copy across all 6 Indian languages.
    Returns (campaign_name, message_text).
    """
    lang = (language or "Hinglish").capitalize()
    rec_name = recipient_name.strip() if recipient_name else "Valued Customer"
    rec_title = f"{rec_name}-ji" if not rec_name.endswith(("-ji", "garu", "avargale", "avare")) else rec_name
    cat = (category or objective or "Retention").lower()
    
    owner = merchant.owner_name or "Abhishek"
    store = merchant.business_name or "Sharma General Store"
    phone = merchant.phone or "8919581022"
    signoff = f"\n\n— {owner}, {store} (📞 {phone})"
    
    extra = f"\n📢 {custom_instruction.strip()}\n" if custom_instruction and len(custom_instruction.strip()) > 3 else ""

    # 1. TELUGU (తెలుగు)
    if lang == "Telugu":
        rec_title = f"{rec_name} గారూ"
        if "festival" in cat or "seasonal" in cat or "diwali" in cat or "pongal" in cat:
            name = "పండుగ స్పెషల్ ఆఫర్ (Festival Special)"
            msg = (
                f"🎉 పండుగ శుభాకాంక్షలు {rec_title}! 🪔\n\n"
                f"*{store}* లో పండుగ స్పెషల్ మెగా ఆఫర్స్ ప్రారంభమయ్యాయి!\n"
                f"అన్ని కిరాణా వస్తువులు మరియు నిత్యావసర సరుకులపై *ఫ్లాట్ {discount_pct}% రాయితీ (OFF)*:\n\n"
                f"🎟️ కూపన్ కోడ్: *{code}*\n"
                f"⏰ ఆఫర్ ఈ వారం మాత్రమే చెల్లుబాటు అవుతుంది.{extra}\n"
                f"కౌంటర్ వద్ద Paytm సౌండ్‌బాక్స్ లేదా UPI ద్వారా చెల్లించి మీ డిస్కౌంట్ పొందండి."
                f"{signoff}"
            )
        elif "loyalty" in cat or "vip" in cat or "regular" in cat:
            name = "VIP లాయల్టీ రివార్డ్ (VIP Reward)"
            msg = (
                f"నమస్కారం {rec_title}! 🙏\n\n"
                f"*{store}* కు మీరు అత్యంత ఆత్మీయమైన మరియు రెగ్యులర్ కస్టమర్ అయినందుకు మా కృతజ్ఞతలు.\n\n"
                f"మీ కోసమే ప్రత్యేకమైన VIP రివార్డ్: మీ తర్వాతి కొనుగోలుపై *ఫ్లాట్ {discount_pct}% OFF*!\n"
                f"🎟️ కూపన్ కోడ్: *{code}*\n"
                f"⏰ వచ్చే 7 రోజుల్లో ఉపయోగించుకోండి.{extra}\n"
                f"చెల్లింపులను Paytm QR సౌండ్‌బాక్స్ ద్వారా సులభంగా పూర్తి చేయండి."
                f"{signoff}"
            )
        elif "flash" in cat or "slump" in cat or "afternoon" in cat:
            name = "మధ్యాహ్నం ఫ్లాష్ సేల్ (Afternoon Flash Deal)"
            msg = (
                f"నమస్కారం {rec_title}! ☀️\n\n"
                f"*{store}* మధ్యాహ్నం ప్రత్యేక ఫ్లాష్ ఆఫర్!\n"
                f"మధ్యాహ్నం 1:00 నుండి సాయంత్రం 5:00 గంటల మధ్య బిల్లింగ్‌పై *ఫ్లాట్ {discount_pct}% OFF*:\n"
                f"🎟️ కూపన్ కోడ్: *{code}*{extra}\n"
                f"Paytm సౌండ్‌బాక్స్ ద్వారా చెల్లించి ఈ ఆఫర్ పొందండి."
                f"{signoff}"
            )
        elif "weekend" in cat or "basket" in cat:
            name = "వీకెండ్ సూపర్ సేవర్ (Weekend Saver)"
            msg = (
                f"🌟 *{store} వీకెండ్ ధమాకా ఆఫర్!* 🌟\n\n"
                f"నమస్కారం {rec_title}! ఈ శని-ఆదివారాల్లో ₹499 కంటే ఎక్కువ కొనుగోళ్లపై *ఫ్లాట్ {discount_pct}% OFF*:\n"
                f"🎟️ కోడ్: *{code}*{extra}\n"
                f"Paytm సౌండ్‌బాక్స్ చెల్లింపులపై తక్షణ తగ్గింపు లభిస్తుంది."
                f"{signoff}"
            )
        else:
            name = "ప్రత్యేక రీకనెక్ట్ ఆఫర్ (Customer Win-Back)"
            msg = (
                f"నమస్కారం {rec_title}! 🙏\n\n"
                f"మీరు *{store}* కు వచ్చి చాలా రోజులయింది, మీ రాకను మేము మిస్సవుతున్నాము.\n"
                f"మీ కోసం ప్రత్యేకమైన వెల్‌కమ్ ఆఫర్: మీ తర్వాతి బిల్లుపై *ఫ్లాట్ {discount_pct}% తగ్గింపు*!\n\n"
                f"🎟️ కూపన్ కోడ్: *{code}*\n"
                f"⏰ ఈ ఆదివారం వరకు మాత్రమే చెల్లుతుంది.{extra}\n"
                f"దుకాణాన్ని సందర్శించండి లేదా ఆర్డర్ కోసం రిప్లై ఇవ్వండి. Paytm సౌండ్‌బాక్స్ చెల్లింపులు ఆమోదించబడతాయి!"
                f"{signoff}"
            )
        return name, msg

    # 2. HINDI (हिंदी)
    if lang == "Hindi":
        rec_title = f"{rec_name} जी"
        if "festival" in cat or "seasonal" in cat or "diwali" in cat:
            name = "फेस्टिवल स्पेशल ऑफर (Festival Special)"
            msg = (
                f"🎉 त्योहार की हार्दिक शुभकामनाएं {rec_title}! 🪔\n\n"
                f"*{store}* पर फेस्टिवल स्पेशल महाबचत ऑफर शुरू हो चुका है!\n"
                f"दैनिक राशन व किराना सामान की खरीदारी पर *फ्लैट {discount_pct}% की छूट*:\n\n"
                f"🎟️ कूपन कोड: *{code}*\n"
                f"⏰ सीमित समय के लिए मान्य।{extra}\n"
                f"बिलिंग काउंटर पर Paytm साउंडबॉक्स / UPI से भुगतान करें और छूट पाएं।"
                f"{signoff}"
            )
        elif "loyalty" in cat or "vip" in cat or "regular" in cat:
            name = "VIP लॉयल्टी रिवॉर्ड (VIP Loyalty)"
            msg = (
                f"नमस्ते {rec_title}! 🙏\n\n"
                f"*{store}* के सबसे पसंदीदा नियमित ग्राहक बनने के लिए बहुत-बहुत धन्यवाद।\n"
                f"आपके लिए विशेष VIP रिवॉर्ड: अगली खरीदारी पर *फ्लैट {discount_pct}% OFF*!\n"
                f"🎟️ कूपन कोड: *{code}*\n"
                f"⏰ अगले 7 दिनों तक मान्य।{extra}\n"
                f"Paytm साउंडबॉक्स से आसान व सुरक्षित भुगतान करें।"
                f"{signoff}"
            )
        elif "flash" in cat or "slump" in cat or "afternoon" in cat:
            name = "दोपहर फ्लैश डील (Afternoon Flash Deal)"
            msg = (
                f"नमस्ते {rec_title}! ☀️\n\n"
                f"*{store}* दोपहर स्पेशल फ्लैश सेल!\n"
                f"दोपहर 1:00 से शाम 5:00 बजे तक खरीदारी पर *फ्लैट {discount_pct}% OFF*:\n"
                f"🎟️ कोड: *{code}*{extra}\n"
                f"काउंटर पर यह मैसेज दिखाएं और Paytm साउंडबॉक्स से पे करें।"
                f"{signoff}"
            )
        else:
            name = "विशेष ग्राहक वापसी ऑफर (Customer Reconnect)"
            msg = (
                f"नमस्ते {rec_title}! 🙏\n\n"
                f"काफी दिनों से आप *{store}* नहीं आए, हमने आपको मिस किया!\n"
                f"आपके लिए खास वेलकम-बैक ऑफर: अगली किराना खरीदारी पर *फ्लैट {discount_pct}% की छूट*!\n\n"
                f"🎟️ कूपन कोड: *{code}*\n"
                f"⏰ यह ऑफर इस रविवार तक मान्य है।{extra}\n"
                f"आज ही दुकान पर पधारें या सामान ऑर्डर करने के लिए रिप्लाई करें। Paytm साउंडबॉक्स से तुरंत भुगतान!"
                f"{signoff}"
            )
        return name, msg

    # 3. HINGLISH
    if lang == "Hinglish":
        rec_title = f"{rec_name}-ji"
        if "festival" in cat or "seasonal" in cat:
            name = "Festive Mega Sale (Festival Special)"
            msg = (
                f"🎉 Festive Greetings {rec_title}! 🪔\n\n"
                f"*{store}* par Festival Mega Savings Sale live ho chuki hai!\n"
                f"Sabhi grocery aur daily provisions par enjoy kijiye *Flat {discount_pct}% OFF*:\n\n"
                f"🎟️ Promo Code: *{code}*\n"
                f"⏰ Limited Festive Window!{extra}\n"
                f"Counter par Paytm Soundbox ya UPI se pay karein aur instant discount paayein."
                f"{signoff}"
            )
        elif "loyalty" in cat or "vip" in cat:
            name = "VIP Regulars Reward (Loyalty Offer)"
            msg = (
                f"Namaste {rec_title}! 🙏\n\n"
                f"Thank you for being one of *{store}*'s most valued regular shoppers!\n"
                f"As a special token of gratitude, here is an exclusive *Flat {discount_pct}% OFF* on your next visit:\n\n"
                f"🎟️ VIP Code: *{code}*\n"
                f"⏰ Valid for the next 7 days.{extra}\n"
                f"Pay easily via Paytm Soundbox QR. Looking forward to welcoming you!"
                f"{signoff}"
            )
        elif "flash" in cat or "slump" in cat:
            name = "Afternoon Flash Deal (Slump Hours)"
            msg = (
                f"Namaste {rec_title}! ☀️\n\n"
                f"*{store}* Afternoon Flash Deal!\n"
                f"Dopahar 1:00 PM se 5:00 PM ke beech grocery order par payein *Flat {discount_pct}% OFF*:\n"
                f"🎟️ Code: *{code}*{extra}\n"
                f"Bas checkout par code dikhaiye aur Paytm Soundbox se pay kijiye."
                f"{signoff}"
            )
        else:
            name = "Special Reconnect Offer (Win-Back)"
            msg = (
                f"Namaste {rec_title}! 🙏\n\n"
                f"We noticed it's been a while since your last visit to *{store}*. We missed you!\n\n"
                f"As a special welcome-back gift, enjoy *Flat {discount_pct}% OFF* on your next grocery order:\n"
                f"🎟️ Coupon Code: *{code}*\n"
                f"⏰ Valid till this Sunday on Paytm Soundbox / UPI payment.{extra}\n"
                f"Visit our store today or reply directly to this message to order your daily essentials!"
                f"{signoff}"
            )
        return name, msg

    # 4. TAMIL (தமிழ்)
    if lang == "Tamil":
        rec_title = f"{rec_name} அவர்களே"
        name = "சிறப்பு சலுகை (Special Offer)"
        msg = (
            f"வணக்கம் {rec_title}! 🙏\n\n"
            f"*{store}* இல் உங்கள் அடுத்த மளிகைப் பொருட்கள் வாங்குவதற்கு *பிளாட் {discount_pct}% தள்ளுபடி*!\n\n"
            f"🎟️ கூப்பன் குறியீடு: *{code}*\n"
            f"⏰ இந்த ஞாயிற்றுக்கிழமை வரை மட்டுமே செல்லுபடியாகும்.{extra}\n"
            f"Paytm சவுண்ட்பாக்ஸ் / UPI மூலம் எளிதாக பணம் செலுத்துங்கள்!"
            f"{signoff}"
        )
        return name, msg

    # 5. KANNADA (ಕನ್ನಡ)
    if lang == "Kannada":
        rec_title = f"{rec_name} ಅವರೇ"
        name = "ವಿಶೇಷ ಆಫರ್ (Special Offer)"
        msg = (
            f"ನಮಸ್ಕಾರ {rec_title}! 🙏\n\n"
            f"*{store}* ನಲ್ಲಿ ನಿಮ್ಮ ಮುಂದಿನ ದಿನಸಿ ಖರೀದಿಯ ಮೇಲೆ *ಫ್ಲಾಟ್ {discount_pct}% ರಿಯಾಯಿತಿ*!\n\n"
            f"🎟️ ಕೂಪನ್ ಕೋಡ್: *{code}*\n"
            f"⏰ ಈ ಭಾನುವಾರದವರೆಗೆ ಮಾತ್ರ ಮಾನ್ಯವಾಗಿದೆ.{extra}\n"
            f"Paytm ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಮೂಲಕ ಸುಲಭವಾಗಿ ಪಾವತಿಸಿ!"
            f"{signoff}"
        )
        return name, msg

    # 6. ENGLISH
    rec_title = f"{rec_name}-ji"
    name = f"{category or 'Special'} Offer"
    msg = (
        f"Namaste {rec_title}! 🙏\n\n"
        f"Exclusive greetings from *{store}*!\n"
        f"Enjoy *Flat {discount_pct}% OFF* on your next grocery and household essentials purchase:\n\n"
        f"🎟️ Coupon Code: *{code}*\n"
        f"⏰ Valid till this Sunday on payments via Paytm Soundbox / UPI.{extra}\n"
        f"Visit us today or reply here to place your order directly!"
        f"{signoff}"
    )
    return name, msg

@router.get("")
def list_campaigns(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    if not merchant:
        return {"success": True, "data": []}

    campaigns = db.query(Campaign).filter(
        Campaign.merchant_id == merchant.id
    ).order_by(Campaign.created_at.desc()).all()

    results = []
    for c in campaigns:
        results.append({
            "id": c.id,
            "name": c.name,
            "target_segment": c.target_segment,
            "objective": c.objective,
            "message_text": c.message_text,
            "discount_code": c.discount_code,
            "discount_pct": c.discount_pct,
            "status": c.status,
            "whatsapp_share_url": format_whatsapp_url(c.message_text),
            "created_at": c.created_at.strftime("%Y-%m-%d %H:%M")
        })

    return {"success": True, "data": results}

@router.post("/generate")
def generate_campaign(req: CampaignCreate, db: Session = Depends(get_db)):
    """
    AI drafts an actionable WhatsApp promotion message tailored to the chosen category, language, and requirements.
    """
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found.")

    code = f"SAVE{req.discount_pct}"
    recipient_phone = req.recipient_phone or "8374360774"
    recipient_name = req.recipient_name or "Rajeshwari"
    language = req.language or "Hinglish"
    category = req.category or req.objective or "Customer Retention"

    # 1. Deterministic Multilingual Draft (covers all 6 languages reliably)
    name, message = build_deterministic_multilingual_campaign(
        merchant=merchant,
        recipient_name=recipient_name,
        category=category,
        objective=req.objective or "Retention",
        discount_pct=req.discount_pct,
        code=code,
        language=language,
        custom_instruction=req.custom_instruction
    )

    # 2. Gemini LLM Dynamic Generation if key configured
    if settings.GEMINI_API_KEY and len(settings.GEMINI_API_KEY.strip()) > 10:
        try:
            model_name = getattr(settings, "GEMINI_MODEL", "gemini-flash-lite-latest") or "gemini-flash-lite-latest"
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={settings.GEMINI_API_KEY}"
            prompt = (
                f"You are an expert retail marketing copywriter for {merchant.business_name}, owned by {merchant.owner_name} (Phone: {merchant.phone}).\n"
                f"Draft an authentic, high-converting WhatsApp promotion message tailored to the customer.\n\n"
                f"Requirements:\n"
                f"- Recipient: {recipient_name}\n"
                f"- Category: {category}\n"
                f"- Objective: {req.objective}\n"
                f"- Language: {language}\n"
                f"- Discount / Offer: Flat {req.discount_pct}% OFF (Coupon Code: {code})\n"
                f"- Special Instruction / Custom Note: {req.custom_instruction or 'None'}\n"
                f"- Payment Mode: Paytm Soundbox / UPI\n\n"
                f"STRICT RULES:\n"
                f"1. Output ONLY the raw ready-to-send WhatsApp message. Do NOT add preamble, quotes, or conversational explanations.\n"
                f"2. Write 100% in {language}. If Telugu, use natural Telugu script. If Hindi, use natural Devanagari Hindi. If Hinglish, use Roman script Hinglish. If English, use polite Indian English. If Tamil or Kannada, use respective scripts.\n"
                f"3. Use emojis (🙏, 🎟️, ⏰, ⚡, 🌟) and WhatsApp formatting like *bold* appropriately.\n"
                f"4. Must end with this exact signoff:\n"
                f"— {merchant.owner_name}, {merchant.business_name} (📞 {merchant.phone})"
            )
            payload = json.dumps({
                "contents": [{"parts": [{"text": prompt}]}]
            }).encode()
            req_gemini = urllib.request.Request(
                url,
                data=payload,
                headers={"Content-Type": "application/json"},
                method="POST"
            )
            with urllib.request.urlopen(req_gemini, timeout=6) as resp:
                data = json.loads(resp.read().decode())
                cand = data.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if cand and len(cand.strip()) > 30:
                    message = cand.strip()
        except Exception as e:
            # Silently fall back to verified deterministic copy
            pass

    camp = Campaign(
        merchant_id=merchant.id,
        name=name,
        target_segment=req.target_segment,
        objective=req.objective,
        message_text=message,
        discount_code=code,
        discount_pct=req.discount_pct,
        status="DRAFT"
    )
    db.add(camp)
    db.commit()
    db.refresh(camp)

    return {
        "success": True,
        "data": {
            "id": camp.id,
            "name": camp.name,
            "target_segment": camp.target_segment,
            "objective": camp.objective,
            "category": category,
            "language": language,
            "message_text": camp.message_text,
            "discount_code": camp.discount_code,
            "discount_pct": camp.discount_pct,
            "status": camp.status,
            "whatsapp_share_url": format_whatsapp_url(camp.message_text, phone=recipient_phone),
            "created_at": camp.created_at.strftime("%Y-%m-%d %H:%M")
        }
    }

@router.post("/{campaign_id}/approve")
def approve_campaign(campaign_id: str, db: Session = Depends(get_db)):
    camp = db.query(Campaign).filter(Campaign.id == campaign_id).first()
    if not camp:
        raise HTTPException(status_code=404, detail="Campaign not found")

    camp.status = "APPROVED"
    db.commit()

    return {
        "success": True,
        "message": "Campaign approved and ready to broadcast via WhatsApp!",
        "whatsapp_url": format_whatsapp_url(camp.message_text)
    }
