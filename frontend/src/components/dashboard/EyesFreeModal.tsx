"use client";

import React, { useState } from "react";
import {
  Mic,
  Volume2,
  X,
  Sparkles,
  Radio,
  Send,
  EyeOff,
  Share2,
  CheckCircle2,
  Languages,
} from "lucide-react";
import { speakText, stopSpeech } from "@/lib/speech";

interface EyesFreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

interface DialogueContent {
  merchantName: string;
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
    merchantName: "వెంకట్ గారు (58 ఏళ్ళు • కంటి చూపు లోపం ఉన్న వ్యాపారి)",
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
    merchantName: "वेंकट जी (58 वर्ष • कम दृष्टि वाले दुकानदार, हैदराबाद)",
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
  Tamil: {
    merchantName: "வெங்கட் அவர்கள் (பார்வைக் குறைபாடுள்ள வணிகர்)",
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
  English: {
    merchantName: "Venkat ji (58 yrs • Low Vision Store Owner, Hyderabad)",
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
  Hinglish: {
    merchantName: "Venkat ji (58 yrs • Low Vision Store Owner, Hyderabad)",
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
};

export const EyesFreeModal: React.FC<EyesFreeModalProps> = ({
  isOpen,
  onClose,
  language = "Telugu",
}) => {
  const [activeLang, setActiveLang] = useState<string>(
    DIALOGUE_DATA[language] ? language : "Telugu"
  );
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isDispatched, setIsDispatched] = useState<boolean>(false);

  if (!isOpen) return null;

  const data = DIALOGUE_DATA[activeLang] || DIALOGUE_DATA.Telugu;

  const playVoice = (text: string, phonetic: string, onEnd?: () => void) => {
    setIsPlayingAudio(true);
    speakText(
      text,
      phonetic,
      activeLang,
      () => {
        setIsPlayingAudio(false);
        if (onEnd) onEnd();
      },
      () => setIsPlayingAudio(false)
    );
  };

  const handleStep1 = () => {
    setCurrentStep(1);
    playVoice(data.query, data.queryPhonetic, () => {
      // Auto progress to step 2 after merchant asks
      setTimeout(() => {
        handleStep2();
      }, 500);
    });
  };

  const handleStep2 = () => {
    setCurrentStep(2);
    playVoice(data.response, data.responsePhonetic, () => {
      // Auto progress to soundbox retention prompt
      setTimeout(() => {
        handleStep3();
      }, 800);
    });
  };

  const handleStep3 = () => {
    setCurrentStep(3);
    playVoice(data.prompt, data.promptPhonetic);
  };

  const handleApprove = () => {
    setCurrentStep(4);
    playVoice(data.approval, data.approvalPhonetic, () => {
      setTimeout(() => {
        playVoice(data.confirmed, data.confirmedPhonetic, () => {
          setIsDispatched(true);
        });
      }, 600);
    });
  };

  const handleReset = () => {
    stopSpeech();
    setIsPlayingAudio(false);
    setCurrentStep(1);
    setIsDispatched(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border-2 border-cyan-500/40 text-white shadow-2xl overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-[#002E6E] to-slate-950 p-6 border-b border-slate-800 relative">
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          >
            <X className="h-4 w-4 text-slate-300" />
          </button>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 px-3 py-0.5 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
              <EyeOff className="h-3.5 w-3.5" />
              100% Eyes-Free Audio Mode • Bharat Accessibility
            </span>
            <span className="text-xs text-slate-400">Powered by Sarvam AI</span>
          </div>

          <h2 className="mt-2.5 text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Paytm Soundbox 2.0: Voice Operating Copilot
          </h2>
          <p className="mt-1 text-xs text-cyan-100/80">
            For visually impaired, elderly (cataract/low-vision), and screen-free shopkeepers. Run entire store & retention through pure voice!
          </p>

          {/* Persona Card */}
          <div className="mt-4 rounded-xl bg-slate-800/80 border border-slate-700 p-3 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-slate-400 block font-medium">Active Store Persona:</span>
              <strong className="text-white text-sm">{data.merchantName}</strong>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-700">
              <Languages className="h-3.5 w-3.5 text-cyan-400" />
              <select
                value={activeLang}
                onChange={(e) => {
                  stopSpeech();
                  setIsPlayingAudio(false);
                  setCurrentStep(1);
                  setIsDispatched(false);
                  setActiveLang(e.target.value);
                }}
                className="bg-transparent text-xs text-cyan-200 font-bold focus:outline-none cursor-pointer"
              >
                <option value="Telugu" className="bg-slate-900 text-white">తెలుగు (Telugu)</option>
                <option value="Hindi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
                <option value="English" className="bg-slate-900 text-white">English</option>
                <option value="Tamil" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
                <option value="Kannada" className="bg-slate-900 text-white">ಕನ್ನಡ (Kannada)</option>
                <option value="Hinglish" className="bg-slate-900 text-white">Hinglish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interactive Dialogue Body */}
        <div className="p-6 space-y-5">

          {/* Dialogue Flow Progression */}
          <div className="space-y-4">

            {/* Turn 1: Merchant Asks Aloud */}
            <div className={`rounded-2xl border p-4 transition-all ${
              currentStep === 1
                ? "bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-950/50"
                : "bg-slate-950/60 border-slate-800 opacity-80"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Mic className="h-3.5 w-3.5" />
                  Step 1: Venkat-ji Speaks Aloud (No Phone Screen Looked At)
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Microphone STT</span>
              </div>
              <p className="text-lg font-bold text-white tracking-wide">
                &ldquo;{data.query}&rdquo;
              </p>
              <p className="mt-0.5 text-xs text-slate-400 italic">
                ({data.queryPhonetic})
              </p>
            </div>

            {/* Turn 2: Soundbox Real-Time Audio Response */}
            <div className={`rounded-2xl border p-4 transition-all ${
              currentStep === 2
                ? "bg-blue-950/80 border-[#00BAF2] shadow-lg shadow-blue-950/60"
                : currentStep > 2
                ? "bg-slate-950/60 border-slate-800"
                : "bg-slate-950/30 border-slate-800/50 opacity-40"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#00BAF2] flex items-center gap-1.5">
                  <Radio className={`h-3.5 w-3.5 ${isPlayingAudio && currentStep === 2 ? "animate-pulse" : ""}`} />
                  Step 2: Paytm Soundbox Speaks Back (Real Database Stats)
                </span>
                <span className="text-[11px] text-emerald-400 font-bold">✓ 85 Txns • ₹9,420</span>
              </div>
              <p className="text-sm font-semibold text-slate-100 leading-relaxed">
                {data.response}
              </p>
            </div>

            {/* Turn 3: Soundbox Proactive Customer Retention Prompt */}
            <div className={`rounded-2xl border p-4 transition-all ${
              currentStep === 3
                ? "bg-amber-950/60 border-amber-400 shadow-lg shadow-amber-950/60"
                : currentStep > 3
                ? "bg-slate-950/60 border-slate-800"
                : "bg-slate-950/30 border-slate-800/50 opacity-40"
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  Step 3: Soundbox Voice-Prompts Inactive Regular Customer
                </span>
                <span className="rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 border border-amber-400/30">
                  At-Risk Regular (22d Absent)
                </span>
              </div>
              <p className="text-sm font-bold text-amber-100 leading-relaxed">
                &ldquo;{data.prompt}&rdquo;
              </p>
            </div>

            {/* Turn 4: Merchant Voice Approval */}
            {currentStep >= 3 && (
              <div className={`rounded-2xl border p-4 transition-all ${
                currentStep === 4
                  ? "bg-emerald-950/70 border-emerald-400 shadow-lg shadow-emerald-950/60"
                  : "bg-slate-950/60 border-slate-800"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Step 4: Venkat-ji Confirms by Pure Voice
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold">1-Word Voice Approval</span>
                </div>
                <p className="text-base font-black text-white">
                  &ldquo;{data.approval}&rdquo; <span className="text-xs font-normal text-slate-400 italic">({data.approvalPhonetic})</span>
                </p>

                {isDispatched && (
                  <div className="mt-3 pt-3 border-t border-emerald-800/60 space-y-2">
                    <p className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                      <Radio className="h-3.5 w-3.5" />
                      Soundbox Confirmation: &ldquo;{data.confirmed}&rdquo;
                    </p>
                    
                    {/* WhatsApp Output Preview */}
                    <div className="rounded-xl bg-slate-900 border border-emerald-500/40 p-3 text-xs text-slate-200">
                      <span className="text-[10px] text-emerald-400 uppercase font-black tracking-wider block mb-1">
                        Dispatched WhatsApp Message to Rajesh:
                      </span>
                      &ldquo;{data.waPreview}&rdquo;
                    </div>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(data.waPreview)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 mt-2 transition"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Test Send via WhatsApp Web
                    </a>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Interactive Simulation Controls */}
          <div className="pt-2 flex gap-3">
            {currentStep < 3 && (
              <button
                type="button"
                onClick={handleStep1}
                disabled={isPlayingAudio}
                className="w-full rounded-2xl bg-gradient-to-r from-[#00BAF2] to-cyan-500 py-3.5 text-xs font-black text-slate-950 hover:brightness-110 shadow-lg shadow-cyan-900/40 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Volume2 className={`h-4 w-4 ${isPlayingAudio ? "animate-pulse" : ""}`} />
                {isPlayingAudio ? "Speaking in Audio..." : `▶ Start Eyes-Free Voice Demo (${activeLang})`}
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="button"
                onClick={handleApprove}
                disabled={isPlayingAudio}
                className="w-full rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3.5 text-xs font-black text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-950/40 transition active:scale-95 flex items-center justify-center gap-2 animate-bounce"
              >
                <Mic className="h-4 w-4 text-slate-950" />
                Speak Approval: &ldquo;{data.approval}&rdquo; (Voice-Trigger WhatsApp Offer)
              </button>
            )}

            {currentStep === 4 && isDispatched && (
              <button
                type="button"
                onClick={() => {
                  stopSpeech();
                  setCurrentStep(1);
                  setIsDispatched(false);
                  setTimeout(() => handleStep1(), 200);
                }}
                className="w-full rounded-2xl bg-slate-800 hover:bg-slate-700 py-3 text-xs font-bold text-slate-200 transition"
              >
                ↺ Replay Eyes-Free Voice Interaction
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
