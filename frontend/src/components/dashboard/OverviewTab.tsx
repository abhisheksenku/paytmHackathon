"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  CreditCard,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Calendar,
  Sparkles,
  Clock,
  EyeOff,
  Mic,
  Volume2,
  Radio,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatINR, formatCompactINR } from "@/lib/utils";
import { OverviewSummary, RevenueTrendPoint } from "@/lib/types";
import { EyesFreeModal } from "./EyesFreeModal";

interface OverviewTabProps {
  overview: OverviewSummary | null;
  trends: RevenueTrendPoint[];
  onOpenSoundbox: () => void;
  onOpenCopilot: (initialPrompt?: string) => void;
  onOpenCampaigns: () => void;
  language?: string;
}

const OVERVIEW_CONTENT: Record<string, {
  tag: string;
  subtag: string;
  greeting: string;
  summary: (col: string) => React.ReactNode;
  btnBriefing: string;
  btnCopilot: string;
  copilotPrompt: string;
  kpiNetRevenue: string;
  kpiTotalBills: string;
  kpiAOV: string;
  kpiRepeat: string;
  kpiVsPrior: string;
  kpiVerified: string;
  kpiSteadyBasket: string;
  kpiHighLoyalty: string;
  chartTitle: string;
  chartSub: string;
  eyesFreeTitle: string;
  eyesFreeBadge: string;
  eyesFreePersona: string;
  eyesFreeQuery: string;
  eyesFreeResponse: string;
  eyesFreeRetentionAlert: string;
  btnCampaign: string;
  btnLaunchEyesFree: string;
}> = {
  Hindi: {
    tag: "Paytm साउंडबॉक्स इंटेलिजेंस सक्रिय",
    subtag: "लाइव स्टोर एनालिटिक्स",
    greeting: "नमस्ते, शर्मा जनरल स्टोर! 🙏",
    summary: (col) => <>कल आपकी दुकान का कुल कलेक्शन <strong className="text-white">{col}</strong> रहा। शाम 7 बजे सबसे ज्यादा ग्राहक देखे गए।</>,
    btnBriefing: "दुकान ब्रीफिंग सुनें (30s)",
    btnCopilot: "AI कोपायलट से पूछें",
    copilotPrompt: "पिछले महीने से तुलना करके बताएं व्यापार कैसा है?",
    kpiNetRevenue: "नेट कलेक्शन",
    kpiTotalBills: "कुल बिल (UPI)",
    kpiAOV: "औसत बिल राशि",
    kpiRepeat: "नियमित ग्राहक",
    kpiVsPrior: "पिछले महीने से",
    kpiVerified: "सत्यापित बिल",
    kpiSteadyBasket: "स्थिर खरीदारी आकार",
    kpiHighLoyalty: "मजबूत ग्राहक निष्ठा",
    chartTitle: "दैनिक बिक्री और वॉल्यूम ट्रेंड",
    chartSub: "180-दिनों का सत्यापित खाता लेजर",
    eyesFreeTitle: "स्क्रीन-फ्री वॉयस कोपायलट",
    eyesFreeBadge: "समावेशी भारत AI",
    eyesFreePersona: "वेंकट जी (58 वर्ष • कम दृष्टि वाले दुकानदार, हैदराबाद)",
    eyesFreeQuery: "आज कुल कितना कलेक्शन हुआ?",
    eyesFreeResponse: "85 ट्रांजेक्शन • ₹9,420 कलेक्शन। शाम को भीड़ रही।",
    eyesFreeRetentionAlert: "राजेश जी 22 दिनों से नहीं आए। क्या ₹30 का ऑफर भेजें?",
    btnCampaign: "व्हाट्सएप ऑफर से बिक्री बढ़ाएं",
    btnLaunchEyesFree: "🎙️ वॉयस डेमो शुरू करें (Scenario 3)",
  },
  Telugu: {
    tag: "Paytm సౌండ్‌బాక్స్ ఇంటెలిజెన్స్ యాక్టివ్",
    subtag: "లైవ్ స్టోర్ అనలిటిక్స్",
    greeting: "నమస్కారం, శర్మ జనరల్ స్టోర్! 🙏",
    summary: (col) => <>నిన్న మీ దుకాణం మొత్తం కలెక్షన్ <strong className="text-white">{col}</strong>. సాయంత్రం 7 గంటలకు అత్యధిక రద్దీ నమోదైంది.</>,
    btnBriefing: "దుకాణం బ్రీఫింగ్ వినండి (30s)",
    btnCopilot: "AI కోపైలట్‌ని అడగండి",
    copilotPrompt: "గత నెలతో పోలిస్తే నా వ్యాపార కలెక్షన్ ఎలా ఉంది?",
    kpiNetRevenue: "నికర కలెక్షన్",
    kpiTotalBills: "మొత్తం బిల్లులు (UPI)",
    kpiAOV: "సగటు బిల్లు విలువ",
    kpiRepeat: "రెగ్యులర్ కస్టమర్లు",
    kpiVsPrior: "మునుపటి కాలంతో పోలిస్తే",
    kpiVerified: "ధృవీకరించబడిన రసీదులు",
    kpiSteadyBasket: "స్థిరమైన కొనుగోలు",
    kpiHighLoyalty: "అధిక కస్టమర్ లాయల్టీ",
    chartTitle: "రోజువారీ కలెక్షన్ వేగం & పరిమాణం",
    chartSub: "180 రోజుల నిరంతర లెడ్జర్ విశ్లేషణ",
    eyesFreeTitle: "స్క్రీన్-ఫ్రీ వాయిస్ కోపైలట్",
    eyesFreeBadge: "సమ్మిళిత భారత్ AI",
    eyesFreePersona: "వెంకట్ గారు (58 ఏళ్ళు • కంటి చూపు లోపం, హైదరాబాద్)",
    eyesFreeQuery: "ఈ రోజు మొత్తం ఎంత కలెక్షన్ అయింది?",
    eyesFreeResponse: "85 లావాదేవీలు • ₹9,420 కలెక్షన్. సాయంత్రం రద్దీ ఎక్కువ.",
    eyesFreeRetentionAlert: "రాజేష్ గారు గత 22 రోజులుగా రాలేదు. ₹30 ఆఫర్ పంపమంటారా?",
    btnCampaign: "వాట్సాప్ ఆఫర్‌తో అమ్మకాలు పెంచండి",
    btnLaunchEyesFree: "🎙️ వాయిస్ డెమో ప్రారంభించండి (Scenario 3)",
  },
  Tamil: {
    tag: "Paytm சவுண்ட்பாக்ஸ் நுண்ணறிவு செயலில் உள்ளது",
    subtag: "நேரடி கடை பகுப்பாய்வு",
    greeting: "வணக்கம், சர்மா ஜெனரல் ஸ்டோர்! 🙏",
    summary: (col) => <>நேற்று உங்கள் கடையின் வசூல் <strong className="text-white">{col}</strong>. மாலை 7 மணிக்கு அதிக வாடிக்கையாளர்கள் வந்தனர்.</>,
    btnBriefing: "கடை சுருக்கம் கேளுங்கள் (30s)",
    btnCopilot: "AI வழிகாட்டியிடம் கேளுங்கள்",
    copilotPrompt: "கடந்த மாதத்தை விட இன்றைய விற்பனை எப்படி உள்ளது?",
    kpiNetRevenue: "நிகர வசூல்",
    kpiTotalBills: "மொத்த பில்கள் (UPI)",
    kpiAOV: "சராசரி பில் மதிப்பு",
    kpiRepeat: "மீண்டும் வரும் வாடிக்கையாளர்கள்",
    kpiVsPrior: "முந்தைய காலத்தை விட",
    kpiVerified: "சரிபார்க்கப்பட்ட ரசீதுகள்",
    kpiSteadyBasket: "சீரான விற்பனை",
    kpiHighLoyalty: "வாடிக்கையாளர் விசுவாசம்",
    chartTitle: "தினசரி வசூல் வேகம் மற்றும் அளவு",
    chartSub: "180 நாள் தொடர்ச்சியான கணக்கு",
    eyesFreeTitle: "ஸ்கிரீன்-ஃப்ரீ வாய்ஸ் அசிஸ்டண்ட்",
    eyesFreeBadge: "பாரத் அணுகல் AI",
    eyesFreePersona: "வெங்கட் அவர்கள் (58 வயது • பார்வைக் குறைபாடுள்ள வணிகர்)",
    eyesFreeQuery: "இன்று மொத்த வசூல் எவ்வளவு?",
    eyesFreeResponse: "85 பரிவர்த்தனைகள் • ₹9,420 வசூல். மாலையில் கூட்டம் அதிகம்.",
    eyesFreeRetentionAlert: "ராஜேஷ் அவர்கள் 22 நாட்களாக வரவில்லை. சலுகை அனுப்பவா?",
    btnCampaign: "வாட்ஸ்அப் சலுகை மூலம் விற்பனையை அதிகரிக்கவும்",
    btnLaunchEyesFree: "🎙️ வாய்ஸ் டெமோ தொடங்கவும் (Scenario 3)",
  },
  Kannada: {
    tag: "Paytm ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ಸಕ್ರಿಯವಾಗಿದೆ",
    subtag: "ಲೈವ್ ಸ್ಟೋರ್ ಅನಾಲಿಟಿಕ್ಸ್",
    greeting: "ನಮಸ್ಕಾರ, ಶರ್ಮಾ ಜನರಲ್ ಸ್ಟೋರ್! 🙏",
    summary: (col) => <>ನಿನ್ನೆ ನಿಮ್ಮ ಅಂಗಡಿಯ ಸಂಗ್ರಹ <strong className="text-white">{col}</strong> ಆಗಿದೆ. ಸಂಜೆ 7 ಗಂಟೆಗೆ ಗರಿಷ್ಠ ವ್ಯಾಪಾರ ದಾಖಲಾಗಿದೆ.</>,
    btnBriefing: "ಅಂಗಡಿ ವಿವರಣೆ ಆಲಿಸಿ (30s)",
    btnCopilot: "AI ಕೋಪೈಲಟ್ ಅನ್ನು ಕೇಳಿ",
    copilotPrompt: "ಕಳೆದ ತಿಂಗಳಿಗೆ ಹೋಲಿಸಿದರೆ ನನ್ನ ವ್ಯಾಪಾರ ಹೇಗಿದೆ?",
    kpiNetRevenue: "ನಿವ್ವಳ ಸಂಗ್ರಹ",
    kpiTotalBills: "ಒಟ್ಟು ಬಿಲ್‌ಗಳು (UPI)",
    kpiAOV: "ಸರಾಸರಿ ಬಿಲ್ ಮೌಲ್ಯ",
    kpiRepeat: "ನಿಯಮಿತ ಗ್ರಾಹಕರು",
    kpiVsPrior: "ಹಿಂದಿನ ಅವಧಿಗೆ ಹೋಲಿಸಿದರೆ",
    kpiVerified: "ದೃಢೀಕರಿಸಿದ ಬಿಲ್‌ಗಳು",
    kpiSteadyBasket: "ಸ್ಥಿರ ಬಿಲ್ ಗಾತ್ರ",
    kpiHighLoyalty: "ಗ್ರಾಹಕರ ನಿಷ್ಠೆ",
    chartTitle: "ದೈನಂದಿನ ಸಂಗ್ರಹ ವೇಗ ಮತ್ತು ಪ್ರಮಾಣ",
    chartSub: "180 ದಿನಗಳ ನಿರಂತರ ಲೆಡ್ಜರ್",
    eyesFreeTitle: "ಸ್ಕ್ರೀನ್-ಫ್ರೀ ವಾಯ್ಸ್ ಸಹಾಯಕ",
    eyesFreeBadge: "ಭಾರತ ಪ್ರವೇಶಿಸುವಿಕೆ AI",
    eyesFreePersona: "ವೆಂಕಟ್ ಅವರು (58 ವರ್ಷ • ದೃಷ್ಟಿ ದೋಷವಿರುವ ಅಂಗಡಿಯವರು)",
    eyesFreeQuery: "ಇಂದು ಒಟ್ಟು ಎಷ್ಟು ಕಲೆಕ್ಷನ್ ಆಗಿದೆ?",
    eyesFreeResponse: "85 ವಹಿವಾಟುಗಳು • ₹9,420 ಸಂಗ್ರಹ. ಸಂಜೆ ವ್ಯಾಪಾರ ಹೆಚ್ಚು.",
    eyesFreeRetentionAlert: "ರಾಜೇಶ್ 22 ದಿನಗಳಿಂದ ಬಂದಿಲ್ಲ. ಆಫರ್ ಕಳುಹಿಸಬೇಕೆ?",
    btnCampaign: "ವಾಟ್ಸಾಪ್ ಆಫರ್‌ನೊಂದಿಗೆ ಮಾರಾಟ ಹೆಚ್ಚಿಸಿ",
    btnLaunchEyesFree: "🎙️ ಧ್ವನಿ ಡೆಮೊ ಪ್ರಾರಂಭಿಸಿ (Scenario 3)",
  },
  English: {
    tag: "Paytm Soundbox Intelligence Active",
    subtag: "Live Store Analytics",
    greeting: "Welcome, Sharma General Store! 🙏",
    summary: (col) => <>Yesterday your store collection was <strong className="text-white">{col}</strong>. Peak footfall was recorded at 7:00 PM.</>,
    btnBriefing: "Listen to Store Briefing (30s)",
    btnCopilot: "Ask AI Copilot",
    copilotPrompt: "How does my sales compare to last month?",
    kpiNetRevenue: "Net Collection",
    kpiTotalBills: "Total Bills (UPI)",
    kpiAOV: "Average Bill Size",
    kpiRepeat: "Repeat Footfall",
    kpiVsPrior: "vs prior period",
    kpiVerified: "verified receipts",
    kpiSteadyBasket: "Steady basket size",
    kpiHighLoyalty: "High Dukaan Loyalty",
    chartTitle: "Daily Collection Velocity & Volume",
    chartSub: "180-day continuous ledger calculated deterministically",
    eyesFreeTitle: "Eyes-Free Voice Copilot",
    eyesFreeBadge: "Inclusive Bharat AI",
    eyesFreePersona: "Venkat ji (58 yrs • Low Vision Store Owner, Hyderabad)",
    eyesFreeQuery: "How much was today's total collection?",
    eyesFreeResponse: "85 Transactions • ₹9,420 Collection. Peak rush evening.",
    eyesFreeRetentionAlert: "Rajesh hasn't visited in 22 days. Send ₹30 coupon?",
    btnCampaign: "Boost Sales with WhatsApp Offer",
    btnLaunchEyesFree: "🎙️ Launch Eyes-Free Voice Demo (Scenario 3)",
  },
  Hinglish: {
    tag: "Paytm Soundbox Intelligence Active",
    subtag: "Live Store Analytics",
    greeting: "Namaste, Sharma General Store! 🙏",
    summary: (col) => <>Kal aapki dukaan ka collection <strong className="text-white">{col}</strong> raha. Shaam 7 baje peak footfall dekha gaya.</>,
    btnBriefing: "Listen to Dukaan Briefing (30s)",
    btnCopilot: "Ask AI Copilot",
    copilotPrompt: "Pichle hafte se compare karke batao business kaisa hai?",
    kpiNetRevenue: "Net Collection",
    kpiTotalBills: "Total Bills (UPI)",
    kpiAOV: "Average Bill Size",
    kpiRepeat: "Repeat Footfall",
    kpiVsPrior: "vs prior period",
    kpiVerified: "verified receipts",
    kpiSteadyBasket: "Steady basket size",
    kpiHighLoyalty: "High Dukaan Loyalty",
    chartTitle: "Daily Collection Velocity & Volume",
    chartSub: "180-day continuous ledger calculated deterministically",
    eyesFreeTitle: "Eyes-Free Voice Copilot",
    eyesFreeBadge: "Inclusive Bharat AI",
    eyesFreePersona: "Venkat ji (58 yrs • Low Vision Store Owner, Hyderabad)",
    eyesFreeQuery: "Aaj kul kitna collection hua?",
    eyesFreeResponse: "85 Transactions • ₹9,420 Collection. Shaam ko rush tha.",
    eyesFreeRetentionAlert: "Rajesh ji 22 din se nahi aaye. ₹30 ka offer bhejein?",
    btnCampaign: "WhatsApp Offer se Sales Badhayein",
    btnLaunchEyesFree: "🎙️ Launch Eyes-Free Voice Demo (Scenario 3)",
  },
};

export const OverviewTab: React.FC<OverviewTabProps> = ({
  overview,
  trends,
  onOpenSoundbox,
  onOpenCopilot,
  onOpenCampaigns,
  language = "Hinglish",
}) => {
  const content = OVERVIEW_CONTENT[language] || OVERVIEW_CONTENT.Hinglish;
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");
  const [isEyesFreeModalOpen, setIsEyesFreeModalOpen] = useState<boolean>(false);

  const totalRev = overview?.total_revenue ?? 482500;
  const revGrowth = overview?.revenue_growth_pct ?? 14.2;
  const totalTxns = overview?.total_transactions ?? 1420;
  const aov = overview?.avg_order_value ?? 340;
  const repeatRate = overview?.repeat_customer_rate ?? 68.4;

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner + Audio Soundbox Callout */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#002E6E] via-[#0A1120] to-[#002E6E] p-6 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="rounded-full bg-[#00BAF2]/20 px-2.5 py-0.5 text-xs font-semibold text-[#00BAF2] border border-[#00BAF2]/40">
                {content.tag}
              </span>
              <span className="text-xs text-slate-300">{content.subtag}</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">
              {content.greeting}
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              {content.summary("₹18,450")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenSoundbox}
              className="flex items-center space-x-2 rounded-xl bg-[#00BAF2] px-4 py-2.5 text-xs font-bold text-[#0A1120] hover:bg-[#38c9f5] transition-all shadow-md active:scale-95"
            >
              <Zap className="h-4 w-4 fill-current" />
              <span>{content.btnBriefing}</span>
            </button>
            <button
              onClick={() => onOpenCopilot(content.copilotPrompt)}
              className="flex items-center space-x-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-all active:scale-95 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-[#00BAF2]" />
              <span>{content.btnCopilot}</span>
            </button>
          </div>
        </div>

        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-[#00BAF2]/10 blur-3xl" />
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Revenue */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">{content.kpiNetRevenue}</span>
            <div className="rounded-lg bg-blue-50 p-2 text-[#002E6E]">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-[#0A1120]">
              {formatINR(totalRev)}
            </span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs">
            {revGrowth >= 0 ? (
              <span className="flex items-center font-bold text-emerald-600">
                <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +{revGrowth}%
              </span>
            ) : (
              <span className="flex items-center font-bold text-red-600">
                <TrendingDown className="h-3.5 w-3.5 mr-0.5" /> {revGrowth}%
              </span>
            )}
            <span className="text-slate-400">{content.kpiVsPrior}</span>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">{content.kpiTotalBills}</span>
            <div className="rounded-lg bg-cyan-50 p-2 text-[#00BAF2]">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-[#0A1120]">
              {totalTxns.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs">
            <span className="flex items-center font-bold text-emerald-600">
              <TrendingUp className="h-3.5 w-3.5 mr-0.5" /> +8.4%
            </span>
            <span className="text-slate-400">{content.kpiVerified}</span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">{content.kpiAOV}</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-[#0A1120]">
              {formatINR(aov)}
            </span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-slate-500">
            <span>{content.kpiSteadyBasket}</span>
          </div>
        </div>

        {/* Repeat Customer Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">{content.kpiRepeat}</span>
            <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold tracking-tight text-[#0A1120]">
              {repeatRate}%
            </span>
          </div>
          <div className="mt-2 flex items-center space-x-1.5 text-xs text-emerald-600 font-semibold">
            <span>{content.kpiHighLoyalty}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Revenue Trend Chart + Scenario 3 Eyes-Free Voice Copilot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recharts Daily Revenue Velocity */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-[#0A1120]">
                {content.chartTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {content.chartSub}
              </p>
            </div>
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              {(["7d", "30d", "90d"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeframe(t)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timeframe === t
                      ? "bg-white text-[#002E6E] shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends.slice(timeframe === "7d" ? -7 : timeframe === "30d" ? -30 : -90)}>
                <defs>
                  <linearGradient id="paytmRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#002E6E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00BAF2" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => v.slice(5)}
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(v) => formatCompactINR(v)}
                  tick={{ fontSize: 11, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: any) => [formatINR(Number(val)), "Revenue"]}
                  labelFormatter={(lbl) => `Date: ${lbl}`}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#002E6E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#paytmRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Scenario 3 - Eyes-Free Voice Operating Copilot */}
        <div className="rounded-2xl border-2 border-cyan-500/50 bg-gradient-to-b from-slate-900 via-slate-900 to-[#002E6E] p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-cyan-300">
                <EyeOff className="h-4 w-4 text-cyan-400" />
                {content.eyesFreeTitle}
              </span>
              <span className="rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 px-2.5 py-0.5 text-[11px] font-bold">
                {content.eyesFreeBadge}
              </span>
            </div>

            {/* Persona Tag */}
            <div className="mt-4 rounded-xl bg-slate-800/80 border border-slate-700/80 p-3">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Scenario 3 Store Persona:
              </span>
              <p className="mt-0.5 text-xs font-bold text-white">
                {content.eyesFreePersona}
              </p>
              <span className="text-[10px] text-cyan-300 font-semibold mt-1 block">
                • 100% Screen-Free • Native Audio Only
              </span>
            </div>

            {/* Audio Dialogue Snippet */}
            <div className="mt-4 space-y-2.5 text-xs">
              <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-2.5">
                <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <Mic className="h-3 w-3 text-cyan-400" /> Merchant Speaks Aloud:
                </span>
                <p className="mt-1 font-bold text-slate-100">&ldquo;{content.eyesFreeQuery}&rdquo;</p>
              </div>

              <div className="rounded-xl bg-cyan-950/40 border border-cyan-500/30 p-2.5">
                <span className="text-[10px] text-cyan-300 font-semibold flex items-center gap-1">
                  <Radio className="h-3 w-3 text-[#00BAF2]" /> Soundbox Voice Answer:
                </span>
                <p className="mt-1 font-semibold text-slate-200">{content.eyesFreeResponse}</p>
              </div>

              <div className="rounded-xl bg-amber-950/40 border border-amber-500/30 p-2.5">
                <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-400" /> Retention Prompt:
                </span>
                <p className="mt-0.5 text-[11px] font-medium text-amber-100">&ldquo;{content.eyesFreeRetentionAlert}&rdquo;</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEyesFreeModalOpen(true)}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-400 via-[#00BAF2] to-blue-500 py-3 text-xs font-black text-slate-950 hover:brightness-110 transition shadow-lg shadow-cyan-950/50 active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Volume2 className="h-4 w-4" />
            {content.btnLaunchEyesFree}
          </button>
        </div>
      </div>

      {/* Interactive Scenario 3: Eyes-Free Voice Copilot Modal */}
      <EyesFreeModal
        isOpen={isEyesFreeModalOpen}
        onClose={() => setIsEyesFreeModalOpen(false)}
        language={language}
      />
    </div>
  );
};
