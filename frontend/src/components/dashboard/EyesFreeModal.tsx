"use client";

import React, { useState, useEffect } from "react";
import {
  Mic,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Radio,
  EyeOff,
  Share2,
  CheckCircle2,
  Languages,
  Play,
  RotateCcw,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  User,
} from "lucide-react";
import { speakText, stopSpeech } from "@/lib/speech";

interface EyesFreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

interface DialogueContent {
  merchantName: string;
  storeName: string;
  query: string;
  queryPhonetic: string;
  response: string;
  responsePhonetic: string;
  prompt: string;
  promptPhonetic: string;
  approval: string;
  approvalPhonetic: string;
  confirmed: string;
  confirmedPhonetic: string;
  waPreview: string;
}

const DIALOGUE_DATA: Record<string, DialogueContent> = {
  Telugu: {
    merchantName: "వెంకట్ గారు (58 ఏళ్ళు • కంటి చూపు లోపం)",
    storeName: "శ్రీ బాలాజీ ప్రొవిజన్స్, హైదరాబాద్",
    query: "ఈ రోజు మొత్తం ఎంత కలెక్షన్ అయింది?",
    queryPhonetic: "Ee roju motham entha collection ayindi?",
    response: "వెంకట్ గారు, ఈ రోజు మీ దుకాణంలో 85 లావాదేవీలు పూర్తయ్యాయి, మొత్తం కలెక్షన్ ₹9,420. సాయంత్రం రద్దీ ఎక్కువగా ఉంది.",
    responsePhonetic: "Venkat gaaru, ee roju mee dukaanamlo yabhyaydhu transactions poorthayyaayi, motham collection tommidhi vela naalugu vandhala iravai rupayalu.",
    prompt: "రాజేష్ గారు గత 22 రోజులుగా మీ దుకాణానికి రాలేదు. వారికి ₹30 డిస్కౌంట్ ఆఫర్ పంపమంటారా?",
    promptPhonetic: "Rajesh gaaru gatha iravai rendu rojuluga mee dukaananiki raaledhu. Vaariki mupphai rupayala discount offer pampamantaaraa?",
    approval: "అవును, పంపించు",
    approvalPhonetic: "Avunu, pampinchu",
    confirmed: "వాట్సాప్ ఆఫర్ రాజేష్ గారికి విజయవంతంగా పంపబడింది!",
    confirmedPhonetic: "WhatsApp offer Rajesh gaariki vijayavanthamga pampabadindi!",
    waPreview: "నమస్కారం రాజేష్ గారు! శ్రీ బాలాజీ ప్రొవిజన్స్ లో మీ తదుపరి కొనుగోలుపై ₹30 తగ్గింపు ఆఫర్! ఈ వారాంతంలో మాత్రమే వర్తిస్తుంది.",
  },
  Hindi: {
    merchantName: "वेंकट जी (58 वर्ष • कम दृष्टि वाले दुकानदार)",
    storeName: "श्री बालाजी प्रोविजन्स, हैदराबाद",
    query: "आज कुल कितना कलेक्शन हुआ?",
    queryPhonetic: "Aaj kul kitna collection hua?",
    response: "वेंकट जी, आज आपकी दुकान में 85 ट्रांजेक्शन हुए, कुल कलेक्शन ₹9,420 रहा। शाम को सबसे ज्यादा भीड़ रही।",
    responsePhonetic: "Venkat ji, aaj aapki dukaan mein pachasi transactions hue, kul collection nau hazaar chaar sau bees rupaye raha.",
    prompt: "राजेश जी (नियमित ग्राहक) पिछले 22 दिनों से नहीं आए हैं। क्या उन्हें ₹30 का डिस्काउंट ऑफर भेजें?",
    promptPhonetic: "Rajesh ji pichle baais dino se nahi aaye hain. Kya unhein tees rupaye ka discount offer bhejein?",
    approval: "हाँ, भेज दो",
    approvalPhonetic: "Haan, bhej do",
    confirmed: "व्हाट्सएप ऑफर राजेश जी को सफलतापूर्वक भेज दिया गया है!",
    confirmedPhonetic: "WhatsApp offer Rajesh ji ko safaltaapoorvak bhej diya gaya hai!",
    waPreview: "नमस्ते राजेश जी! श्री बालाजी प्रोविजन्स में आपके अगले ₹200+ के राशन पर फ्लैट ₹30 की छूट! केवल इस वीकेंड वैध।",
  },
  Hinglish: {
    merchantName: "Venkat ji (58 yrs • Low Vision Store Owner)",
    storeName: "Sri Balaji Provisions, Hyderabad",
    query: "Aaj kul kitna collection hua?",
    queryPhonetic: "Aaj kul kitna collection hua?",
    response: "Venkat ji, aaj aapki dukaan me 85 transactions hue, total collection ₹9,420 raha. Shaam ko rush zyada tha.",
    responsePhonetic: "Venkat ji, aaj aapki dukaan me pachasi transactions hue, total collection nau hazaar chaar sau bees rupaye raha.",
    prompt: "Rajesh ji (Regular Grahak) pichle 22 dino se nahi aaye hain. Kya unhe ₹30 ka WhatsApp offer bhejein?",
    promptPhonetic: "Rajesh ji pichle baais dino se nahi aaye hain. Kya unhe tees rupaye ka WhatsApp offer bhejein?",
    approval: "Haan, bhej do",
    approvalPhonetic: "Haan, bhej do",
    confirmed: "WhatsApp offer Rajesh ji ko successfully bhej diya gaya hai!",
    confirmedPhonetic: "WhatsApp offer Rajesh ji ko successfully bhej diya gaya hai!",
    waPreview: "Namaste Rajesh ji! Sri Balaji Provisions me aapke agle grocery bill par Flat ₹30 OFF! Valid this weekend.",
  },
  English: {
    merchantName: "Venkat ji (58 yrs • Low Vision Store Owner)",
    storeName: "Sri Balaji Provisions, Hyderabad",
    query: "How much was today's total collection?",
    queryPhonetic: "How much was today's total collection?",
    response: "Venkat ji, today your store completed 85 transactions, total collection is ₹9,420. Peak footfall was observed in the evening.",
    responsePhonetic: "Venkat ji, today your store completed eighty-five transactions, total collection is nine thousand four hundred twenty rupees.",
    prompt: "Rajesh (Regular Shopper) has not visited in 22 days. Shall I send him a ₹30 WhatsApp discount coupon?",
    promptPhonetic: "Rajesh has not visited in twenty-two days. Shall I send him a thirty rupee WhatsApp discount coupon?",
    approval: "Yes, send it",
    approvalPhonetic: "Yes, send it",
    confirmed: "WhatsApp retention offer successfully dispatched to Rajesh!",
    confirmedPhonetic: "WhatsApp retention offer successfully dispatched to Rajesh!",
    waPreview: "Namaste Rajesh ji! We missed you at Sri Balaji Provisions. Enjoy Flat ₹30 OFF on your next grocery order of ₹200+ this weekend!",
  },
  Tamil: {
    merchantName: "வெங்கட் அவர்கள் (பார்வைக் குறைபாடுள்ள வணிகர்)",
    storeName: "ஸ்ரீ பாலாஜி பிராவிஷன்ஸ், ஹைதராபாத்",
    query: "இன்று மொத்த வசூல் எவ்வளவு?",
    queryPhonetic: "Indru motha vasool evvalavu?",
    response: "வெங்கட் அவர்களே, இன்று உங்கள் கடையில் 85 பரிவர்த்தனைகள் மூலம் ₹9,420 வசூலாகியுள்ளது.",
    responsePhonetic: "Venkat avargale, indru ungal kadaiyil enbathu ainthu parivarthanaigal moolam ombathu aayirathu naanoothu irubadhu roobai vasool aagiyulladhu.",
    prompt: "ராஜேஷ் அவர்கள் கடந்த 22 நாட்களாக வரவில்லை. அவருக்கு ₹30 சலுகை அனுப்பவா?",
    promptPhonetic: "Rajesh avargal kadandha irubathu irandu naatkalaga varavillai. Avarukku muppathu roobai salugai anuppavaa?",
    approval: "ஆம், அனுப்புங்கள்",
    approvalPhonetic: "Aam, anuppungal",
    confirmed: "வாட்ஸ்அப் சலுகை ராஜேஷ் அவர்களுக்கு வெற்றிகரமாக அனுப்பப்பட்டது!",
    confirmedPhonetic: "WhatsApp salugai Rajesh avargalukku vetrigaramaaga anuppappattadhu!",
    waPreview: "வணக்கம் ராஜேஷ் அவர்களே! ஸ்ரீ பாலாஜி ஸ்டோரில் உங்கள் அடுத்த மளிகைப் பொருட்களுக்கு ₹30 தள்ளுபடி!",
  },
  Kannada: {
    merchantName: "ವೆಂಕಟ್ ಅವರು (ದೃಷ್ಟಿ ದೋಷವಿರುವ ಅಂಗಡಿಯವರು)",
    storeName: "ಶ್ರೀ ಬಾಲಾಜಿ ಪ್ರಾವಿಷನ್ಸ್, ಹೈದರಾಬಾದ್",
    query: "ಇಂದು ಒಟ್ಟು ಎಷ್ಟು ಕಲೆಕ್ಷನ್ ಆಗಿದೆ?",
    queryPhonetic: "Indu ottu eshtu collection aagidhe?",
    response: "ವೆಂಕಟ್ ಅವರೇ, ಇಂದು ನಿಮ್ಮ ಅಂಗಡಿಯಲ್ಲಿ 85 ವಹಿವಾಟುಗಳು ನಡೆದು ಒಟ್ಟು ₹9,420 ಸಂಗ್ರಹವಾಗಿದೆ.",
    responsePhonetic: "Venkat avare, indu nimma angadiyalli embatthu aydhu vahivaatugalu nadadhu ottu ombhatthu saavirada naanoora ippathu roopayi sangrahavagidhe.",
    prompt: "ರಾಜೇಶ್ ಅವರು ಕಳೆದ 22 ದಿನಗಳಿಂದ ಬಂದಿಲ್ಲ. ಅವರಿಗೆ ₹30 ರಿಯಾಯಿತಿ ಆಫರ್ ಕಳುಹಿಸಬೇಕೆ?",
    promptPhonetic: "Rajesh avaru kaledha ippatthu eradu dinagalinda bandilla. Avarige moovatthu roopayi discount offer kaluhisabeke?",
    approval: "ಹೌದು, ಕಳುಹಿಸು",
    approvalPhonetic: "Haudu, kaluhisu",
    confirmed: "ವಾಟ್ಸಾಪ್ ಆಫರ್ ಅನ್ನು ರಾಜೇಶ್ ಅವರಿಗೆ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ!",
    confirmedPhonetic: "WhatsApp offer annu Rajesh avarige yashasviyagi kaluhisalagidhe!",
    waPreview: "ನಮಸ್ಕಾರ ರಾಜೇಶ್ ಅವರೇ! ಶ್ರೀ ಬಾಲಾಜಿ ಸ್ಟೋರ್ಸ್‌ನಲ್ಲಿ ನಿಮ್ಮ ಮುಂದಿನ ಖರೀದಿಗೆ ₹30 ರಿಯಾಯಿತಿ!",
  },
};

const LANGUAGE_OPTIONS = [
  { id: "Telugu", label: "తెలుగు (Telugu)" },
  { id: "Hindi", label: "हिंदी (Hindi)" },
  { id: "Hinglish", label: "Hinglish" },
  { id: "English", label: "English" },
  { id: "Tamil", label: "தமிழ் (Tamil)" },
  { id: "Kannada", label: "ಕನ್ನಡ (Kannada)" },
];

export const EyesFreeModal: React.FC<EyesFreeModalProps> = ({
  isOpen,
  onClose,
  language = "Telugu",
}) => {
  const [activeLang, setActiveLang] = useState<string>(
    DIALOGUE_DATA[language] ? language : "Telugu"
  );
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [activeSpeaker, setActiveSpeaker] = useState<"merchant" | "soundbox" | "idle">("idle");
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);

  useEffect(() => {
    if (DIALOGUE_DATA[language]) {
      setActiveLang(language);
    }
  }, [language]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  if (!isOpen) return null;

  const data = DIALOGUE_DATA[activeLang] || DIALOGUE_DATA.Telugu;

  const playVoice = (
    text: string,
    phonetic: string,
    speaker: "merchant" | "soundbox",
    onEnd?: () => void
  ) => {
    setIsPlayingAudio(true);
    setActiveSpeaker(speaker);
    speakText(
      text,
      phonetic,
      activeLang,
      () => {
        setIsPlayingAudio(false);
        setActiveSpeaker("idle");
        if (onEnd) onEnd();
      },
      () => {
        setIsPlayingAudio(false);
        setActiveSpeaker("idle");
      }
    );
  };

  const handleStep1 = (autoNext = false) => {
    setCurrentStep(1);
    playVoice(data.query, data.queryPhonetic, "merchant", () => {
      if (autoNext) {
        setTimeout(() => handleStep2(true), 600);
      }
    });
  };

  const handleStep2 = (autoNext = false) => {
    setCurrentStep(2);
    playVoice(data.response, data.responsePhonetic, "soundbox", () => {
      if (autoNext) {
        setTimeout(() => handleStep3(false), 800);
      }
    });
  };

  const handleStep3 = (autoNext = false) => {
    setCurrentStep(3);
    playVoice(data.prompt, data.promptPhonetic, "soundbox", () => {
      if (autoNext) {
        // Pauses on step 3 waiting for approval
      }
    });
  };

  const handleApprove = () => {
    setCurrentStep(4);
    playVoice(data.approval, data.approvalPhonetic, "merchant", () => {
      setTimeout(() => {
        playVoice(data.confirmed, data.confirmedPhonetic, "soundbox", () => {
          setIsDispatched(true);
        });
      }, 500);
    });
  };

  const handleReset = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    setActiveSpeaker("idle");
    setCurrentStep(1);
    setIsDispatched(false);
  };

  const handleClose = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    setActiveSpeaker("idle");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-[28px] bg-gradient-to-b from-[#09152B] via-[#0B1A35] to-[#060D1A] border border-cyan-500/30 text-white shadow-2xl shadow-[#002E6E]/60 overflow-hidden my-4 sm:my-6">
        
        {/* Subtle Ambient Backlight Glow */}
        <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-[#00BAF2]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative border-b border-slate-800/80 bg-gradient-to-r from-[#001D4A] via-[#002E6E] to-[#0A1120] p-5 sm:p-6">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Close Accessibility Demo"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
              <EyeOff className="h-3.5 w-3.5 text-amber-400" />
              Bharat Accessibility • 100% Screen-Free Voice Copilot
            </span>
            <span className="rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 px-2.5 py-0.5 text-[10px] font-semibold">
              Low-Vision & Elderly Merchant Mode
            </span>
          </div>

          <h2 className="mt-2 text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Paytm Soundbox 4G: Spoken Operating Copilot
          </h2>
          <p className="mt-1 text-xs text-slate-300 max-w-xl leading-relaxed">
            Designed for elderly, cataract-affected, and visually impaired shopkeepers who cannot read mobile screens during busy store hours. Run accounts & customer retention through pure voice!
          </p>

          {/* Store Persona & Language Pill Bar */}
          <div className="mt-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 p-3 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                VJ
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white">{data.merchantName}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded font-semibold">
                    Verified Merchant
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  {data.storeName} • 100% Voice Operated
                </p>
              </div>
            </div>

            {/* Language Selector Pills */}
            <div className="flex flex-wrap items-center gap-1">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => {
                    stopSpeech();
                    setIsPlayingAudio(false);
                    setActiveSpeaker("idle");
                    setActiveLang(lang.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    activeLang === lang.id
                      ? "bg-[#00BAF2] text-[#0A1120] shadow-sm"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6">

          {/* Soundbox 4G Hardware Live Simulator Bar */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#002E6E]/70 via-[#0A1120] to-[#002E6E]/70 p-4 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              {/* Soundbox LED Indicator Icon */}
              <div className="relative">
                <div
                  className={`h-11 w-11 rounded-2xl flex items-center justify-center transition-all ${
                    activeSpeaker === "soundbox"
                      ? "bg-emerald-500 shadow-lg shadow-emerald-500/50"
                      : activeSpeaker === "merchant"
                      ? "bg-amber-500 shadow-lg shadow-amber-500/50"
                      : "bg-[#002E6E] border border-cyan-400/40"
                  }`}
                >
                  {activeSpeaker === "soundbox" ? (
                    <Radio className="h-5 w-5 text-slate-950 animate-pulse" />
                  ) : activeSpeaker === "merchant" ? (
                    <Mic className="h-5 w-5 text-slate-950 animate-pulse" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-cyan-300" />
                  )}
                </div>
                {/* Glowing status bead */}
                <span
                  className={`absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-slate-900 ${
                    isPlayingAudio ? "bg-emerald-400 animate-ping" : "bg-cyan-400"
                  }`}
                />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-white tracking-wide">
                    Paytm Soundbox 4G Live
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    VoLTE • Battery 94%
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  {activeSpeaker === "soundbox"
                    ? "🔊 Soundbox is speaking loud & clear audio in shop..."
                    : activeSpeaker === "merchant"
                    ? "🎙️ Merchant Venkat-ji is speaking aloud into mic..."
                    : "Zero screen glance needed • High-decibel speaker output"}
                </p>
              </div>
            </div>

            {/* Dancing Equalizer Audio Waves */}
            <div className="flex items-center gap-1.5 bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-700/60 self-stretch sm:self-auto justify-center">
              {[4, 8, 12, 16, 14, 9, 6].map((h, i) => (
                <span
                  key={i}
                  style={{
                    height: isPlayingAudio ? `${Math.max(6, (h * ((i % 3) + 1.2)) % 22)}px` : "6px",
                  }}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    activeSpeaker === "soundbox"
                      ? "bg-emerald-400"
                      : activeSpeaker === "merchant"
                      ? "bg-amber-400"
                      : "bg-slate-600"
                  }`}
                />
              ))}
              <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {isPlayingAudio ? "Audio Active" : "Speaker Idle"}
              </span>
            </div>
          </div>

          {/* 4-Step Interactive Conversation Dialogue */}
          <div className="space-y-3.5">

            {/* Step 1: Merchant Voice Query */}
            <div
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                currentStep === 1
                  ? "bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-400/80 shadow-md shadow-amber-950/40 ring-1 ring-amber-400/40"
                  : "bg-slate-900/50 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-[10px] font-black border border-amber-400/40">
                    1
                  </span>
                  Step 1: Venkat-ji Speaks Aloud (Zero Screen Touch)
                </span>
                <button
                  onClick={() => handleStep1(false)}
                  disabled={isPlayingAudio}
                  className="rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 text-[11px] font-bold px-2.5 py-1 transition flex items-center gap-1 cursor-pointer border border-amber-400/30"
                >
                  <Volume2 className="h-3 w-3" />
                  <span>Listen Step 1</span>
                </button>
              </div>

              <div className="pl-6">
                <p className="text-base sm:text-lg font-extrabold text-white tracking-wide">
                  &ldquo;{data.query}&rdquo;
                </p>
                <p className="mt-0.5 text-xs text-amber-200/70 italic font-mono">
                  Phonetic: ({data.queryPhonetic})
                </p>
              </div>
            </div>

            {/* Step 2: Soundbox Spoken Store Intelligence */}
            <div
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                currentStep === 2
                  ? "bg-gradient-to-r from-blue-950/50 via-slate-900 to-slate-900 border-[#00BAF2] shadow-md shadow-blue-950/50 ring-1 ring-[#00BAF2]/40"
                  : currentStep > 2
                  ? "bg-slate-900/60 border-slate-800/80"
                  : "bg-slate-900/30 border-slate-800/40 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#00BAF2] flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-[10px] font-black border border-cyan-400/40">
                    2
                  </span>
                  Step 2: Paytm Soundbox Speaks Back (Live Database Verified)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    ✓ 85 Txns • ₹9,420
                  </span>
                  <button
                    onClick={() => handleStep2(false)}
                    disabled={isPlayingAudio}
                    className="rounded-lg bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-300 text-[11px] font-bold px-2.5 py-1 transition flex items-center gap-1 cursor-pointer border border-cyan-400/30"
                  >
                    <Volume2 className="h-3 w-3" />
                    <span>Listen Step 2</span>
                  </button>
                </div>
              </div>

              <div className="pl-6">
                <p className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                  {data.response}
                </p>
              </div>
            </div>

            {/* Step 3: Proactive Afternoon Slump Prompt */}
            <div
              className={`rounded-2xl border p-4 transition-all duration-300 ${
                currentStep === 3
                  ? "bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border-purple-400 shadow-md shadow-purple-950/50 ring-1 ring-purple-400/40"
                  : currentStep > 3
                  ? "bg-slate-900/60 border-slate-800/80"
                  : "bg-slate-900/30 border-slate-800/40 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <span className="h-5 w-5 rounded-full bg-purple-400/20 text-purple-300 flex items-center justify-center text-[10px] font-black border border-purple-400/40">
                    3
                  </span>
                  Step 3: Soundbox Proactively Alerts Lost Regular Customer
                </span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 border border-amber-400/30">
                    Slump Alert (Rajesh • Inactive 22d)
                  </span>
                  <button
                    onClick={() => handleStep3(false)}
                    disabled={isPlayingAudio}
                    className="rounded-lg bg-purple-400/20 hover:bg-purple-400/30 text-purple-300 text-[11px] font-bold px-2.5 py-1 transition flex items-center gap-1 cursor-pointer border border-purple-400/30"
                  >
                    <Volume2 className="h-3 w-3" />
                    <span>Listen Step 3</span>
                  </button>
                </div>
              </div>

              <div className="pl-6">
                <p className="text-sm sm:text-base font-bold text-amber-100 leading-relaxed">
                  &ldquo;{data.prompt}&rdquo;
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  💡 Quiet afternoon hours (1:30 PM). Zero customer line disruption. Shopkeeper just needs to say 1 word.
                </p>
              </div>
            </div>

            {/* Step 4: 1-Word Merchant Spoken Approval & Instant WhatsApp Dispatch */}
            {currentStep >= 3 && (
              <div
                className={`rounded-2xl border p-4 transition-all duration-300 animate-in fade-in zoom-in-95 ${
                  currentStep === 4
                    ? "bg-gradient-to-r from-emerald-950/50 via-slate-900 to-slate-900 border-emerald-400 shadow-lg shadow-emerald-950/60 ring-1 ring-emerald-400/40"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-[10px] font-black border border-emerald-400/40">
                      4
                    </span>
                    Step 4: Venkat-ji Confirms by Pure Voice (1-Word Audio Action)
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    ✓ 1-Word Voice Trigger
                  </span>
                </div>

                <div className="pl-6 space-y-3">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Merchant Spoke:</span>
                    <p className="text-lg font-black text-white">
                      &ldquo;{data.approval}&rdquo;{" "}
                      <span className="text-xs font-normal text-slate-400 italic">
                        ({data.approvalPhonetic})
                      </span>
                    </p>
                  </div>

                  {isDispatched && (
                    <div className="pt-3 border-t border-emerald-800/60 space-y-3 animate-in fade-in duration-300">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>Soundbox Confirmation: &ldquo;{data.confirmed}&rdquo;</span>
                      </div>

                      {/* WhatsApp Dispatched Preview Card */}
                      <div className="rounded-2xl bg-slate-950/90 border border-emerald-500/40 p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Real-Time Dispatched WhatsApp Offer
                          </span>
                          <span className="text-slate-400 font-mono">
                            To: Rajesh (+91 8374360774)
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans bg-slate-900 p-3 rounded-xl border border-slate-800">
                          &ldquo;{data.waPreview}&rdquo;
                        </p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-slate-400">
                            ⚡ 100% Free wa.me Link • Zero API fees
                          </span>
                          <a
                            href={`https://wa.me/918374360774?text=${encodeURIComponent(data.waPreview)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 transition active:scale-95 shadow-sm"
                          >
                            <Share2 className="h-3.5 w-3.5" />
                            <span>Test wa.me Link 🚀</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Interactive Simulation Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {/* Primary Action Button */}
            {currentStep < 3 && (
              <button
                type="button"
                onClick={() => handleStep1(true)}
                disabled={isPlayingAudio}
                className="flex-1 rounded-2xl bg-gradient-to-r from-cyan-400 via-[#00BAF2] to-blue-500 py-3.5 px-4 text-xs sm:text-sm font-extrabold text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-900/40 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Play className={`h-4 w-4 fill-current ${isPlayingAudio ? "animate-spin" : ""}`} />
                <span>
                  {isPlayingAudio
                    ? "Speaking in Natural Audio..."
                    : `▶ Play Complete Voice Walkthrough (${activeLang})`}
                </span>
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                onClick={handleApprove}
                disabled={isPlayingAudio}
                className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 py-3.5 px-4 text-xs sm:text-sm font-black text-slate-950 hover:brightness-110 shadow-xl shadow-emerald-950/50 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mic className="h-4 w-4 text-slate-950" />
                <span>
                  Speak Voice Approval: &ldquo;{data.approval}&rdquo; (Dispatch ₹30 Offer)
                </span>
              </button>
            )}

            {currentStep === 4 && (
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 rounded-2xl bg-slate-800 hover:bg-slate-700 py-3.5 px-4 text-xs sm:text-sm font-bold text-slate-200 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="h-4 w-4 text-cyan-400" />
                <span>↺ Replay Eyes-Free Voice Interaction</span>
              </button>
            )}

            {/* Reset / Stop Button */}
            {isPlayingAudio && (
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  setIsPlayingAudio(false);
                  setActiveSpeaker("idle");
                }}
                className="rounded-2xl border border-red-500/40 bg-red-950/30 hover:bg-red-900/50 text-red-300 font-bold text-xs py-3.5 px-4 transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <VolumeX className="h-4 w-4" />
                <span>Stop Speech</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
