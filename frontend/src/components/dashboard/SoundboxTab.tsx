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
} from "lucide-react";
import { SoundboxBriefing } from "@/lib/types";
import { speakText, stopSpeech } from "@/lib/speech";

interface SoundboxTabProps {
  briefing: SoundboxBriefing | null;
  isLoading?: boolean;
  language?: string;
}

export const BRIEFING_SCRIPTS: Record<
  string,
  { native: string; phonetic: string; langCode: string; label: string }
> = {
  Hindi: {
    label: "हिंदी (Hindi)",
    langCode: "hi-IN",
    native:
      "नमस्ते शर्मा जी! कल आपकी दुकान का कुल कलेक्शन ₹18,450 रहा, जिसमें कुल 34 ट्रांजेक्शन हुए। शाम 7 बजे सबसे ज्यादा भीड़ देखी गई। पिछले हफ्ते के मुकाबले कल का व्यापार 12.5% बेहतर रहा। अलर्ट: अमूल बटर का स्टॉक कम है। व्यापार AI की तरफ से आपका आज का दिन शुभ और मुनाफेदार हो!",
    phonetic:
      "Namaste Sharma ji! Kal aapki dukaan ka kul collection atharah hazaar chaar sau pachaas rupaye raha, jisme kul chauthis transactions hue. Shaam saat baje sabse zyada bheed dekhi gayi. Pichle hafte ke mukable kal ka dhandha baarah point paanch percent behtar raha. Alert: Amul butter ka stock kam hai. Vyapaar AI ki taraf se aapka aaj ka din shubh aur munafedaar ho!",
  },
  Telugu: {
    label: "తెలుగు (Telugu)",
    langCode: "te-IN",
    native:
      "నమస్కారం శర్మ గారూ! నిన్న మీ దుకాణం మొత్తం కలెక్షన్ ₹18,450, ఇందులో మొత్తం 34 లావాదేవీలు జరిగాయి. సాయంత్రం 7 గంటలకు అత్యధిక రద్దీ కనిపించింది. గత వారంతో పోలిస్తే నిన్నటి వ్యాపారం 12.5% పెరిగింది. అలర్ట్: అమూల్ బటర్ స్టాక్ తక్కువగా ఉంది. వ్యాపార్ AI తరపున మీకు శుభదినం మరియు లాభదాయకమైన రోజు కావాలని కోరుకుంటున్నాము!",
    phonetic:
      "Namaskaram Sharma gaaru! Ninna mee dukaanam motham collection padhenimidi vela naalugu vandhala yaabhai rupayalu, andulo motham mupphai naalugu transactions jarigaayi. Saayantram yedu gantlaku athyadhika raddi kanipinchindi. Gatha vaaram tho polisthe ninna vyaapaaram baarah point paanch percent perigindi. Alert: Amul butter stock thakkuvaga undi. Vyapaar AI tharapuna meeku shubhadhinam mariyu laabhadaayakamaina roju kaavaalani korukuntunnaamu!",
  },
  Tamil: {
    label: "தமிழ் (Tamil)",
    langCode: "ta-IN",
    native:
      "வணக்கம் சர்மா அவர்களே! நேற்று உங்கள் கடையின் மொத்த வசூல் ₹18,450 (34 பரிவர்த்தனைகள்). மாலை 7 மணிக்கு அதிக கூட்டம் இருந்தது. கடந்த வாரத்தை விட நேற்று விற்பனை 12.5% அதிகரித்துள்ளது. வியாபார் AI சார்பாக இனிய நாளாக அமைய வாழ்த்துகள்!",
    phonetic:
      "Vanakkam Sharma avargale! Netru ungal kadayin motha vasool padhinettu aayirathu naanoothu aimbadhu roobai, idhil muppathi naangu parivarthanaigal nadanthana. Maalai yezhu manikku adhigam koottam irundhadhu. Kadandha vaarathai vida netru vilpanai baarah point paanch percent adhigarithulladhu. Vyapaar AI saarbaaga iniya naal aamaia vaazhthukkal!",
  },
  Kannada: {
    label: "ಕನ್ನಡ (Kannada)",
    langCode: "kn-IN",
    native:
      "ನಮಸ್ಕಾರ ಶರ್ಮಾ ಅವರೇ! ನಿನ್ನೆ ನಿಮ್ಮ ಅಂಗಡಿಯ ಒಟ್ಟು ಸಂಗ್ರಹ ₹18,450, ಇದರಲ್ಲಿ 34 ವಹಿವಾಟುಗಳು ನಡೆದಿವೆ. ಸಂಜೆ 7 ಗಂಟೆಗೆ ಗರಿಷ್ಠ ವ್ಯಾಪಾರ ದಾಖಲಾಗಿದೆ. ಕಳೆದ ವಾರಕ್ಕಿಂತ ವ್ಯಾಪಾರ 12.5% ಹೆಚ್ಚಾಗಿದೆ. ವ್ಯಾಪಾರ AI ವತಿಯಿಂದ ನಿಮಗೆ ಶುಭ ದಿನ!",
    phonetic:
      "Namaskara Sharma avare! Ninne nimma angadiya sangraha hadinentu saavirada naanoora aivathu roopayi, idharalli moovathu naalku vahivaatugalu nadadhive. Sanje yelu gantege garishtha vyaapaara dhaakhalagidhe. Kaledha vaarakkintha vyaapaara baarah point paanch percent hechhaagidhe. Vyapaar AI vathiyinda nimge shubha dina!",
  },
  English: {
    label: "English",
    langCode: "en-IN",
    native:
      "Good morning Sharma ji! Yesterday your store collection was ₹18,450 across 34 transactions. Peak footfall was observed at 7:00 PM. Sales grew by 12.5% compared to last week. Alert: Amul Butter stock is running low. Vyapaar AI wishes you a profitable business day ahead!",
    phonetic:
      "Good morning Sharma ji! Yesterday your store collection was eighteen thousand four hundred fifty rupees across thirty-four transactions. Peak footfall was observed at 7:00 PM. Sales grew by 12.5% compared to last week. Alert: Amul Butter stock is running low. Vyapaar AI wishes you a profitable business day ahead!",
  },
  Hinglish: {
    label: "Hinglish",
    langCode: "hi-IN",
    native:
      "Namaste Sharma ji! Kal aapki dukaan ka total collection ₹18,450 raha, jisme kul 34 transactions hue. Shaam 7 baje sabse zyada bheed dekhi gayi. Pichle hafte ke mukable kal ka dhandha 12.5% behtar raha. Alert: Amul Butter ka stock kam hai. Vyapaar AI ki taraf se aapka aaj ka din shubh aur munafedaar ho!",
    phonetic:
      "Namaste Sharma ji! Kal aapki dukaan ka total collection atharah hazaar chaar sau pachaas rupaye raha, jisme kul chauthis transactions hue. Shaam saat baje sabse zyada bheed dekhi gayi. Pichle hafte ke mukable kal ka dhandha baarah point paanch percent behtar raha. Alert: Amul Butter ka stock kam hai. Vyapaar AI ki taraf se aapka aaj ka din shubh aur munafedaar ho!",
  },
};

const AUDIO_FILE_MAP: Record<string, string> = {
  Hindi: "/audio/briefing_hindi.mp3",
  Telugu: "/audio/briefing_telugu.mp3",
  Tamil: "/audio/briefing_tamil.mp3",
  Kannada: "/audio/briefing_kannada.mp3",
  English: "/audio/briefing_english.mp3",
  Hinglish: "/audio/briefing_hinglish.mp3",
};

export const SoundboxTab: React.FC<SoundboxTabProps> = ({
  briefing,
  isLoading,
  language = "Hinglish",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentScript = BRIEFING_SCRIPTS[language] || BRIEFING_SCRIPTS.Hinglish;

  // Cleanup speech/audio if user leaves the tab
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSpeech();
    };
  }, []);

  // Stop playback if language changes while playing
  useEffect(() => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSpeech();
      setIsPlaying(false);
    }
  }, [language]);

  const togglePlayAudio = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    const audioUrl = AUDIO_FILE_MAP[language] || AUDIO_FILE_MAP.Hinglish;

    try {
      if (!audioRef.current || !audioRef.current.src.endsWith(audioUrl)) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.onerror = () => {
          // Fallback to speech synthesis if audio file cannot be loaded
          speakText(
            currentScript.native,
            currentScript.phonetic,
            language,
            () => setIsPlaying(false),
            () => setIsPlaying(false)
          );
        };
      }

      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((e) => {
          console.warn("Audio element play error, falling back to speech synthesis:", e);
          speakText(
            currentScript.native,
            currentScript.phonetic,
            language,
            () => setIsPlaying(false),
            () => setIsPlaying(false)
          );
        });
    } catch (err) {
      speakText(
        currentScript.native,
        currentScript.phonetic,
        language,
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    stopSpeech();
    setIsPlaying(false);
    setTimeout(() => {
      togglePlayAudio();
    }, 100);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-[#002E6E] border border-cyan-200">
            Paytm Soundbox 5.0 AI Edition
          </span>
          <span className="text-xs text-slate-500">• Multilingual Spoken Voice Engine</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1120]">
          Daily Morning Dukaan Briefing
        </h2>
        <p className="text-xs text-slate-500">
          Your shop&apos;s 30-second audio recap synthesized every morning at 8:00 AM before shutters open.
        </p>
      </div>

      {/* The Digital Soundbox Device Simulator Card */}
      <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-b from-slate-900 via-[#002E6E] to-slate-950 p-8 text-white shadow-xl relative overflow-hidden">
        {/* Soundbox device mesh decoration */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left: Device Speaker Visual */}
          <div className="flex flex-col items-center">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl bg-slate-800/90 border-2 border-[#00BAF2]/40 shadow-inner">
              {/* Speaker Grille Circle */}
              <div className="h-24 w-24 rounded-full border border-slate-700 bg-slate-950/80 flex items-center justify-center">
                <Radio className={`h-10 w-10 text-[#00BAF2] ${isPlaying ? "animate-pulse" : ""}`} />
              </div>

              {/* Paytm Logo Badge */}
              <div className="absolute -top-3 bg-[#00BAF2] text-[#0A1120] text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest shadow">
                PAYTM SOUNDBOX
              </div>

              {/* Status LED */}
              <div className="absolute bottom-2 flex items-center space-x-1.5">
                <div
                  className={`h-2 w-2 rounded-full ${
                    isPlaying ? "bg-emerald-400 animate-ping" : "bg-cyan-400"
                  }`}
                />
                <span className="text-[11px] text-slate-400 font-mono">
                  {isPlaying ? "SPEAKING" : "STANDBY"}
                </span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="mt-4 flex items-center space-x-3">
              <button
                onClick={restartAudio}
                className="rounded-full bg-slate-800 p-2.5 text-slate-300 hover:bg-slate-700 hover:text-white transition shadow-sm active:scale-95"
                title="Restart Briefing"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={togglePlayAudio}
                className={`flex items-center space-x-2 rounded-full px-6 py-2.5 text-xs font-bold transition shadow-lg active:scale-95 ${
                  isPlaying
                    ? "bg-amber-400 text-slate-950 hover:bg-amber-300 ring-2 ring-amber-400/50"
                    : "bg-[#00BAF2] text-[#0A1120] hover:bg-[#3ecbf7] ring-2 ring-[#00BAF2]/50"
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
                    <span>Play Audio Briefing</span>
                  </>
                )}
              </button>
            </div>

            {/* Current Voice Language Indicator */}
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <Languages className="h-3.5 w-3.5 text-[#00BAF2]" />
              <span>Voice: {currentScript.label}</span>
            </div>
          </div>

          {/* Right: Spoken Transcript Display */}
          <div className="flex-1 rounded-2xl bg-slate-950/70 border border-slate-700/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-[#00BAF2]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Dukaan Morning Audio Transcript
                </span>
              </div>
              <span className="rounded-full bg-blue-900/60 text-[#00BAF2] px-2.5 py-0.5 text-[11px] font-bold border border-[#00BAF2]/30">
                {language} Spoken Audio
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-100 font-medium whitespace-pre-line">
              &quot;{currentScript.native}&quot;
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-3 border-t border-slate-800/80">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Deterministic Store Metrics</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Regional Voice Ready</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Zero Latency Playback</span>
              </div>
            </div>
          </div>
        </div>

        {/* Device Background Ambient Glow */}
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#00BAF2]/10 blur-3xl pointer-events-none" />
      </div>

      {/* 3 Metric Summary Cards from the Briefing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Yesterday&apos;s Revenue
          </p>
          <p className="mt-2 text-2xl font-black text-[#0A1120]">₹18,450</p>
          <p className="mt-1 text-xs text-emerald-600 font-bold flex items-center gap-1">
            <Zap className="h-3.5 w-3.5" /> +12.5% vs last week same day
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Peak Rush Observed
          </p>
          <p className="mt-2 text-2xl font-black text-[#0A1120]">7:00 PM - 8:00 PM</p>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            34 verified Soundbox UPI bills
          </p>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            Inventory Stock Alert
          </p>
          <p className="mt-2 text-base font-bold text-amber-950">
            Amul Butter (100g) Low Stock
          </p>
          <p className="mt-1 text-xs text-amber-800 font-medium">
            Reorder before 5:00 PM rush hour
          </p>
        </div>
      </div>
    </div>
  );
};
