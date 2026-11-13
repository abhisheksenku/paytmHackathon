import os
import asyncio
import edge_tts

SCRIPTS = {
    "briefing_hindi.mp3": {
        "voice": "hi-IN-MadhurNeural",
        "text": "नमस्ते शर्मा जी! कल आपकी दुकान का कुल कलेक्शन 18,450 रुपये रहा, जिसमें कुल 34 ट्रांजेक्शन हुए। शाम 7 बजे सबसे ज्यादा भीड़ देखी गई। पिछले हफ्ते के मुकाबले कल का व्यापार 12.5% बेहतर रहा। अलर्ट: अमूल बटर का स्टॉक कम है। व्यापार AI की तरफ से आपका आज का दिन शुभ और मुनाफेदार हो!"
    },
    "briefing_telugu.mp3": {
        "voice": "te-IN-MohanNeural",
        "text": "నమస్కారం శర్మ గారూ! నిన్న మీ దుకాణం మొత్తం కలెక్షన్ 18,450 రూపాయలు, ఇందులో మొత్తం 34 లావాదేవీలు జరిగాయి. సాయంత్రం 7 గంటలకు అత్యధిక రద్దీ కనిపించింది. గత వారంతో పోలిస్తే నిన్నటి వ్యాపారం 12.5% పెరిగింది. అలర్ట్: అమూల్ బటర్ స్టాక్ తక్కువగా ఉంది. వ్యాపార్ AI తరపున మీకు శుభదినం మరియు లాభదాయకమైన రోజు కావాలని కోరుకుంటున్నాము!"
    },
    "briefing_tamil.mp3": {
        "voice": "ta-IN-ValluvarNeural",
        "text": "வணக்கம் சர்மா அவர்களே! நேற்று உங்கள் கடையின் மொத்த வசூல் 18,450 ரூபாய், இதில் மொத்தம் 34 பரிவர்த்தனைகள் நடந்தன. மாலை 7 மணிக்கு அதிக கூட்டம் இருந்தது. கடந்த வாரத்தை விட நேற்று விற்பனை 12.5% அதிகரித்துள்ளது. வியாபார் AI சார்பாக இனிய நாளாக அமைய வாழ்த்துகள்!"
    },
    "briefing_kannada.mp3": {
        "voice": "kn-IN-GaganNeural",
        "text": "ನಮಸ್ಕಾರ ಶರ್ಮಾ ಅವರೇ! ನಿನ್ನೆ ನಿಮ್ಮ ಅಂಗಡಿಯ ಒಟ್ಟು ಸಂಗ್ರಹ 18,450 ರೂಪಾಯಿಗಳು, ಇದರಲ್ಲಿ 34 ವಹಿವಾಟುಗಳು ನಡೆದಿವೆ. ಸಂಜೆ 7 ಗಂಟೆಗೆ ಗರಿಷ್ಠ ವ್ಯಾಪಾರ ದಾಖಲಾಗಿದೆ. ಕಳೆದ ವಾರಕ್ಕಿಂತ ವ್ಯಾಪಾರ 12.5% ಹೆಚ್ಚಾಗಿದೆ. ವ್ಯಾಪಾರ AI ವತಿಯಿಂದ ನಿಮಗೆ ಶುಭ ದಿನ!"
    },
    "briefing_english.mp3": {
        "voice": "en-IN-NeerjaNeural",
        "text": "Good morning Sharma ji! Yesterday your store collection was 18,450 rupees across 34 transactions. Peak footfall was observed at 7:00 PM. Sales grew by 12.5% compared to last week. Alert: Amul Butter stock is running low. Vyapaar AI wishes you a profitable business day ahead!"
    },
    "briefing_hinglish.mp3": {
        "voice": "hi-IN-MadhurNeural",
        "text": "Namaste Sharma ji! Kal aapki dukaan ka total collection 18,450 rupees raha, jisme kul 34 transactions hue. Shaam 7 baje sabse zyada bheed dekhi gayi. Pichle hafte ke mukable kal ka dhandha 12.5% behtar raha. Alert: Amul Butter ka stock kam hai. Vyapaar AI ki taraf se aapka aaj ka din shubh aur munafedaar ho!"
    }
}

OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "public", "audio"))

async def generate_all():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"Target directory: {OUT_DIR}")
    for fname, data in SCRIPTS.items():
        out_path = os.path.join(OUT_DIR, fname)
        print(f"Generating {fname} with voice {data['voice']}...")
        try:
            comm = edge_tts.Communicate(data["text"], data["voice"], rate="+0%", pitch="+0Hz")
            await comm.save(out_path)
            size = os.path.getsize(out_path)
            print(f"  [SUCCESS] {fname} ({size} bytes)")
        except Exception as e:
            print(f"  [ERROR] Failed {fname}: {e}")

if __name__ == "__main__":
    asyncio.run(generate_all())
