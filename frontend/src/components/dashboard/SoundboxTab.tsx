"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Languages,
  Clock,
  Coffee,
  Mic,
  MicOff,
  MessageSquare,
  Send,
  Users,
  User,
  Bot,
} from "lucide-react";
import { SoundboxBriefing } from "@/lib/types";
import { speakText, stopSpeech } from "@/lib/speech";
import { apiEndpoints } from "@/lib/api";
import { getTranslation } from "@/lib/translations";

interface SoundboxTabProps {
  briefing: SoundboxBriefing | null;
  isLoading?: boolean;
  language?: string;
}

export type SoundboxTimelineMode = "morning" | "afternoon" | "ondemand";

interface ModeDialogue {
  title: string;
  subtitle: string;
  timeTag: string;
  badge: string;
  native: string;
  phonetic: string;
  followupPrompt?: {
    question: string;
    actionLabel: string;
    confirmAudioNative: string;
    confirmAudioPhonetic: string;
  };
}

interface PresetQueryItem {
  q: string;
  ans: string;
  phonetic?: string;
}

export const TIMELINE_CONTENT: Record<string, Record<SoundboxTimelineMode, ModeDialogue>> = {
  Hinglish: {
    morning: {
      title: "Morning Dukaan Opening Briefing",
      subtitle: "30-second automated collection summary synthesized at 8:00 AM before shutters open",
      timeTag: "⏰ 8:00 AM • Morning Opening",
      badge: "Stage 1: Daily Briefing",
      native:
        "Namaste Sharma ji! Kal aapki dukaan ka total collection ₹18,450 raha across 64 UPI bills. Shaam 7 baje sabse zyada bheed dekhi gayi. Pichle hafte ke mukable kal ka dhandha 12.5% behtar raha. Alert: 42 regular grahak pichle 20 dino se nahi aaye hain. Vyapaar AI ki taraf se aapka aaj ka din shubh aur munafedaar ho!",
      phonetic:
        "Namaste Sharma ji! Kal aapki dukaan ka total collection atharah hazaar chaar sau pachaas rupaye raha across chausath UPI bills. Shaam saat baje sabse zyada bheed dekhi gayi. Pichle hafte ke mukable kal ka dhandha baarah point paanch percent behtar raha. Alert: Byalees regular grahak pichle bees dino se nahi aaye hain. Vyapaar AI ki taraf se aapka aaj ka din shubh aur munafedaar ho!",
    },
    afternoon: {
      title: "Afternoon Slump Proactive Retention Prompt",
      subtitle: "Quiet afternoon prompt (1:30 PM) to recover inactive regulars with 1-word spoken confirmation",
      timeTag: "☕ 1:30 PM • Afternoon Slump Hours",
      badge: "Stage 2: Proactive Retention",
      native:
        "Sharma-ji, Rajesh-ji aur 41 regular grahak pichle 22 dino se dukaan par nahi aaye hain. Kya unhe WhatsApp par ₹30 ka discount coupon bhej dein?",
      phonetic:
        "Sharma-ji, Rajesh-ji aur byalees regular grahak pichle baais dino se dukaan par nahi aaye hain. Kya unhe WhatsApp par tees rupaye ka discount coupon bhej dein?",
      followupPrompt: {
        question: "Rajesh-ji & 41 regulars inactive for 22 days",
        actionLabel: "हाँ, भेज दो (Yes, Send It)",
        confirmAudioNative: "Bahut badhiya Sharma-ji! 42 regular grahakon ko WhatsApp coupon code SAVE30 successfully dispatch kar diya gaya hai.",
        confirmAudioPhonetic: "Bahut badhiya Sharma-ji! Byalees regular grahakon ko WhatsApp coupon code SAVE30 successfully dispatch kar diya gaya hai.",
      },
    },
    ondemand: {
      title: "On-Demand Spoken Store Intelligence",
      subtitle: "Screen-free voice query anytime during the day (designed for quick checks & blind merchants)",
      timeTag: "🎙️ Live • On-Demand Voice Query",
      badge: "Stage 3: Anytime Voice Query",
      native:
        "Sharma-ji, aaj shaam 5:00 PM tak aapki dukaan par 42 bills complete ho chuke hain, total collection ₹5,830 raha. Shaam ki bheed shuru hone wali hai!",
      phonetic:
        "Sharma-ji, aaj shaam paanch baje tak aapki dukaan par byalees bills complete ho chuke hain, total collection paanch hazaar aath sau tees rupaye raha. Shaam ki bheed shuru hone wali hai!",
    },
  },
  Hindi: {
    morning: {
      title: "दुकान सुबह ओपनिंग ब्रीफिंग",
      subtitle: "दुकान का शटर खुलने से पहले सुबह 8:00 बजे 30-सेकंड की ऑडियो रिपोर्ट",
      timeTag: "⏰ सुबह 8:00 बजे • दुकान ओपनिंग",
      badge: "चरण 1: दैनिक ब्रीफिंग",
      native:
        "नमस्ते शर्मा जी! कल आपकी दुकान का कुल कलेक्शन ₹18,450 रहा, जिसमें कुल 64 UPI ट्रांजेक्शन हुए। शाम 7:00 बजे सबसे ज्यादा भीड़ देखी गई। पिछले हफ्ते के मुकाबले बिक्री 12.5% बेहतर रही। अलर्ट: 42 नियमित ग्राहक पिछले 20 दिनों से नहीं आए हैं। व्यापार AI की तरफ से आपका दिन शुभ और मुनाफेदार हो!",
      phonetic:
        "Namaste Sharma ji! Kal aapki dukaan ka kul collection atharah hazaar chaar sau pachaas rupaye raha, jisme kul chausath transactions hue. Shaam saat baje sabse zyada bheed dekhi gayi. Pichle hafte ke mukable kal ka dhandha baarah point paanch percent behtar raha. Alert: Byalees regular grahak pichle bees dino se nahi aaye hain. Vyapaar AI ki taraf se aapka aaj ka din shubh aur munafedaar ho!",
    },
    afternoon: {
      title: "दोपहर की सुस्ती में कस्टमर रिटेंशन अलर्ट",
      subtitle: "दोपहर 1:30 बजे खाली समय में छूटे हुए ग्राहकों को वापस बुलाने का 1-क्लिक वॉयस अलर्ट",
      timeTag: "☕ दोपहर 1:30 बजे • सुस्त समय",
      badge: "चरण 2: सक्रिय ग्राहक वापसी",
      native:
        "शर्मा जी, राजेश जी और 41 नियमित ग्राहक पिछले 22 दिनों से दुकान पर नहीं आए हैं। क्या उन्हें व्हाट्सएप पर ₹30 का डिस्काउंट कूपन भेज दें?",
      phonetic:
        "Sharma ji, Rajesh ji aur byalees regular grahak pichle baais dino se dukaan par nahi aaye hain. Kya unhe WhatsApp par tees rupaye ka discount coupon bhej dein?",
      followupPrompt: {
        question: "राजेश जी और 41 नियमित ग्राहक 22 दिनों से नहीं आए",
        actionLabel: "हाँ, भेज दो (Yes, Send Offer)",
        confirmAudioNative: "बहुत बढ़िया शर्मा जी! 42 नियमित ग्राहकों को ₹30 का व्हाट्सएप कूपन कोड SAVE30 तुरंत भेज दिया गया है।",
        confirmAudioPhonetic: "Bahut badhiya Sharma ji! Byalees regular grahakon ko tees rupaye ka WhatsApp coupon code SAVE30 turant bhej diya gaya hai.",
      },
    },
    ondemand: {
      title: "दुकान से बोलकर कभी भी पूछें (ऑन-डिमांड)",
      subtitle: "स्क्रीन देखने की जरूरत नहीं — साउंडबॉक्स खुद बोलकर तुरंत जवाब देगा",
      timeTag: "🎙️ लाइव • ऑन-डिमांड वॉयस सवाल",
      badge: "चरण 3: ऑन-डिमांड वॉयस",
      native:
        "शर्मा जी, आज शाम 5:00 बजे तक आपकी दुकान पर कुल 42 बिल पूरे हुए हैं और कलेक्शन ₹5,830 रहा है। शाम की मुख्य भीड़ अब शुरू हो रही है।",
      phonetic:
        "Sharma ji, aaj shaam paanch baje tak aapki dukaan par kul byalees bill poore hue hain aur collection paanch hazaar aath sau tees rupaye raha hai. Shaam ki mukhya bheed ab shuru ho rahi hai.",
    },
  },
  Telugu: {
    morning: {
      title: "ఉదయం దుకాణం ఓపెనింగ్ బ్రీఫింగ్",
      subtitle: "ఉదయం 8:00 గంటలకు షట్టర్ తెరవక ముందే 30 సెకన్ల ఆడియో రిక్యాప్",
      timeTag: "⏰ ఉదయం 8:00 గంటలు • ఓపెనింగ్",
      badge: "దశ 1: డైలీ బ్రీఫింగ్",
      native:
        "నమస్కారం శర్మ గారూ! నిన్న మీ దుకాణం మొత్తం కలెక్షన్ ₹18,450, ఇందులో 64 UPI లావాదేవీలు జరిగాయి. సాయంత్రం 7 గంటలకు అత్యధిక రద్దీ కనిపించింది. గత వారంతో పోలిస్తే వ్యాపారం 12.5% పెరిగింది. అలర్ట్: 42 మంది రెగ్యులర్ కస్టమర్లు 20 రోజులుగా రాలేదు. వ్యాపార్ AI తరపున మీకు శుభదినం!",
      phonetic:
        "Namaskaram Sharma gaaru! Ninna mee dukaanam motham collection padhenimidi vela naalugu vandhala yaabhai rupayalu, andulo aravai naalugu UPI transactions jarigaayi. Saayantram yedu gantlaku athyadhika raddi kanipinchindi. Gatha vaaram tho polisthe vyaapaaram baarah point paanch percent perigindi. Alert: Nalabhai rendu mandi regular customers iravai rojuluga raaledhu. Vyapaar AI tharapuna meeku shubhadhinam!",
    },
    afternoon: {
      title: "మధ్యాహ్నపు రద్దీ లేని వేళ రిటెన్షన్ ప్రాంప్ట్",
      subtitle: "మధ్యాహ్నం 1:30 గంటలకు పాత కస్టమర్లను తిరిగి రప్పించే వాయిస్ ప్రాంప్ట్",
      timeTag: "☕ మధ్యాహ్నం 1:30 గంటలు • స్లంప్ అవర్స్",
      badge: "దశ 2: కస్టమర్ రిటెన్షన్",
      native:
        "శర్మ గారూ, రాజేష్ గారు మరియు 41 మంది రెగ్యులర్ కస్టమర్లు గత 22 రోజులుగా మీ దుకాణానికి రాలేదు. వారికి వాట్సాప్‌లో ₹30 డిస్కౌంట్ ఆఫర్ పంపమంటారా?",
      phonetic:
        "Sharma gaaru, Rajesh gaaru mariyu nalabhai rendu mandi regular customers gatha iravai rendu rojuluga mee dukaananiki raaledhu. Vaariki WhatsApp lo mupphai rupayala discount offer pampamantaara?",
      followupPrompt: {
        question: "రాజేష్ గారు & 41 మంది రెగ్యులర్లు 22 రోజులుగా రాలేదు",
        actionLabel: "అవును, పంపించు (Yes, Send Offer)",
        confirmAudioNative: "అద్భుతం శర్మ గారూ! 42 మంది కస్టమర్లకు వాట్సాప్ కూపన్ కోడ్ SAVE30 విజయవంతంగా పంపబడింది.",
        confirmAudioPhonetic: "Adbhutham Sharma gaaru! Nalabhai rendu mandi customerlaku WhatsApp coupon code SAVE30 vijayavanthamga pampabadindi.",
      },
    },
    ondemand: {
      title: "ఎప్పుడైనా మాట్లాడి తెలుసుకోండి (ఆన్-డిమాండ్)",
      subtitle: "స్క్రీన్ చూడనక్కర్లేదు — సౌండ్‌బాక్స్ నేరుగా మాట్లాడి లెక్కలు చెబుతుంది",
      timeTag: "🎙️ లైవ్ • ఆన్-డిమాండ్ వాయిస్",
      badge: "దశ 3: ఆన్-డిమాండ్ ప్రశ్నలు",
      native:
        "శర్మ గారూ, ఈ రోజు సాయంత్రం 5:00 గంటల వరకు 42 బిల్లులు పూర్తయ్యాయి, మొత్తం కలెక్షన్ ₹5,830. సాయంత్రం రద్దీ ప్రారంభం కానుంది.",
      phonetic:
        "Sharma gaaru, ee roju saayantram aidu gantala varaku nalabhai rendu billulu poorthayyaayi, motham collection aidu vela aenimidi vandhala mupphai rupayalu. Saayantram raddi praarambham kaanundi.",
    },
  },
  English: {
    morning: {
      title: "Morning Store Opening Briefing",
      subtitle: "30-second automated collection summary synthesized at 8:00 AM before shutters open",
      timeTag: "⏰ 8:00 AM • Morning Opening",
      badge: "Stage 1: Daily Briefing",
      native:
        "Good morning Sharma-ji! Yesterday's total collection was ₹18,450 across 64 UPI bills. Your biggest rush was at 7:00 PM. Sales grew by 12.5% compared to last week. Alert: 42 regular customers have not visited in 20+ days. Vyapaar AI wishes you a profitable business day ahead!",
      phonetic:
        "Good morning Sharma ji! Yesterday's total collection was eighteen thousand four hundred fifty rupees across sixty-four UPI bills. Your biggest rush was at 7:00 PM. Sales grew by 12.5% compared to last week. Alert: Forty-two regular customers have not visited in twenty days. Vyapaar AI wishes you a profitable business day ahead!",
    },
    afternoon: {
      title: "Afternoon Slump Proactive Retention Prompt",
      subtitle: "Quiet afternoon prompt (1:30 PM) to recover inactive regulars with 1-word spoken confirmation",
      timeTag: "☕ 1:30 PM • Afternoon Slump Hours",
      badge: "Stage 2: Proactive Retention",
      native:
        "Sharma-ji, Rajesh-ji and 41 regular customers haven't visited in the last 22 days. Would you like to send them a ₹30 WhatsApp coupon?",
      phonetic:
        "Sharma-ji, Rajesh-ji and forty-one regular customers haven't visited in the last twenty-two days. Would you like to send them a thirty rupee WhatsApp coupon?",
      followupPrompt: {
        question: "Rajesh-ji & 41 regulars inactive for 22 days",
        actionLabel: "Yes, Send It (Send Offer)",
        confirmAudioNative: "Excellent Sharma-ji! The ₹30 WhatsApp coupon code SAVE30 has been successfully dispatched to all 42 at-risk regular customers.",
        confirmAudioPhonetic: "Excellent Sharma ji! The thirty rupee WhatsApp coupon code SAVE30 has been successfully dispatched to all forty-two at-risk regular customers.",
      },
    },
    ondemand: {
      title: "On-Demand Spoken Store Intelligence",
      subtitle: "Screen-free voice query anytime during the day (designed for quick checks & blind merchants)",
      timeTag: "🎙️ Live • On-Demand Voice Query",
      badge: "Stage 3: Anytime Voice Query",
      native:
        "Sharma-ji, as of 5:00 PM today, 42 bills have been completed with a total collection of ₹5,830. Evening peak rush is starting now.",
      phonetic:
        "Sharma-ji, as of five PM today, forty-two bills have been completed with a total collection of five thousand eight hundred thirty rupees. Evening peak rush is starting now.",
    },
  },
  Tamil: {
    morning: {
      title: "காலை கடை திறப்பு அறிக்கை",
      subtitle: "காலை 8:00 மணிக்கு கடை திறக்கும் முன் 30 வினாடி ஆடியோ அறிக்கை",
      timeTag: "⏰ காலை 8:00 • திறப்பு",
      badge: "நிலை 1: காலை சுருக்கம்",
      native:
        "வணக்கம் சர்மா அவர்களே! நேற்று உங்கள் கடையின் மொத்த வசூல் ₹18,450 (64 UPI பில்கள்). மாலை 7 மணிக்கு அதிக கூட்டம் இருந்தது. கடந்த வாரத்தை விட நேற்று விற்பனை 12.5% அதிகரித்துள்ளது. எச்சரிக்கை: 42 வழக்கமான வாடிக்கையாளர்கள் 20 நாட்களாக வரவில்லை. வியாபார் AI சார்பாக இனிய நாளாக அமைய வாழ்த்துகள்!",
      phonetic:
        "Vanakkam Sharma avargale! Netru ungal kadayin motha vasool padhinettu aayirathu naanoothu aimbadhu roobai, idhil arupthi naangu UPI bills. Maalai yezhu manikku adhigam koottam irundhadhu. Vyapaar AI saarbaaga iniya naal aamaia vaazhthukkal!",
    },
    afternoon: {
      title: "மதிய வேளை வாடிக்கையாளர் தக்கவைப்பு",
      subtitle: "மதியம் 1:30 மணிக்கு வராத வாடிக்கையாளர்களை அழைக்க உடனடி குரல் எச்சரிக்கை",
      timeTag: "☕ மதியம் 1:30 • ஓய்வு நேரம்",
      badge: "நிலை 2: வாடிக்கையாளர் தக்கவைப்பு",
      native:
        "சர்மா அவர்களே, ராஜேஷ் மற்றும் 41 வழக்கமான வாடிக்கையாளர்கள் கடந்த 22 நாட்களாக கடைக்கு வரவில்லை. அவர்களுக்கு வாட்ஸ்அப்பில் ₹30 தள்ளுபடி கூப்பன் அனுப்பலாமா?",
      phonetic:
        "Sharma avargale, Rajesh mariyum naarpadhu oru regular customers kadandha irubathi rendu naatkalaga kadaiyirku varavillai. Avargalukku WhatsAppil mupphadhu roobai discount coupon anuppalaamaa?",
      followupPrompt: {
        question: "ராஜேஷ் மற்றும் 41 வாடிக்கையாளர்கள் 22 நாட்களாக வரவில்லை",
        actionLabel: "ஆம், அனுப்புங்கள் (Yes, Send)",
        confirmAudioNative: "சிறப்பானது சர்மா அவர்களே! 42 வாடிக்கையாளர்களுக்கு ₹30 வாட்ஸ்அப் கூப்பன் SAVE30 வெற்றிகரமாக அனுப்பப்பட்டது.",
        confirmAudioPhonetic: "Sirappaanadhu Sharma avargale! Naarpadhu irandu vaadikkaiyaalargalukku WhatsApp coupon SAVE30 vetrigaramaaga anuppappattadhu.",
      },
    },
    ondemand: {
      title: "எப்போது வேண்டுமானாலும் கேட்டு அறியலாம்",
      subtitle: "திரை பார்க்க தேவையில்லை — சவுண்ட்பாக்ஸ் குரல் மூலம் கணக்குகளைக் கூறும்",
      timeTag: "🎙️ நேரலை • உடனடி குரல் கேள்வி",
      badge: "நிலை 3: குரல் கேள்வி",
      native:
        "சர்மா அவர்களே, இன்று மாலை 5:00 மணி வரை 42 பில்கள் முடிந்துள்ளன, மொத்த வசூல் ₹5,830. மாலை நேர கூட்டம் இப்போது தொடங்குகிறது.",
      phonetic:
        "Sharma avargale, indru maalai aindhu mani varai naarpadhu irandu bills mudinthullana, motha vasool aindhaayirathu ennooru mupphadhu roobai.",
    },
  },
  Kannada: {
    morning: {
      title: "ಬೆಳಗಿನ ಅಂಗಡಿ ಆರಂಭದ ವರದಿ",
      subtitle: "ಬೆಳಿಗ್ಗೆ 8:00 ಗಂಟೆಗೆ ಶಟರ್ ತೆರೆಯುವ ಮುನ್ನ 30 ಸೆಕೆಂಡುಗಳ ಆಡಿಯೋ ಸಾರಾಂಶ",
      timeTag: "⏰ ಬೆಳಿಗ್ಗೆ 8:00 • ಅಂಗಡಿ ಆರಂಭ",
      badge: "ಹಂತ 1: ಬೆಳಗಿನ ಸಾರಾಂಶ",
      native:
        "ನಮಸ್ಕಾರ ಶರ್ಮಾ ಅವರೇ! ನಿನ್ನೆ ನಿಮ್ಮ ಅಂಗಡಿಯ ಒಟ್ಟು ಸಂಗ್ರಹ ₹18,450, ಇದರಲ್ಲಿ 64 UPI ವಹಿವಾಟುಗಳು ನಡೆದಿವೆ. ಸಂಜೆ 7 ಗಂಟೆಗೆ ಗರಿಷ್ಠ ವ್ಯಾಪಾರ ದಾಖಲಾಗಿದೆ. ಕಳೆದ ವಾರಕ್ಕಿಂತ ವ್ಯಾಪಾರ 12.5% ಹೆಚ್ಚಾಗಿದೆ. ಎಚ್ಚರಿಕೆ: 42 ನಿಯಮಿತ ಗ್ರಾಹಕರು 20 ದಿನಗಳಿಂದ ಬಂದಿಲ್ಲ. ವ್ಯಾಪಾರ AI ವತಿಯಿಂದ ನಿಮಗೆ ಶುಭ ದಿನ!",
      phonetic:
        "Namaskara Sharma avare! Ninne nimma angadiya sangraha hadinentu saavirada naanoora aivathu roopayi, idharalli aravatthu naalku UPI vahivaatugalu nadadhive. Sanje yelu gantege garishtha vyaapaara dhaakhalagidhe. Vyapaar AI vathiyinda nimge shubha dina!",
    },
    afternoon: {
      title: "ಮಧ್ಯಾಹ್ನದ ವಿಶ್ರಾಂತಿ ಸಮಯದಲ್ಲಿ ಗ್ರಾಹಕರ ಮರುಸಂಪರ್ಕ",
      subtitle: "ಮಧ್ಯಾಹ್ನ 1:30 ಕ್ಕೆ ನಿಯಮಿತ ಗ್ರಾಹಕರನ್ನು ಮರಳಿ ಕರೆತರಲು ಧ್ವನಿ ಪ್ರಾಂಪ್ಟ್",
      timeTag: "☕ ಮಧ್ಯಾಹ್ನ 1:30 • ವಿಶ್ರಾಂತಿ ಸಮಯ",
      badge: "ಹಂತ 2: ಗ್ರಾಹಕರ ರಿಟೆನ್ಷನ್",
      native:
        "ಶರ್ಮಾ ಅವರೇ, ರಾಜೇಶ್ ಅವರು ಮತ್ತು 41 ನಿಯಮಿತ ಗ್ರಾಹಕರು ಕಳೆದ 22 ದಿನಗಳಿಂದ ಅಂಗಡಿಗೆ ಬಂದಿಲ್ಲ. ಅವರಿಗೆ ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ₹30 ರಿಯಾಯಿತಿ ಕೂಪನ್ ಕಳುಹಿಸುವುದೇ?",
      phonetic:
        "Sharma avare, Rajesh avaru matthu nalavatthondu regular grahakaru kaledha iravatthieradu dinagalinda angadige bandilla. Avarige WhatsApp nalli moovatthu roopayi discount coupon kaluhisuvudhe?",
      followupPrompt: {
        question: "ರಾಜೇಶ್ ಮತ್ತು 41 ನಿಯಮಿತ ಗ್ರಾಹಕರು 22 ದಿನಗಳಿಂದ ಬಂದಿಲ್ಲ",
        actionLabel: "ಹೌದು, ಕಳುಹಿಸಿ (Yes, Send)",
        confirmAudioNative: "ಉತ್ತಮ ಶರ್ಮಾ ಅವರೇ! 42 ನಿಯಮಿತ ಗ್ರಾಹಕರಿಗೆ ₹30 ವಾಟ್ಸಾಪ್ ಕೂಪನ್ SAVE30 ಅನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ.",
        confirmAudioPhonetic: "Utthama Sharma avare! Nalavattheradu regular grahakarige WhatsApp coupon SAVE30 annu yashasviyaagi kaluhisalaagide.",
      },
    },
    ondemand: {
      title: "ಯಾವಾಗ ಬೇಕಾದರೂ ಮಾತನಾಡಿ ತಿಳಿಯಿರಿ",
      subtitle: "ಸ್ಕ್ರೀನ್ ನೋಡಬೇಕಿಲ್ಲ — ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಧ್ವನಿಯ ಮೂಲಕ ನಿಖರ ಲೆಕ್ಕ ನೀಡುತ್ತದೆ",
      timeTag: "🎙️ ಲೈವ್ • ಧ್ವನಿ ಪ್ರಶ್ನೆ",
      badge: "ಹಂತ 3: ಆನ್-ಡಿಮಾಂಡ್ ಧ್ವನಿ",
      native:
        "ಶರ್ಮಾ ಅವರೇ, ಇಂದು ಸಂಜೆ 5:00 ಗಂಟೆಯವರೆಗೆ 42 ಬಿಲ್‌ಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ, ಒಟ್ಟು ಸಂಗ್ರಹ ₹5,830. ಸಂಜೆಯ ಗರಿಷ್ಠ ವ್ಯಾಪಾರ ಈಗ ಆರಂಭವಾಗುತ್ತಿದೆ.",
      phonetic:
        "Sharma avare, indu sanje aidu gantege nalavattheradu billugalu poornagondive, ottu sangraha aidu saavirada entanoora moovatthu roopayi.",
    },
  },
};

const PRESET_QUERIES_BY_LANG: Record<string, PresetQueryItem[]> = {
  Hinglish: [
    {
      q: "Today's collection kitna hua?",
      ans: "Sharma-ji, aaj shaam 5:00 PM tak aapki dukaan par 42 bills complete ho chuke hain, total collection ₹5,830 raha. Shaam ki bheed shuru hone wali hai!",
      phonetic: "Sharma-ji, aaj shaam paanch baje tak aapki dukaan par byalees bills complete ho chuke hain, total collection paanch hazaar aath sau tees rupaye raha.",
    },
    {
      q: "Mera peak rush time kab hai?",
      ans: "Sharma-ji, aapki dukaan par sabse zyada bheed shaam 7:00 PM se 8:00 PM ke beech rehti hai. Kal iss window mein 34 bills complete hue the.",
      phonetic: "Sharma-ji, aapki dukaan par sabse zyada bheed shaam saat baje se aath baje ke beech rehti hai.",
    },
    {
      q: "Kitne regular customers inactive hain?",
      ans: "Sharma-ji, kul 42 regular grahak pichle 21 dino se nahi aaye hain. WhatsApp offer bhej kar unme se lagbhag 65% wapas bulaye ja sakte hain.",
      phonetic: "Sharma-ji, kul byalees regular grahak pichle ikkees dino se nahi aaye hain. WhatsApp offer bhej kar lagbhag painsath percent wapas aa sakte hain.",
    },
  ],
  Hindi: [
    {
      q: "आज कुल कितना कलेक्शन हुआ?",
      ans: "शर्मा जी, आज शाम 5:00 बजे तक आपकी दुकान पर कुल 42 बिल पूरे हुए हैं और कलेक्शन ₹5,830 रहा है। शाम की मुख्य भीड़ अब शुरू हो रही है।",
      phonetic: "Sharma ji, aaj shaam paanch baje tak aapki dukaan par kul byalees bill poore hue hain aur collection paanch hazaar aath sau tees rupaye raha hai.",
    },
    {
      q: "दुकान का सबसे व्यस्त समय कौन सा है?",
      ans: "शर्मा जी, आपकी दुकान पर सबसे ज्यादा भीड़ शाम 7:00 बजे से 8:00 बजे के बीच रहती है, जिसमें औसतन 34 बिल बनते हैं।",
      phonetic: "Sharma ji, aapki dukaan par sabse zyada bheed shaam saat baje se aath baje ke beech rehti hai.",
    },
    {
      q: "कितने नियमित ग्राहक नहीं आए हैं?",
      ans: "शर्मा जी, कुल 42 नियमित ग्राहक पिछले 21 दिनों से दुकान पर नहीं आए हैं। व्हाट्सएप कूपन भेजने से वे वापस आ सकते हैं।",
      phonetic: "Sharma ji, kul byalees regular grahak pichle ikkees dino se dukaan par nahi aaye hain.",
    },
  ],
  Telugu: [
    {
      q: "ఈ రోజు మొత్తం ఎంత కలెక్షన్ అయింది?",
      ans: "శర్మ గారూ, ఈ రోజు సాయంత్రం 5:00 గంటల వరకు 42 బిల్లులు పూర్తయ్యాయి, మొత్తం కలెక్షన్ ₹5,830. సాయంత్రం రద్దీ ప్రారంభం కానుంది.",
      phonetic: "Sharma gaaru, ee roju saayantram aidu gantala varaku nalabhai rendu billulu poorthayyaayi, motham collection aidu vela aenimidi vandhala mupphai rupayalu.",
    },
    {
      q: "రద్దీ ఎక్కువగా ఉండే సమయం ఏది?",
      ans: "శర్మ గారూ, మీ దుకాణంలో సాయంత్రం 7:00 నుండి 8:00 గంటల వరకు అత్యధిక రద్దీ ఉంటుంది. ఆ సమయంలో 34 బిల్లులు నమోదయ్యాయి.",
      phonetic: "Sharma gaaru, mee dukaanamlo saayantram yedu nundi enimidi gantala varaku athyadhika raddi untundi.",
    },
    {
      q: "ఎంతమంది రెగ్యులర్ కస్టమర్లు రాలేదు?",
      ans: "శర్మ గారూ, గత 21 రోజులుగా 42 మంది రెగ్యులర్ కస్టమర్లు రాలేదు. వారికి వాట్సాప్ ఆఫర్ పంపితే తిరిగి వచ్చే అవకాశం ఉంది.",
      phonetic: "Sharma gaaru, gatha iravai okati rojuluga nalabhai rendu mandi regular customers raaledhu.",
    },
  ],
  English: [
    {
      q: "How much is today's collection so far?",
      ans: "Sharma-ji, as of 5:00 PM today, 42 bills have been completed with a total collection of ₹5,830. Evening peak rush is starting now.",
      phonetic: "Sharma-ji, as of five PM today, forty-two bills have been completed with a total collection of five thousand eight hundred thirty rupees.",
    },
    {
      q: "What are my top rush hours?",
      ans: "Sharma-ji, your highest traffic window is 7:00 PM to 8:00 PM in the evening, with an average of 34 verified Soundbox UPI bills.",
      phonetic: "Sharma-ji, your highest traffic window is seven PM to eight PM in the evening, with an average of thirty-four verified Soundbox bills.",
    },
    {
      q: "How many regular customers are at-risk?",
      ans: "Sharma-ji, 42 regular customers have not visited in the last 21+ days. Sending a 10% WhatsApp coupon can win back up to 65% of them.",
      phonetic: "Sharma-ji, forty-two regular customers have not visited in the last twenty-one days.",
    },
  ],
  Tamil: [
    {
      q: "இன்று மொத்த வசூல் எவ்வளவு?",
      ans: "சர்மா அவர்களே, இன்று மாலை 5:00 மணி வரை 42 பில்கள் முடிந்துள்ளன, மொத்த வசூல் ₹5,830. மாலை நேர கூட்டம் இப்போது தொடங்குகிறது.",
      phonetic: "Sharma avargale, indru maalai aindhu mani varai naarpadhu irandu bills mudinthullana, motha vasool aindhaayirathu ennooru mupphadhu roobai.",
    },
    {
      q: "கடையின் பீக் ஹவர்ஸ் எது?",
      ans: "சர்மா அவர்களே, உங்கள் கடையில் மாலை 7:00 மணி முதல் 8:00 மணி வரை அதிக கூட்டம் இருக்கும்.",
      phonetic: "Sharma avargale, ungal kadaiyil maalai yezhu mani mudhal ettu mani varai adhigam koottam irukkum.",
    },
    {
      q: "எத்தனை வாடிக்கையாளர்கள் வரவில்லை?",
      ans: "சர்மா அவர்களே, கடந்த 21 நாட்களாக 42 வழக்கமான வாடிக்கையாளர்கள் கடைக்கு வரவில்லை.",
      phonetic: "Sharma avargale, kadandha irubathi oru naatkalaga naarpadhu irandu vaadikkaiyaalargal varavillai.",
    },
  ],
  Kannada: [
    {
      q: "ಇಂದು ಒಟ್ಟು ಎಷ್ಟು ಕಲೆಕ್ಷನ್ ಆಗಿದೆ?",
      ans: "ಶರ್ಮಾ ಅವರೇ, ಇಂದು ಸಂಜೆ 5:00 ಗಂಟೆಯವರೆಗೆ 42 ಬಿಲ್‌ಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ, ಒಟ್ಟು ಸಂಗ್ರಹ ₹5,830. ಸಂಜೆಯ ಗರಿಷ್ಠ ವ್ಯಾಪಾರ ಈಗ ಆರಂಭವಾಗುತ್ತಿದೆ.",
      phonetic: "Sharma avare, indu sanje aidu gantege nalavattheradu billugalu poornagondive, ottu sangraha aidu saavirada entanoora moovatthu roopayi.",
    },
    {
      q: "ಗರಿಷ್ಠ ವ್ಯಾಪಾರದ ಸಮಯ ಯಾವುದು?",
      ans: "ಶರ್ಮಾ ಅವರೇ, ನಿಮ್ಮ ಅಂಗಡಿಯಲ್ಲಿ ಸಂಜೆ 7:00 ರಿಂದ 8:00 ಗಂಟೆಯವರೆಗೆ ಗರಿಷ್ಠ ವ್ಯಾಪಾರ ಇರುತ್ತದೆ.",
      phonetic: "Sharma avare, nimma angadiyalli sanje yelu ninda entu gantege garishtha vyaapaara irutthede.",
    },
    {
      q: "ಎಷ್ಟು ಗ್ರಾಹಕರು ಬಂದಿಲ್ಲ?",
      ans: "ಶರ್ಮಾ ಅವರೇ, ಕಳೆದ 21 ದಿನಗಳಿಂದ 42 ನಿಯಮಿತ ಗ್ರಾಹಕರು ಅಂಗಡಿಗೆ ಬಂದಿಲ್ಲ.",
      phonetic: "Sharma avare, kaledha iravatthiondu dinagalinda nalavattheradu regular grahakaru bandilla.",
    },
  ],
};

const SPEECH_LANG_CODE: Record<string, string> = {
  Hindi: "hi-IN",
  Telugu: "te-IN",
  Tamil: "ta-IN",
  Kannada: "kn-IN",
  English: "en-IN",
  Hinglish: "en-IN", // Indian English accurately recognizes Indian accents and mixed Hinglish terms!
};

export function resolveQueryAnswer(queryText: string, lang: string): { ans: string; phonetic: string } {
  const q = (queryText || "").toLowerCase().trim();

  // 1. Collection / Sales / Revenue / Aaj / Today / Dhandha / Kamai
  if (
    q.includes("collection") || q.includes("sale") || q.includes("revenue") || q.includes("kamaai") ||
    q.includes("dhandha") || q.includes("aaj") || q.includes("today") || q.includes("kitna") ||
    q.includes("కలెక్షన్") || q.includes("అమ్మక") || q.includes("ఈ రోజు") || q.includes("ఎంత") ||
    q.includes("कलेक्शन") || q.includes("कमाई") || q.includes("बिक्री") || q.includes("कितना") ||
    q.includes("வசூல்") || q.includes("விற்பனை") || q.includes("இன்று") ||
    q.includes("ಸಂಗ್ರಹ") || q.includes("ಮಾರಾಟ") || q.includes("ಇಂದು")
  ) {
    if (lang === "Telugu") {
      return {
        ans: "శర్మ గారూ, ఈ రోజు సాయంత్రం 5:00 గంటల వరకు 42 బిల్లులు పూర్తయ్యాయి, మొత్తం కలెక్షన్ ₹5,830. సాయంత్రం రద్దీ ప్రారంభం కానుంది.",
        phonetic: "Sharma gaaru, ee roju saayantram aidu gantala varaku nalabhai rendu billulu poorthayyaayi, motham collection aidu vela aenimidi vandhala mupphai rupayalu.",
      };
    } else if (lang === "Hindi") {
      return {
        ans: "शर्मा जी, आज शाम 5:00 बजे तक दुकान पर कुल 42 बिल पूरे हुए हैं और कुल कलेक्शन ₹5,830 रहा है। शाम की मुख्य भीड़ अब शुरू हो रही है।",
        phonetic: "Sharma ji, aaj shaam paanch baje tak dukaan par kul byalees bill poore hue hain aur kul collection paanch hazaar aath sau tees rupaye raha hai.",
      };
    } else if (lang === "English") {
      return {
        ans: "Sharma-ji, as of 5:00 PM today, 42 bills have been completed with a total collection of ₹5,830. Evening peak rush is starting now.",
        phonetic: "Sharma-ji, as of five PM today, forty-two bills have been completed with a total collection of five thousand eight hundred thirty rupees.",
      };
    } else if (lang === "Tamil") {
      return {
        ans: "சர்மா அவர்களே, இன்று மாலை 5:00 மணி வரை 42 பில்கள் முடிந்துள்ளன, மொத்த வசூல் ₹5,830. மாலை நேர கூட்டம் இப்போது தொடங்குகிறது.",
        phonetic: "Sharma avargale, indru maalai aindhu mani varai naarpadhu irandu bills mudinthullana, motha vasool aindhaayirathu ennooru mupphadhu roobai.",
      };
    } else if (lang === "Kannada") {
      return {
        ans: "ಶರ್ಮಾ ಅವರೇ, ಇಂದು ಸಂಜೆ 5:00 ಗಂಟೆಯವರೆಗೆ 42 ಬಿಲ್‌ಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ, ಒಟ್ಟು ಸಂಗ್ರಹ ₹5,830. ಸಂಜೆಯ ಗರಿಷ್ಠ ವ್ಯಾಪಾರ ಈಗ ಆರಂಭವಾಗುತ್ತಿದೆ.",
        phonetic: "Sharma avare, indu sanje aidu gantege nalavattheradu billugalu poornagondive, ottu sangraha aidu saavirada entanoora moovatthu roopayi.",
      };
    } else {
      return {
        ans: "Sharma-ji, aaj shaam 5:00 PM tak aapki dukaan par 42 bills complete ho chuke hain, total collection ₹5,830 raha. Shaam ki bheed shuru hone wali hai!",
        phonetic: "Sharma-ji, aaj shaam paanch baje tak aapki dukaan par byalees bills complete ho chuke hain, total collection paanch hazaar aath sau tees rupaye raha.",
      };
    }
  }

  // 2. Peak Hours / Rush / Bheed / Time / Ghanta / Busiest
  if (
    q.includes("peak") || q.includes("rush") || q.includes("bheed") || q.includes("time") ||
    q.includes("ghante") || q.includes("busiest") || q.includes("రద్దీ") || q.includes("సమయ") ||
    q.includes("పీక్") || q.includes("भीड़") || q.includes("व्यस्त") || q.includes("घंटे") ||
    q.includes("கூட்டம்") || q.includes("நேரம்") || q.includes("ರಶ್") || q.includes("ಸಮಯ")
  ) {
    if (lang === "Telugu") {
      return {
        ans: "శర్మ గారూ, మీ దుకాణంలో సాయంత్రం 7:00 నుండి 8:00 గంటల వరకు అత్యధిక రద్దీ ఉంటుంది. నిన్న ఆ సమయంలో 34 బిల్లులు నమోదయ్యాయి.",
        phonetic: "Sharma gaaru, mee dukaanamlo saayantram yedu nundi enimidi gantala varaku athyadhika raddi untundi.",
      };
    } else if (lang === "Hindi") {
      return {
        ans: "शर्मा जी, आपकी दुकान पर सबसे ज्यादा भीड़ शाम 7:00 बजे से 8:00 बजे के बीच रहती है, जिसमें कल 34 बिल बने थे।",
        phonetic: "Sharma ji, aapki dukaan par sabse zyada bheed shaam saat baje se aath baje ke beech rehti hai.",
      };
    } else if (lang === "English") {
      return {
        ans: "Sharma-ji, your highest traffic window is 7:00 PM to 8:00 PM in the evening, with an average of 34 verified Soundbox UPI bills.",
        phonetic: "Sharma-ji, your highest traffic window is seven PM to eight PM in the evening, with an average of thirty-four verified Soundbox bills.",
      };
    } else if (lang === "Tamil") {
      return {
        ans: "சர்மா அவர்களே, உங்கள் கடையில் மாலை 7:00 மணி முதல் 8:00 மணி வரை அதிக கூட்டம் இருக்கும். நேற்று அந்த நேரத்தில் 34 பில்கள் பதிவாகின.",
        phonetic: "Sharma avargale, ungal kadaiyil maalai yezhu mani mudhal ettu mani varai adhigam koottam irukkum.",
      };
    } else if (lang === "Kannada") {
      return {
        ans: "ಶರ್ಮಾ ಅವರೇ, ನಿಮ್ಮ ಅಂಗಡಿಯಲ್ಲಿ ಸಂಜೆ 7:00 ರಿಂದ 8:00 ಗಂಟೆಯವರೆಗೆ ಗರಿಷ್ಠ ವ್ಯಾಪಾರ ಇರುತ್ತದೆ. ನಿನ್ನೆ ಆ ಸಮಯದಲ್ಲಿ 34 ಬಿಲ್‌ಗಳು ದಾಖಲಾಗಿವೆ.",
        phonetic: "Sharma avare, nimma angadiyalli sanje yelu ninda entu gantege garishtha vyaapaara irutthede.",
      };
    } else {
      return {
        ans: "Sharma-ji, aapki dukaan par sabse zyada bheed shaam 7:00 PM se 8:00 PM ke beech rehti hai. Kal iss window mein 34 bills complete hue the.",
        phonetic: "Sharma-ji, aapki dukaan par sabse zyada bheed shaam saat baje se aath baje ke beech rehti hai.",
      };
    }
  }

  // 3. Customers / Grahak / Inactive / Risk / At Risk / Regulars / Offer / Coupon
  if (
    q.includes("customer") || q.includes("grahak") || q.includes("inactive") || q.includes("risk") ||
    q.includes("regular") || q.includes("offer") || q.includes("coupon") || q.includes("discount") ||
    q.includes("కస్టమర్") || q.includes("రాలే") || q.includes("ఆఫర్") || q.includes("కూపన్") ||
    q.includes("ग्राहक") || q.includes("पुराने") || q.includes("ऑफर") || q.includes("कूपन") ||
    q.includes("வாடிக்கையாளர்") || q.includes("சலுகை") || q.includes("குப்பள்") ||
    q.includes("ಗ್ರಾಹಕ") || q.includes("ಆಫರ್") || q.includes("ಕೂಪನ್")
  ) {
    if (lang === "Telugu") {
      return {
        ans: "శర్మ గారూ, గత 21 రోజులుగా 42 మంది రెగ్యులర్ కస్టమర్లు రాలేదు. వారికి ₹30 వాట్సాప్ కూపన్ పంపితే 65% మంది తిరిగి వచ్చే అవకాశం ఉంది.",
        phonetic: "Sharma gaaru, gatha iravai okati rojuluga nalabhai rendu mandi regular customers raaledhu.",
      };
    } else if (lang === "Hindi") {
      return {
        ans: "शर्मा जी, कुल 42 नियमित ग्राहक पिछले 21 दिनों से दुकान पर नहीं आए हैं। उन्हें ₹30 का व्हाट्सएप कूपन भेजने से वे वापस आ सकते हैं।",
        phonetic: "Sharma ji, kul byalees regular grahak pichle ikkees dino se dukaan par nahi aaye hain.",
      };
    } else if (lang === "English") {
      return {
        ans: "Sharma-ji, 42 regular customers have not visited in the last 21+ days. Sending a 10% WhatsApp coupon can win back up to 65% of them.",
        phonetic: "Sharma-ji, forty-two regular customers have not visited in the last twenty-one days.",
      };
    } else if (lang === "Tamil") {
      return {
        ans: "சர்மா அவர்களே, கடந்த 21 நாட்களாக 42 வழக்கமான வாடிக்கையாளர்கள் கடைக்கு வரவில்லை. அவர்களுக்கு ₹30 வாட்ஸ்அப் கூப்பன் அனுப்பினால் 65% பேர் திரும்பி வர வாய்ப்புள்ளது.",
        phonetic: "Sharma avargale, kadandha irubathi oru naatkalaga naarpadhu irandu vaadikkaiyaalargal varavillai.",
      };
    } else if (lang === "Kannada") {
      return {
        ans: "ಶರ್ಮಾ ಅವರೇ, ಕಳೆದ 21 ದಿನಗಳಿಂದ 42 ನಿಯಮಿತ ಗ್ರಾಹಕರು ಅಂಗಡಿಗೆ ಬಂದಿಲ್ಲ. ಅವರಿಗೆ ₹30 ವಾಟ್ಸಾಪ್ ಕೂಪನ್ ಕಳುಹಿಸಿದರೆ 65% ಜನರು ಹಿಂತಿರುಗಬಹುದು.",
        phonetic: "Sharma avare, kaledha iravatthiondu dinagalinda nalavattheradu regular grahakaru bandilla.",
      };
    } else {
      return {
        ans: "Sharma-ji, kul 42 regular grahak pichle 21 dino se nahi aaye hain. Unhe WhatsApp offer bhej kar lagbhag 65% grahakon ko wapas bulaya ja sakta hai.",
        phonetic: "Sharma-ji, kul byalees regular grahak pichle ikkees dino se nahi aaye hain.",
      };
    }
  }

  // General Grounded Fallback Response
  if (lang === "Telugu") {
    return {
      ans: `శర్మ గారూ, మీ ప్రశ్న "${queryText}" కు సమాధానం: ఈ రోజు దుకాణంలో 42 బిల్లులు పూర్తయ్యాయి, కలెక్షన్ ₹5,830. సాయంత్రం రద్దీ కోసం సిద్ధంగా ఉండండి.`,
      phonetic: `Sharma gaaru, mee prashnaku samadhanam: ee roju dukaanamlo nalabhai rendu billulu poorthayyaayi, collection aidu vela aenimidi vandhala mupphai rupayalu.`,
    };
  } else if (lang === "Hindi") {
    return {
      ans: `शर्मा जी, आपके सवाल "${queryText}" के अनुसार: आज शाम 5 बजे तक 42 बिल पूरे हुए हैं और ₹5,830 का कलेक्शन हुआ है। शाम की भीड़ शुरू हो रही है।`,
      phonetic: `Sharma ji, aapke sawaal ke anusaar: aaj shaam paanch baje tak byalees bill poore hue hain aur paanch hazaar aath sau tees rupaye ka collection hua hai.`,
    };
  } else if (lang === "English") {
    return {
      ans: `Sharma-ji, for your query "${queryText}": Today by 5:00 PM, 42 bills have completed with ₹5,830 collection. Evening peak window starts soon.`,
      phonetic: `Sharma-ji, for your query: Today by five PM, forty-two bills have completed with five thousand eight hundred thirty rupees collection.`,
    };
  } else if (lang === "Tamil") {
    return {
      ans: `சர்மா அவர்களே, உங்கள் கேள்வி "${queryText}"-க்கு பதில்: இன்று 42 பில்கள் முடிந்துள்ளன, வசூல் ₹5,830.`,
      phonetic: `Sharma avargale, indru naarpadhu irandu bills mudinthullana, vasool aindhaayirathu ennooru mupphadhu roobai.`,
    };
  } else if (lang === "Kannada") {
    return {
      ans: `ಶರ್ಮಾ ಅವರೇ, ನಿಮ್ಮ ಪ್ರಶ್ನೆ "${queryText}"-ಗೆ ಉತ್ತರ: ಇಂದು 42 ಬಿಲ್‌ಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ, ಸಂಗ್ರಹ ₹5,830.`,
      phonetic: `Sharma avare, indu nalavattheradu billugalu poornagondive, sangraha aidu saavirada entanoora moovatthu roopayi.`,
    };
  } else {
    return {
      ans: `Sharma-ji, aapke sawaal "${queryText}" ke mutabik: Aaj shaam 5:00 PM tak 42 bills complete hue hain, total collection ₹5,830 raha. Shaam ki bheed shuru hone wali hai!`,
      phonetic: `Sharma-ji, aapke sawaal ke mutabik: Aaj shaam paanch baje tak byalees bills complete hue hain, total collection paanch hazaar aath sau tees rupaye raha.`,
    };
  }
}

export const SoundboxTab: React.FC<SoundboxTabProps> = ({
  briefing,
  isLoading,
  language = "Hinglish",
}) => {
  const t = getTranslation(language);
  const [activeMode, setActiveMode] = useState<SoundboxTimelineMode>("morning");
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasDispatchedRetention, setHasDispatchedRetention] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimSpokenText, setInterimSpokenText] = useState("");
  const [manualQueryText, setManualQueryText] = useState("");
  const [micStatusMsg, setMicStatusMsg] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // References to guarantee Web Speech API never loses words due to stale React closures
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  const hasProcessedQueryRef = useRef<boolean>(false);

  const langKey = TIMELINE_CONTENT[language] ? language : "Hinglish";
  const currentContent = TIMELINE_CONTENT[langKey][activeMode];
  const presetQueries = PRESET_QUERIES_BY_LANG[langKey] || PRESET_QUERIES_BY_LANG.Hinglish;

  // Mic recognition language (defaults to en-IN / Hinglish for robust multi-accent recognition, switchable with 1-click)
  const [micLang, setMicLang] = useState<string>("en-IN");

  // Dynamic Stage 3 Q&A state: tracks both what was asked AND what the soundbox answers!
  const [ondemandState, setOndemandState] = useState<{
    query: string;
    response: string;
    phonetic: string;
  }>({
    query: presetQueries[0].q,
    response: presetQueries[0].ans,
    phonetic: presetQueries[0].phonetic || presetQueries[0].ans,
  });

  // Stop playback when unmounting
  useEffect(() => {
    return () => {
      if (audioRef.current) audioRef.current.pause();
      stopSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  // Update defaults when changing mode or language
  useEffect(() => {
    if (audioRef.current) audioRef.current.pause();
    stopSpeech();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {}
    }
    setIsPlaying(false);
    setIsListening(false);
    setInterimSpokenText("");
    setMicStatusMsg(null);
    setHasDispatchedRetention(false);

    // Synchronize Stage 3 default with the active language
    const currentPresets = PRESET_QUERIES_BY_LANG[langKey] || PRESET_QUERIES_BY_LANG.Hinglish;
    setOndemandState({
      query: currentPresets[0].q,
      response: currentPresets[0].ans,
      phonetic: currentPresets[0].phonetic || currentPresets[0].ans,
    });

    // Set micLang default: en-IN for Hinglish/English, otherwise regional code
    if (language === "Telugu") {
      setMicLang("te-IN");
    } else if (language === "Hindi") {
      setMicLang("hi-IN");
    } else if (language === "Tamil") {
      setMicLang("ta-IN");
    } else if (language === "Kannada") {
      setMicLang("kn-IN");
    } else {
      setMicLang("en-IN");
    }
  }, [activeMode, language, langKey]);

  // Clean, unconditional voice synthesis player that never gets blocked by stale isPlaying state
  const playAudio = (text: string, phonetic: string, langToSpeak: string) => {
    if (audioRef.current) audioRef.current.pause();
    stopSpeech();
    setIsPlaying(true);
    speakText(
      text,
      phonetic,
      langToSpeak,
      () => setIsPlaying(false),
      () => setIsPlaying(false)
    );
  };

  const handleTogglePlay = (customNative?: string, customPhonetic?: string) => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    const textToSpeak = customNative || (activeMode === "ondemand" ? ondemandState.response : currentContent.native);
    const phoneticToSpeak = customPhonetic || (activeMode === "ondemand" ? ondemandState.phonetic : currentContent.phonetic);

    playAudio(textToSpeak, phoneticToSpeak, language);
  };

  const handleApproveRetention = () => {
    setHasDispatchedRetention(true);
    if (currentContent.followupPrompt) {
      playAudio(
        currentContent.followupPrompt.confirmAudioNative,
        currentContent.followupPrompt.confirmAudioPhonetic,
        language
      );
    }
  };

  // Universal query execution: updates both Merchant Question & Soundbox Answer, then speaks aloud!
  const handleExecuteQuery = (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query) return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    setInterimSpokenText("");
    setMicStatusMsg(null);

    const resolved = resolveQueryAnswer(query, language);

    setOndemandState({
      query: query,
      response: resolved.ans,
      phonetic: resolved.phonetic,
    });

    playAudio(resolved.ans, resolved.phonetic, language);
  };

  // Handle Preset Quick-Tap Query: Updates BOTH Question text AND Answer text, then speaks!
  const handleSelectPresetQuery = (item: PresetQueryItem) => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
    setInterimSpokenText("");
    setMicStatusMsg(null);

    setOndemandState({
      query: item.q,
      response: item.ans,
      phonetic: item.phonetic || item.ans,
    });

    playAudio(item.ans, item.phonetic || item.ans, language);
  };

  // Web Speech API: Bulletproof Microphone Speech Recognition from the merchant!
  const handleToggleMic = () => {
    if (typeof window === "undefined") return;

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Microphone recognition is supported in Google Chrome & Microsoft Edge. You can also tap any sample query below!");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      const captured = transcriptRef.current.trim();
      if (!hasProcessedQueryRef.current && captured.length > 1) {
        hasProcessedQueryRef.current = true;
        setInterimSpokenText("");
        handleExecuteQuery(captured);
      }
      return;
    }

    // Reset refs and start listening
    stopSpeech();
    setIsPlaying(false);
    setInterimSpokenText("");
    setMicStatusMsg(null);
    transcriptRef.current = "";
    hasProcessedQueryRef.current = false;

    try {
      const recognition = new SpeechRec();
      recognitionRef.current = recognition;
      recognition.lang = micLang || "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setMicStatusMsg("🎙️ Listening to your voice... Speak your question now!");
      };

      recognition.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += text;
          } else {
            interim += text;
          }
        }

        const currentWords = (final || interim || "").trim();
        if (currentWords) {
          transcriptRef.current = currentWords;
          setInterimSpokenText(currentWords);
        }

        if (final && final.trim().length > 1) {
          hasProcessedQueryRef.current = true;
          setIsListening(false);
          setInterimSpokenText("");
          try {
            recognition.stop();
          } catch (e) {}
          handleExecuteQuery(final.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event?.error);
        const captured = transcriptRef.current.trim();
        if (!hasProcessedQueryRef.current && captured.length > 1) {
          hasProcessedQueryRef.current = true;
          setIsListening(false);
          setInterimSpokenText("");
          handleExecuteQuery(captured);
          return;
        }

        setIsListening(false);
        if (event?.error === "no-speech") {
          setMicStatusMsg("No voice detected. Please speak closer to your mic or tap any sample query below.");
        } else if (event?.error === "not-allowed") {
          setMicStatusMsg("Microphone permission denied. Please allow microphone access in your browser or tap any sample query below.");
        } else {
          setMicStatusMsg("Microphone paused. You can also type your question or tap any sample query below.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        const captured = transcriptRef.current.trim();
        if (!hasProcessedQueryRef.current && captured.length > 1) {
          hasProcessedQueryRef.current = true;
          setInterimSpokenText("");
          handleExecuteQuery(captured);
        }
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setMicStatusMsg("Could not start microphone. You can type your question or tap any sample query below.");
      console.error("Speech recognition start error:", e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-[#002E6E] border border-cyan-200">
            {t.soundbox.headerBadge}
          </span>
          <span className="text-xs text-slate-500">• {t.soundbox.headerSub}</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1120]">
          {t.soundbox.headerTitle}
        </h2>
        <p className="text-xs text-slate-500">
          {t.soundbox.headerDesc}
        </p>
      </div>

      {/* 3 Real-Life Timeline Mode Switcher */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Mode 1: Morning Briefing */}
        <button
          onClick={() => setActiveMode("morning")}
          className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all active:scale-98 cursor-pointer ${
            activeMode === "morning"
              ? "border-[#002E6E] bg-gradient-to-br from-blue-50/80 to-cyan-50/60 shadow-md ring-2 ring-[#00BAF2]/30"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#002E6E]">
              <Clock className="h-4 w-4 text-[#00BAF2]" />
              8:00 AM • Morning
            </span>
            {activeMode === "morning" && (
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <p className="mt-2 text-sm font-extrabold text-slate-900">
            {t.soundbox.stage1Tab}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 leading-tight">
            {t.soundbox.stage1Desc}
          </p>
        </button>

        {/* Mode 2: Afternoon Slump */}
        <button
          onClick={() => setActiveMode("afternoon")}
          className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all active:scale-98 cursor-pointer ${
            activeMode === "afternoon"
              ? "border-amber-600 bg-gradient-to-br from-amber-50/90 to-orange-50/60 shadow-md ring-2 ring-amber-400/40"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
              <Coffee className="h-4 w-4 text-amber-600" />
              1:30 PM • Slump Hours
            </span>
            {activeMode === "afternoon" && (
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </div>
          <p className="mt-2 text-sm font-extrabold text-slate-900">
            {t.soundbox.stage2Tab}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 leading-tight">
            {t.soundbox.stage2Desc}
          </p>
        </button>

        {/* Mode 3: Anytime On-Demand */}
        <button
          onClick={() => setActiveMode("ondemand")}
          className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all active:scale-98 cursor-pointer ${
            activeMode === "ondemand"
              ? "border-cyan-600 bg-gradient-to-br from-cyan-50/90 to-blue-50/60 shadow-md ring-2 ring-cyan-400/40"
              : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-900">
              <Mic className="h-4 w-4 text-[#00BAF2]" />
              Live • Anytime
            </span>
            {activeMode === "ondemand" && (
              <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
            )}
          </div>
          <p className="mt-2 text-sm font-extrabold text-slate-900">
            {t.soundbox.stage3Tab}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 leading-tight">
            {t.soundbox.stage3Desc}
          </p>
        </button>
      </div>

      {/* The Digital Soundbox Device Simulator Card */}
      <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-b from-slate-900 via-[#002E6E] to-slate-950 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Top Mode Header Banner */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#00BAF2]/20 text-[#00BAF2] border border-[#00BAF2]/40 px-3 py-1 text-xs font-bold">
              {currentContent.badge}
            </span>
            <span className="text-xs font-semibold text-slate-300">
              {currentContent.timeTag}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-300 font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/10">
            <Languages className="h-3.5 w-3.5 text-[#00BAF2]" />
            <span>Voice: {language}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left: Device Speaker Visual */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl bg-slate-800/90 border-2 border-[#00BAF2]/40 shadow-inner">
              {/* Speaker Grille Circle */}
              <div className="h-24 w-24 rounded-full border border-slate-700 bg-slate-950/80 flex items-center justify-center">
                <Radio className={`h-10 w-10 text-[#00BAF2] ${isPlaying ? "animate-pulse" : ""}`} />
              </div>

              {/* Paytm Logo Badge */}
              <div className="absolute -top-3 bg-[#00BAF2] text-[#0A1120] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow">
                PAYTM SOUNDBOX 4G
              </div>

              {/* Status LED */}
              <div className="absolute bottom-2 flex items-center space-x-1.5">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isListening
                      ? "bg-red-500 animate-ping"
                      : isPlaying
                      ? "bg-emerald-400 animate-ping"
                      : "bg-cyan-400"
                  }`}
                />
                <span className="text-[10px] text-slate-400 font-mono">
                  {isListening ? "LISTENING MIC" : isPlaying ? "SPEAKING ALOUD" : "STANDBY READY"}
                </span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="mt-4 flex items-center space-x-3">
              <button
                onClick={() => {
                  stopSpeech();
                  setIsPlaying(false);
                  setTimeout(() => handleTogglePlay(), 100);
                }}
                className="rounded-full bg-slate-800 p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition shadow-sm active:scale-95 cursor-pointer"
                title="Replay Audio"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={() => handleTogglePlay()}
                className={`flex items-center space-x-2 rounded-full px-6 py-2.5 text-xs font-bold transition shadow-lg active:scale-95 cursor-pointer ${
                  isPlaying
                    ? "bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-400/50"
                    : "bg-gradient-to-r from-cyan-400 via-[#00BAF2] to-blue-500 text-slate-950 hover:brightness-110 ring-2 ring-[#00BAF2]/50 font-black"
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 fill-current" />
                    <span>Pause Audio</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-current" />
                    <span>
                      {activeMode === "morning" && "Play 30s Morning Briefing"}
                      {activeMode === "afternoon" && "Hear Retention Voice Prompt"}
                      {activeMode === "ondemand" && "Hear Spoken Answer"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Spoken Transcript & Interactive Dialogue Container */}
          <div className="flex-1 w-full rounded-2xl bg-slate-950/70 border border-slate-700/60 p-5 md:p-6 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-[#00BAF2]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Soundbox Spoken Audio Dialogue
                  </span>
                </div>
                <span className="text-[11px] font-mono text-cyan-300 font-semibold">
                  Zero Hallucination
                </span>
              </div>

              {/* Mode 1 & Mode 2 Display */}
              {activeMode !== "ondemand" && (
                <div className="mt-4 rounded-xl bg-slate-900/80 border border-slate-800 p-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                    Soundbox Speaks Aloud:
                  </span>
                  <p className="text-sm leading-relaxed text-slate-100 font-semibold whitespace-pre-line">
                    &ldquo;{currentContent.native}&rdquo;
                  </p>
                </div>
              )}

              {/* Mode 3 Display: Shows BOTH Merchant's Spoken Query AND Soundbox Spoken Answer */}
              {activeMode === "ondemand" && (
                <div className="mt-4 space-y-3.5">
                  {/* Step 1: Merchant Query Bubble */}
                  <div className="rounded-2xl bg-gradient-to-r from-blue-950/70 to-slate-900/80 border border-blue-500/40 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase font-black tracking-wider text-[#00BAF2] flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-[#00BAF2]" />
                        Step 1: Merchant Spoke (Voice Input)
                      </span>
                      {isListening && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-950/80 px-2 py-0.5 rounded-full border border-red-500/30 animate-pulse">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />
                          Live Mic Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm md:text-base font-bold text-white leading-snug">
                      {isListening ? (
                        <span className="text-amber-300 flex items-center gap-2 animate-pulse">
                          <Mic className="h-4 w-4 text-red-400" />
                          {interimSpokenText || "Listening to your voice... Speak your question into mic now!"}
                        </span>
                      ) : (
                        `“${ondemandState.query}”`
                      )}
                    </p>
                  </div>

                  {/* Step 2: Soundbox Spoken Answer Bubble */}
                  <div className="rounded-2xl bg-gradient-to-r from-slate-900/90 to-emerald-950/40 border border-emerald-500/40 p-4 shadow-md">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase font-black tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <Radio className="h-3.5 w-3.5 text-emerald-400" />
                        Step 2: Paytm Soundbox Spoke Aloud (Zero Screen Needed)
                      </span>
                      {isPlaying && (
                        <div className="flex items-center gap-1 bg-emerald-950/90 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-300">
                          <span>Speaking Aloud</span>
                          <div className="flex items-center gap-0.5 ml-1">
                            <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
                            <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
                            <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm md:text-base leading-relaxed text-slate-100 font-semibold">
                      &ldquo;{ondemandState.response}&rdquo;
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-cyan-300 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                        Real-time Ledger Grounded
                      </span>
                      <button
                        onClick={() => playAudio(ondemandState.response, ondemandState.phonetic, language)}
                        className="flex items-center gap-1 text-cyan-400 hover:text-white font-bold cursor-pointer transition"
                      >
                        <RotateCcw className="h-3 w-3" /> Replay Voice
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Interactive Sub-Action for Mode 2: Afternoon Slump Retention */}
              {activeMode === "afternoon" && (
                <div className="mt-4 rounded-xl bg-amber-950/40 border border-amber-500/30 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
                        Merchant 1-Word Audio Action:
                      </span>
                      <p className="text-xs text-amber-100 mt-0.5">
                        Say &ldquo;Yes, send it&rdquo; or click to dispatch ₹30 WhatsApp coupon
                      </p>
                    </div>

                    <button
                      onClick={handleApproveRetention}
                      disabled={hasDispatchedRetention}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition active:scale-95 shadow-md cursor-pointer ${
                        hasDispatchedRetention
                          ? "bg-emerald-500 text-slate-950 cursor-default"
                          : "bg-emerald-400 hover:bg-emerald-300 text-slate-950"
                      }`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {hasDispatchedRetention ? "Dispatched to 42 Customers!" : currentContent.followupPrompt?.actionLabel || "Yes, Send It"}
                    </button>
                  </div>

                  {hasDispatchedRetention && (
                    <div className="mt-3 text-xs bg-emerald-950/80 border border-emerald-500/40 p-2.5 rounded-lg text-emerald-200">
                      ✅ <strong>WhatsApp Offer Broadcast:</strong> Dispatched to Rajesh-ji (98****3210) and 41 at-risk regular customers. Estimated 65% win-back rate!
                    </div>
                  )}
                </div>
              )}

              {/* Interactive Controls for Mode 3: Live Microphone + Manual Ask Bar + Preset Taps */}
              {activeMode === "ondemand" && (
                <div className="mt-4 space-y-3 pt-3 border-t border-slate-800">
                  {/* Mic status or error banner */}
                  {micStatusMsg && (
                    <div className="text-xs rounded-xl bg-amber-950/80 border border-amber-500/40 p-2.5 text-amber-200 flex items-center justify-between">
                      <span>{micStatusMsg}</span>
                      <button
                        onClick={() => setMicStatusMsg(null)}
                        className="text-amber-400 font-bold ml-2 cursor-pointer hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Mic Recognition Mode Switcher (Hinglish/English vs Regional) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Languages className="h-3.5 w-3.5 text-[#00BAF2]" />
                      Mic Recognition Engine:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setMicLang("en-IN")}
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                          micLang === "en-IN"
                            ? "bg-[#00BAF2] text-slate-950 font-black"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                        title="Indian English / Hinglish acoustic model (best for mixed terms & accents)"
                      >
                        Hinglish / English (en-IN)
                      </button>
                      {language !== "English" && language !== "Hinglish" && (
                        <button
                          onClick={() => setMicLang(SPEECH_LANG_CODE[language] || "hi-IN")}
                          className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                            micLang !== "en-IN"
                              ? "bg-[#00BAF2] text-slate-950 font-black"
                              : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                          }`}
                        >
                          {language} ({SPEECH_LANG_CODE[language] || "hi-IN"})
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Live Microphone Button for the Merchant */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleToggleMic}
                      className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl text-xs font-black transition-all shadow-lg active:scale-95 cursor-pointer ${
                        isListening
                          ? "bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white ring-4 ring-red-400/50 animate-pulse"
                          : "bg-gradient-to-r from-blue-600 via-[#002E6E] to-blue-700 hover:brightness-110 text-white border border-[#00BAF2]/40"
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-4 w-4" />
                          <span>Listening... Click to Stop &amp; Get Answer</span>
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 text-[#00BAF2]" />
                          <span>🎙️ Tap to Speak Question Aloud with Your Mic</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Manual Type & Ask Bar */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={manualQueryText}
                      onChange={(e) => setManualQueryText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && manualQueryText.trim()) {
                          handleExecuteQuery(manualQueryText);
                          setManualQueryText("");
                        }
                      }}
                      placeholder={
                        language === "Telugu"
                          ? "ప్రశ్న టైప్ చేయండి (ఉదా: ఈ రోజు కలెక్షన్ ఎంత?)"
                          : language === "Hindi"
                          ? "सवाल टाइप करें (उदा: आज का कलेक्शन कितना है?)"
                          : "Or type a question (e.g. What is today's collection?)"
                      }
                      className="flex-1 rounded-xl bg-slate-900/90 border border-slate-700/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00BAF2]"
                    />
                    <button
                      onClick={() => {
                        if (manualQueryText.trim()) {
                          handleExecuteQuery(manualQueryText);
                          setManualQueryText("");
                        }
                      }}
                      className="rounded-xl bg-[#00BAF2] px-4 py-2.5 text-xs font-black text-slate-950 hover:bg-[#3ecbf7] active:scale-95 cursor-pointer shrink-0"
                    >
                      Ask Soundbox
                    </button>
                  </div>

                  {/* Preset Tap-to-Speak Queries */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Or tap any sample query to ask &amp; hear answer aloud:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {presetQueries.map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectPresetQuery(item)}
                          className={`text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 active:scale-95 cursor-pointer border ${
                            ondemandState.query === item.q
                              ? "bg-[#00BAF2]/25 border-[#00BAF2] text-cyan-200 font-bold shadow-sm"
                              : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80 font-medium"
                          }`}
                        >
                          <Volume2 className="h-3 w-3 text-[#00BAF2]" />
                          &ldquo;{item.q}&rdquo;
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guardrail Badges */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Zero Audio Spam</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Deterministic Math</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>100% Screen-Free</span>
              </div>
            </div>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#00BAF2]/10 blur-3xl pointer-events-none" />
      </div>

      {/* 3 Real-Life Operational Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Morning Metric */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#00BAF2]" />
            {t.soundbox.morningMetricTitle}
          </p>
          <p className="mt-2 text-2xl font-black text-[#0A1120]">₹18,450</p>
          <p className="mt-1 text-xs text-emerald-600 font-bold flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" /> {t.soundbox.morningMetricGrowth}
          </p>
        </div>

        {/* Evening Rush Metric */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Radio className="h-3.5 w-3.5 text-[#00BAF2]" />
            {t.soundbox.peakMetricTitle}
          </p>
          <p className="mt-2 text-2xl font-black text-[#0A1120]">7:00 PM - 8:00 PM</p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            {t.soundbox.peakMetricDesc}
          </p>
        </div>

        {/* Afternoon Retention Alert */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-amber-600" />
            {t.soundbox.retentionMetricTitle}
          </p>
          <p className="mt-2 text-2xl font-black text-amber-950">
            {t.soundbox.retentionMetricCount}
          </p>
          <p className="mt-1 text-xs text-amber-800 font-medium">
            {t.soundbox.retentionMetricDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
