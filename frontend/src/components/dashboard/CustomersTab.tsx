"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Crown,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  Search,
  Filter,
  Clock,
  Send,
  Sparkles,
  MessageSquare,
  MessageCircle,
  ExternalLink,
  X,
  Copy,
  Check,
} from "lucide-react";
import { apiEndpoints } from "@/lib/api";
import { CustomerCohort, CustomerProfile } from "@/lib/types";
import { formatINR } from "@/lib/utils";
import { getTranslation } from "@/lib/translations";

interface CustomersTabProps {
  onTargetSegment: (segment: string) => void;
  language?: string;
}

interface CohortDetailI18n {
  title: string;
  frequency: string;
  recency: string;
  spend: string;
  action: string;
}

interface LoyaltyCardsI18n {
  customersUnit: string;
  avgSpendLabel: string;
  frequencyLabel: string;
  recencyLabel: string;
  criteriaLabel: string;
  viewBtn: string;
  recoverBtn: string;
  promoBtn: string;
  viewAllBtn: string;
  backToCardsBtn: string;
  ledgerTitle: string;
  shoppersUnit: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerBtn: string;
  cohorts: Record<string, CohortDetailI18n>;
}

const LOYALTY_I18N: Record<string, LoyaltyCardsI18n> = {
  English: {
    customersUnit: "customers",
    avgSpendLabel: "Average spend:",
    frequencyLabel: "Visit Frequency:",
    recencyLabel: "Recency Status:",
    criteriaLabel: "Criteria:",
    viewBtn: "View",
    recoverBtn: "Recover 42",
    promoBtn: "Promo",
    viewAllBtn: "View All 600 Customers →",
    backToCardsBtn: "← Back to Cohort Cards",
    ledgerTitle: "Merchant Customer Directory",
    shoppersUnit: "Profiled Shoppers",
    bannerTitle: "Looking for individual customer records or transaction history?",
    bannerSubtitle: "Search across all 600 profiled shoppers, filter by segment, or dispatch 1-click WhatsApp retention offers.",
    bannerBtn: "Open Customer Directory (600) →",
    cohorts: {
      Champions: {
        title: "Champions",
        frequency: "3–4 visits / week",
        recency: "Active in last 7 days",
        spend: "18+ orders • Spend > ₹5,000",
        action: "VIP loyalty rewards & early festive discounts to retain highest-value patrons",
      },
      Regulars: {
        title: "Regulars",
        frequency: "1–2 visits / week",
        recency: "Active in last 21 days",
        spend: "8 to 17 orders • Spend ₹1.5k–₹5k",
        action: "Keep basket steady with weekend grocery combos & essential bundle offers",
      },
      "At Risk": {
        title: "At Risk",
        frequency: "Used to visit 1-2x/week",
        recency: "⚠️ Not seen in >21 days (Churn Alert)",
        spend: "5+ past orders • At risk of churning",
        action: "Dispatch instant ₹30 WhatsApp coupon before they switch to Quick Commerce apps",
      },
      "Occasional Walk-ins": {
        title: "Occasional Walk-ins",
        frequency: "Passing / 1st visit",
        recency: "Recent or one-time footfall",
        spend: "1 to 4 orders • Low basket size",
        action: "Welcome message with ₹15 off on next grocery bill of ₹200+ to encourage repeat footfall",
      },
    },
  },
  Hinglish: {
    customersUnit: "grahak",
    avgSpendLabel: "Ausat kharcha:",
    frequencyLabel: "Aane ki frequency:",
    recencyLabel: "Pichli visit status:",
    criteriaLabel: "Maapdand:",
    viewBtn: "Dekhein",
    recoverBtn: "Wapas Layein (42)",
    promoBtn: "Promo Bhejein",
    viewAllBtn: "Sabhi 600 Grahak Dekhein →",
    backToCardsBtn: "← Wapas Cohort Cards Par Jayein",
    ledgerTitle: "Dukandar Grahak Directory",
    shoppersUnit: "Profiled Grahak",
    bannerTitle: "Kisi grahak ka record ya pichli khareedari dekhna chahte hain?",
    bannerSubtitle: "Sabhi 600 grahakon ko khojein, segment filter karein aur 1-click me WhatsApp offer bhejein.",
    bannerBtn: "Grahak Directory Kholein (600) →",
    cohorts: {
      Champions: {
        title: "Champions (Sabse Khaas)",
        frequency: "Hafte me 3–4 baar aana",
        recency: "Pichle 7 dino me active",
        spend: "18+ orders • Kharcha > ₹5,000",
        action: "VIP reward aur tyohar par khaas discount dekar loyalty banaye rakhein",
      },
      Regulars: {
        title: "Regulars (Pakke Grahak)",
        frequency: "Hafte me 1–2 baar aana",
        recency: "Pichle 21 dino me active",
        spend: "8 se 17 orders • Kharcha ₹1.5k–₹5k",
        action: "Weekend grocery combo offer bhejkar basket size steady rakhein",
      },
      "At Risk": {
        title: "At Risk (Chhootne Wale)",
        frequency: "Pehle hafte me 1-2 baar aate the",
        recency: "⚠️ 21+ dino se nahi aaye (Alert)",
        spend: "5+ purane orders • Chhootne ka jokhim",
        action: "Turant ₹30 WhatsApp coupon bhejein isse pehle ki wo Blinkit/Zepto chale jayein",
      },
      "Occasional Walk-ins": {
        title: "Occasional (Walk-in Grahak)",
        frequency: "Raste ke / 1st visit",
        recency: "Haal me 1 baar aana",
        spend: "1 se 4 orders • Chhota basket",
        action: "Agli ₹200+ khareedari par ₹15 discount ka welcome WhatsApp sandesh bhejein",
      },
    },
  },
  Hindi: {
    customersUnit: "ग्राहक",
    avgSpendLabel: "औसत खर्च:",
    frequencyLabel: "दुकान आने की आवृत्ति:",
    recencyLabel: "अंतिम बार आने की स्थिति:",
    criteriaLabel: "मापदंड:",
    viewBtn: "देखें",
    recoverBtn: "वापस लाएं (42)",
    promoBtn: "ऑफर भेजें",
    viewAllBtn: "सभी 600 ग्राहक देखें →",
    backToCardsBtn: "← वापस कोहॉर्ट कार्ड पर जाएं",
    ledgerTitle: "दुकानदार ग्राहक डायरेक्टरी",
    shoppersUnit: "सत्यापित ग्राहक",
    bannerTitle: "क्या आप किसी ग्राहक का रिकॉर्ड या लेनदेन देखना चाहते हैं?",
    bannerSubtitle: "सभी 600 ग्राहकों को खोजें, सेगमेंट अनुसार छांटें और 1-क्लिक में व्हाट्सएप ऑफर भेजें।",
    bannerBtn: "ग्राहक डायरेक्टरी खोलें (600) →",
    cohorts: {
      Champions: {
        title: "चैंपियंस (सर्वश्रेष्ठ ग्राहक)",
        frequency: "हफ्ते में 3–4 बार आना",
        recency: "पिछले 7 दिनों में सक्रिय",
        spend: "18+ ऑर्डर • कुल खर्च > ₹5,000",
        action: "वीआईपी लॉयल्टी रिवार्ड और त्योहारी छूट देकर रिश्ता मजबूत रखें",
      },
      Regulars: {
        title: "नियमित ग्राहक (रेगुलर)",
        frequency: "हफ्ते में 1–2 बार आना",
        recency: "पिछले 21 दिनों में सक्रिय",
        spend: "8 से 17 ऑर्डर • खर्च ₹1,500-₹5,000",
        action: "वीकेंड राशन कॉम्बो ऑफर भेजकर नियमित खरीदारी बनाए रखें",
      },
      "At Risk": {
        title: "खतरे में (छूटने वाले ग्राहक)",
        frequency: "पहले हफ्ते में 1-2 बार आते थे",
        recency: "⚠️ 21+ दिनों से नहीं आए (खतरा)",
        spend: "5+ पुराने ऑर्डर • ग्राहक खोने का जोखिम",
        action: "तुरंत ₹30 का व्हाट्सएप विन-बैक कूपन भेजें, ताकि वे ब्लिंकिट/ज़ेप्टो न जाएं",
      },
      "Occasional Walk-ins": {
        title: "कदाचित आने वाले (वॉक-इन)",
        frequency: "रास्ते के ग्राहक / पहली बार आए",
        recency: "हाल ही में या एक बार आए",
        spend: "1 से 4 ऑर्डर • छोटा बिल",
        action: "अगले ₹200+ के बिल पर ₹15 छूट का स्वागत व्हाट्सएप संदेश भेजें",
      },
    },
  },
  Telugu: {
    customersUnit: "వినియోగదారులు",
    avgSpendLabel: "సగటు ఖర్చు:",
    frequencyLabel: "రాక ఫ్రీక్వెన్సీ:",
    recencyLabel: "చివరి రాక స్థితి:",
    criteriaLabel: "నిబంధన:",
    viewBtn: "చూడండి",
    recoverBtn: "మళ్లీ రప్పించండి (42)",
    promoBtn: "ఆఫర్ పంపండి",
    viewAllBtn: "మొత్తం 600 మంది కస్టమర్లను చూడండి →",
    backToCardsBtn: "← తిరిగి కార్డ్‌లకి వెళ్లండి",
    ledgerTitle: "మర్చంట్ కస్టమర్ డైరెక్టరీ",
    shoppersUnit: "ప్రొఫైల్డ్ కస్టమర్లు",
    bannerTitle: "వ్యక్తిగత కస్టమర్ రికార్డులు లేదా లావాదేవీల వివరాలు చూడాలనుకుంటున్నారా?",
    bannerSubtitle: "మొత్తం 600 మంది దుకాణదారులను శోధించండి మరియు 1-క్లిక్ వాట్సాప్ ఆఫర్‌లను పంపండి.",
    bannerBtn: "కస్టమర్ డైరెక్టరీ తెరవండి (600) →",
    cohorts: {
      Champions: {
        title: "ఛాంపియన్స్ (ముఖ్య వినియోగదారులు)",
        frequency: "వారానికి 3-4 సార్లు రాక",
        recency: "గత 7 రోజుల్లో యాక్టివ్",
        spend: "18+ ఆర్డర్లు • ఖర్చు > ₹5,000",
        action: "వీఐపీ రివార్డులు మరియు ప్రత్యేక పండుగ డిస్కౌంట్‌లతో నమ్మకాన్ని పెంచండి",
      },
      Regulars: {
        title: "రెగ్యులర్ కస్టమర్లు",
        frequency: "వారానికి 1-2 సార్లు రాక",
        recency: "గత 21 రోజుల్లో యాక్టివ్",
        spend: "8 నుండి 17 ఆర్డర్లు • ఖర్చు ₹1,500-₹5,000",
        action: "వీకెండ్ కిరాణా కాంబో ఆఫర్లతో ప్రతివారం క్రమం తప్పకుండా వచ్చేలా చేయండి",
      },
      "At Risk": {
        title: "రిస్క్‌లో ఉన్నవారు (దూరమైనవారు)",
        frequency: "గతంలో వారానికి 1-2 సార్లు వచ్చేవారు",
        recency: "⚠️ 21 రోజులుగా రాలేదు (అలర్ట్)",
        spend: "5+ మునుపటి ఆర్డర్లు • కోల్పోయే ప్రమాదం",
        action: "బ్లింకిట్/జెప్టోకి వెళ్లకుండా వెంటనే ₹30 వాట్సాప్ విన్-బ్యాక్ కూపన్ పంపండి",
      },
      "Occasional Walk-ins": {
        title: "అప్పుడప్పుడు వచ్చేవారు",
        frequency: "మొదటిసారి / అప్పుడప్పుడు",
        recency: "ఇటీవల ఒకసారి రాక",
        spend: "1 నుండి 4 ఆర్డర్లు • చిన్న బిల్లు",
        action: "తదుపరి ₹200+ కొనుగోలుపై ₹15 తగ్గింపుతో వెల్కమ్ మెసేజ్ పంపండి",
      },
    },
  },
  Tamil: {
    customersUnit: "வாடிக்கையாளர்கள்",
    avgSpendLabel: "சராசரி செலவு:",
    frequencyLabel: "வருகை இடைவெளி:",
    recencyLabel: "கடைசி வருகை நிலை:",
    criteriaLabel: "அளவுகோல்:",
    viewBtn: "பார்",
    recoverBtn: "மீட்டெடுங்கள் (42)",
    promoBtn: "சலுகை அனுப்பு",
    viewAllBtn: "அனைத்து 600 வாடிக்கையாளர்களையும் பார்க்கவும் →",
    backToCardsBtn: "← மீண்டும் கார்டுகளுக்குச் செல்லவும்",
    ledgerTitle: "வணிகர் வாடிக்கையாளர் டைரக்டரி",
    shoppersUnit: "பதிவுசெய்த வாடிக்கையாளர்கள்",
    bannerTitle: "தனிப்பட்ட வாடிக்கையாளர் விவரங்கள் அல்லது பரிவர்த்தனை வரலாறு வேண்டுமா?",
    bannerSubtitle: "அனைத்து 600 வாடிக்கையாளர்களையும் தேடுங்கள், 1-கிளிக் வாட்ஸ்அப் சலுகைகளை அனுப்புங்கள்.",
    bannerBtn: "வாடிக்கையாளர் டைரக்டரி திறக்கவும் (600) →",
    cohorts: {
      Champions: {
        title: "சாம்பியன்ஸ் (முக்கிய வாடிக்கையாளர்கள்)",
        frequency: "வாரத்திற்கு 3-4 முறை வருகை",
        recency: "கடந்த 7 நாட்களில் செயலில்",
        spend: "18+ ஆர்டர்கள் • செலவு > ₹5,000",
        action: "விஐபி சலுகைகள் மற்றும் சிறப்பு தள்ளுபடிகளை வழங்கி தக்கவையுங்கள்",
      },
      Regulars: {
        title: "வழக்கமான வாடிக்கையாளர்கள்",
        frequency: "வாரத்திற்கு 1-2 முறை வருகை",
        recency: "கடந்த 21 நாட்களில் செயலில்",
        spend: "8 முதல் 17 ஆர்டர்கள் • செலவு ₹1,500-₹5,000",
        action: "வார இறுதி மளிகை காம்போ சலுகைகள் மூலம் தொடர்ந்து வரவழையுங்கள்",
      },
      "At Risk": {
        title: "ஆபத்தில் உள்ளவர்கள் (வரத்து குறைந்தவர்கள்)",
        frequency: "முன்பு வாரத்திற்கு 1-2 முறை வந்தனர்",
        recency: "⚠️ 21+ நாட்களாக வரவில்லை (எச்சரிக்கை)",
        spend: "5+ பழைய ஆர்டர்கள் • இழக்கும் அபாயம்",
        action: "உடனடியாக ₹30 வாட்ஸ்அப் சலுகை அனுப்பி மீண்டும் கடைக்கு வரவழையுங்கள்",
      },
      "Occasional Walk-ins": {
        title: "அவ்வப்போது வருபவர்கள்",
        frequency: "முதல் முறை / எப்போதாவது",
        recency: "சமீபத்தில் ஒரு முறை வருகை",
        spend: "1 முதல் 4 ஆர்டர்கள் • குறைந்த தொகை",
        action: "அடுத்த ₹200+ வாங்குதலுக்கு ₹15 தள்ளுபடியுடன் வரவேற்பு செய்தி அனுப்புங்கள்",
      },
    },
  },
  Kannada: {
    customersUnit: "ಗ್ರಾಹಕರು",
    avgSpendLabel: "ಸರಾಸರಿ ವೆಚ್ಚ:",
    frequencyLabel: "ಭೇಟಿ ಆವರ್ತನ:",
    recencyLabel: "ಕೊನೆಯ ಭೇಟಿ ಸ್ಥಿತಿ:",
    criteriaLabel: "ಮಾನದಂಡ:",
    viewBtn: "ನೋಡಿ",
    recoverBtn: "ಮರಳಿ ತನ್ನಿ (42)",
    promoBtn: "ಆಫರ್ ಕಳುಹಿಸಿ",
    viewAllBtn: "ಎಲ್ಲಾ 600 ಗ್ರಾಹಕರನ್ನು ನೋಡಿ →",
    backToCardsBtn: "← ಕಾರ್ಡ್‌ಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
    ledgerTitle: "ವರ್ತಕರ ಗ್ರಾಹಕ ಡೈರೆಕ್ಟರಿ",
    shoppersUnit: "ದಾಖಲಿತ ಗ್ರಾಹಕರು",
    bannerTitle: "ನಿರ್ದಿಷ್ಟ ಗ್ರಾಹಕರ ವಿವರಗಳು ಅಥವಾ ವಹಿವಾಟಿನ ಇತಿಹಾಸ ನೋಡಬೇಕೆ?",
    bannerSubtitle: "ಎಲ್ಲಾ 600 ಗ್ರಾಹಕರನ್ನು ಹುಡುಕಿ ಮತ್ತು 1-ಕ್ಲಿಕ್ ವಾಟ್ಸಾಪ್ ಆಫರ್‌ಗಳನ್ನು ಕಳುಹಿಸಿ.",
    bannerBtn: "ಗ್ರಾಹಕರ ಡೈರೆಕ್ಟರಿ ತೆರೆಯಿರಿ (600) →",
    cohorts: {
      Champions: {
        title: "ಚಾಂಪಿಯನ್ಸ್ (ಪ್ರಮುಖ ಗ್ರಾಹಕರು)",
        frequency: "ವಾರಕ್ಕೆ 3-4 ಬಾರಿ ಭೇಟಿ",
        recency: "ಕಳೆದ 7 ದಿನಗಳಲ್ಲಿ ಸಕ್ರಿಯ",
        spend: "18+ ಆರ್ಡರ್‌ಗಳು • ವೆಚ್ಚ > ₹5,000",
        action: "ವಿಐಪಿ ರಿವಾರ್ಡ್‌ಗಳು ಮತ್ತು ವಿಶೇಷ ಹಬ್ಬದ ರಿಯಾಯಿತಿ ನೀಡಿ ವಿಶ್ವಾಸ ಉಳಿಸಿಕೊಳ್ಳಿ",
      },
      Regulars: {
        title: "ನಿಯಮಿತ ಗ್ರಾಹಕರು (ರೆಗ್ಯುಲರ್)",
        frequency: "ವಾರಕ್ಕೆ 1-2 ಬಾರಿ ಭೇಟಿ",
        recency: "ಕಳೆದ 21 ದಿನಗಳಲ್ಲಿ ಸಕ್ರಿಯ",
        spend: "8 ರಿಂದ 17 ಆರ್ಡರ್‌ಗಳು • ವೆಚ್ಚ ₹1,500-₹5,000",
        action: "ವಾರಾಂತ್ಯದ ದಿನಸಿ ಕಾಂಬೊ ಆಫರ್‌ಗಳೊಂದಿಗೆ ನಿರಂತರ ಖರೀದಿಗೆ ಪ್ರೇರೇಪಿಸಿ",
      },
      "At Risk": {
        title: "ಅಪಾಯದಲ್ಲಿರುವವರು (ದೂರವಾದವರು)",
        frequency: "ಹಿಂದೆ ವಾರಕ್ಕೆ 1-2 ಬಾರಿ ಬರುತ್ತಿದ್ದರು",
        recency: "⚠️ 21+ ದಿನಗಳಿಂದ ಬಂದಿಲ್ಲ (ಎಚ್ಚರಿಕೆ)",
        spend: "5+ ಹಿಂದಿನ ಆರ್ಡರ್‌ಗಳು • ದೂರವಾಗುವ ಅಪಾಯ",
        action: "ಬ್ಲಿಂಕಿಟ್/ಜೆಪ್ಟೊ ಕಡೆ ಹೋಗುವ ಮುನ್ನ ತಕ್ಷಣ ₹30 ವಾಟ್ಸಾಪ್ ಕೂಪನ್ ಕಳುಹಿಸಿ",
      },
      "Occasional Walk-ins": {
        title: "ಅಪರೂಪದ ಗ್ರಾಹಕರು",
        frequency: "ಮೊದಲ ಬಾರಿ / ಅಪರೂಪಕ್ಕೆ",
        recency: "ಇತ್ತೀಚೆಗೆ ಒಮ್ಮೆ ಭೇಟಿ",
        spend: "1 ರಿಂದ 4 ಆರ್ಡರ್‌ಗಳು • ಸಣ್ಣ ಮೊತ್ತ",
        action: "ಮುಂದಿನ ₹200+ ಖರೀದಿಗೆ ₹15 ರಿಯಾಯಿತಿಯೊಂದಿಗೆ ಸ್ವಾಗತ ಸಂದೇಶ ಕಳುಹಿಸಿ",
      },
    },
  },
};

const getCohortI18n = (lang: string, segment: string): CohortDetailI18n => {
  const dict = LOYALTY_I18N[lang] || LOYALTY_I18N.English;
  const s = segment.toLowerCase();
  if (s.includes("champion")) return dict.cohorts["Champions"];
  if (s.includes("risk")) return dict.cohorts["At Risk"];
  if (s.includes("regular")) return dict.cohorts["Regulars"];
  return dict.cohorts["Occasional Walk-ins"];
};

export const CustomersTab: React.FC<CustomersTabProps> = ({ onTargetSegment, language = "Hinglish" }) => {
  const t = getTranslation(language);
  const cardI18n = LOYALTY_I18N[language] || LOYALTY_I18N.English;
  const [cohorts, setCohorts] = useState<CustomerCohort[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [totalFiltered, setTotalFiltered] = useState<number>(0);
  const [selectedSegment, setSelectedSegment] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loadingCohorts, setLoadingCohorts] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // View Mode: "cards" (Cohort Cards Overview) vs "directory" (Customer Directory Ledger)
  const [viewMode, setViewMode] = useState<"cards" | "directory">("cards");

  // Pagination State for All 600 Shoppers
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  // Real-time Free WhatsApp Direct Dispatch State
  const [whatsappModalCustomer, setWhatsappModalCustomer] = useState<CustomerProfile | null>(null);
  const [modalPhone, setModalPhone] = useState<string>("8374360774");
  const [modalTemplate, setModalTemplate] = useState<"at_risk" | "loyalty" | "slump">("at_risk");
  const [modalMessageText, setModalMessageText] = useState<string>("");
  const [copiedLink, setCopiedLink] = useState(false);

  const buildWhatsAppMessage = (
    name: string,
    template: "at_risk" | "loyalty" | "slump",
    daysAgo: number = 22
  ) => {
    const firstName = name.split(" ")[0] || "Valued Customer";
    if (template === "at_risk") {
      return `Namaste ${firstName}-ji! 🙏

We missed you at Sharma General Store! It has been ${daysAgo > 0 ? daysAgo : 22} days since your last visit.

Here is an exclusive ₹30 OFF win-back discount on your next grocery order (above ₹199):
🎟️ Coupon Code: SAVE30
⏰ Valid for 3 days on payment via Paytm Soundbox / UPI.

Visit us today or reply here to order groceries directly!

— Abhishek, Sharma General Store (📞 8919581022)`;
    }
    if (template === "loyalty") {
      return `Namaste ${firstName}-ji! 🙏

Thank you for being one of Sharma General Store's most regular and valued customers!

As a token of our appreciation, here is an exclusive 15% VIP discount:
🎟️ Coupon Code: VIP15
⏰ Valid on your next grocery purchase via Paytm Soundbox / UPI.

Looking forward to welcoming you back!

— Abhishek, Sharma General Store (📞 8919581022)`;
    }
    return `Namaste ${firstName}-ji! 🙏

Afternoon Flash Deal at Sharma General Store! ☀️
Get 10% OFF on all grocery & dairy essentials today between 1:00 PM and 5:00 PM:
🎟️ Coupon Code: BOOST10
⏰ Just show this code at checkout on our Paytm Soundbox!

— Abhishek, Sharma General Store (📞 8919581022)`;
  };

  const openWhatsAppModal = (
    customer: CustomerProfile,
    templateOverride?: "at_risk" | "loyalty" | "slump"
  ) => {
    const chosenTemplate =
      templateOverride ||
      (customer.segment === "At Risk"
        ? "at_risk"
        : customer.segment === "Champion" || customer.segment === "Champions"
        ? "loyalty"
        : "at_risk");
    setWhatsappModalCustomer(customer);
    const rawPhone = customer.phone || "8374360774";
    setModalPhone(rawPhone);
    setModalTemplate(chosenTemplate);
    setModalMessageText(
      buildWhatsAppMessage(customer.name, chosenTemplate, customer.days_ago)
    );
    setCopiedLink(false);
  };

  const openRajeshwariDemo = () => {
    const rajeshwari =
      customers.find((c) => c.name.toLowerCase().includes("rajeshwari")) || {
        id: "demo-rajeshwari",
        name: "Rajeshwari",
        phone: "8374360774",
        masked_phone: "83****0774",
        masked_vpa: "raj***@paytm",
        segment: "At Risk",
        frequency_label: "⚠️ Inactive 22d (Used to visit 1-2x/wk)",
        days_ago: 22,
        total_orders: 14,
        total_spent: 4850.0,
        last_seen: "23 Oct 2026",
      };
    openWhatsAppModal(rajeshwari, "at_risk");
  };

  const handleTemplateChange = (tpl: "at_risk" | "loyalty" | "slump") => {
    setModalTemplate(tpl);
    if (whatsappModalCustomer) {
      setModalMessageText(
        buildWhatsAppMessage(
          whatsappModalCustomer.name,
          tpl,
          whatsappModalCustomer.days_ago
        )
      );
    }
  };

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const res = await apiEndpoints.getCohorts();
        if (res.data?.success && res.data?.data) {
          setCohorts(res.data.data);
        }
      } catch (e) {
        console.error("Failed to fetch customer cohorts:", e);
      } finally {
        setLoadingCohorts(false);
      }
    };
    fetchCohorts();
  }, []);

  const fetchCustomerList = async (
    segment: string,
    search: string,
    page: number = 1,
    size: number = 20
  ) => {
    setLoadingCustomers(true);
    try {
      const offset = (page - 1) * size;
      const res = await apiEndpoints.getCustomers({
        segment: segment === "All" ? undefined : segment,
        search: search.trim() || undefined,
        limit: size,
        offset: offset,
      });
      if (res.data?.success) {
        setCustomers(res.data.data || []);
        setTotalFiltered(res.data.total || 0);
      }
    } catch (e) {
      console.error("Failed to fetch customer list:", e);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchCustomerList(selectedSegment, searchQuery, currentPage, pageSize);
  }, [selectedSegment, currentPage, pageSize]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCustomerList(selectedSegment, searchQuery, 1, pageSize);
  };

  const openDirectoryView = (segment?: string) => {
    if (segment) {
      setSelectedSegment(segment);
      setCurrentPage(1);
    }
    setViewMode("directory");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const backToCardsView = () => {
    setViewMode("cards");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getSegmentBadge = (segment: string) => {
    const s = segment.toLowerCase();
    const info = getCohortI18n(language, segment);
    if (s.includes("champion")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5">
          <Crown className="h-3 w-3 text-amber-500" /> {info.title}
        </span>
      );
    }
    if (s.includes("risk")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-0.5">
          <AlertTriangle className="h-3 w-3 text-red-600" /> {info.title}
        </span>
      );
    }
    if (s.includes("regular")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-[#002E6E] text-[11px] font-bold px-2.5 py-0.5">
          <UserCheck className="h-3 w-3 text-[#00BAF2]" /> {info.title}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5">
        {info.title}
      </span>
    );
  };

  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const startIdx = totalFiltered === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIdx = Math.min(currentPage * pageSize, totalFiltered);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-900 border border-purple-200">
              {viewMode === "cards" ? t.customers.badge : "Customer Ledger"}
            </span>
            <span className="text-xs text-slate-500 font-medium">• 600 {cardI18n.shoppersUnit}</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1120]">
            {viewMode === "cards"
              ? t.customers.title
              : `${cardI18n.ledgerTitle} (${selectedSegment === "All" ? `600 ${cardI18n.shoppersUnit}` : getCohortI18n(language, selectedSegment).title})`}
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            {viewMode === "cards"
              ? t.customers.subtitle
              : "Search individual customer records, masked VPAs, purchase history, and dispatch 1-click WhatsApp retention offers."}
          </p>
        </div>
        {viewMode === "cards" ? (
          <button
            onClick={() => openDirectoryView("All")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#002E6E] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#002456] active:scale-95 transition cursor-pointer self-start sm:self-center whitespace-nowrap"
          >
            <Users className="h-4 w-4 text-[#00BAF2]" />
            <span>{cardI18n.viewAllBtn}</span>
          </button>
        ) : (
          <button
            onClick={backToCardsView}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 text-xs font-bold shadow-sm active:scale-95 transition cursor-pointer self-start sm:self-center whitespace-nowrap"
          >
            <ArrowLeft className="h-4 w-4 text-[#002E6E]" />
            <span>{cardI18n.backToCardsBtn}</span>
          </button>
        )}
      </div>

      {viewMode === "cards" ? (
        /* 4 Cohort Cards Grid Overview (Hidden when directory is viewed) */
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cohorts.map((c) => {
              const isAtRisk = c.segment === "At Risk";
              const isChampion = c.segment === "Champions" || c.segment === "Champion";
              const isRegular = c.segment === "Regulars" || c.segment === "Regular";
              const cohortInfo = getCohortI18n(language, c.segment);

              return (
                <div
                  key={c.segment}
                  className={`rounded-2xl border p-5 shadow-sm transition hover:shadow-md flex flex-col justify-between ${
                    isAtRisk
                      ? "border-red-300 bg-gradient-to-b from-red-50/70 to-white ring-1 ring-red-200"
                      : isChampion
                      ? "border-emerald-300 bg-gradient-to-b from-emerald-50/70 to-white ring-1 ring-emerald-200"
                      : isRegular
                      ? "border-blue-200 bg-gradient-to-b from-blue-50/40 to-white"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div>
                    {/* Header row */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        {isChampion && <Crown className="h-4 w-4 text-amber-500" />}
                        {isAtRisk && <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />}
                        {isRegular && <UserCheck className="h-4 w-4 text-[#002E6E]" />}
                        {!isChampion && !isAtRisk && !isRegular && <Users className="h-4 w-4 text-slate-500" />}
                        {cohortInfo.title}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[12px] font-extrabold ${
                          isAtRisk
                            ? "bg-red-200 text-red-900"
                            : isChampion
                            ? "bg-emerald-200 text-emerald-900"
                            : isRegular
                            ? "bg-blue-100 text-[#002E6E]"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {c.pct}%
                      </span>
                    </div>

                    {/* Counts */}
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-[#0A1120]">
                        {c.count}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{cardI18n.customersUnit}</span>
                    </div>

                    <p className="mt-1 text-xs text-slate-600 font-medium">
                      {cardI18n.avgSpendLabel} <strong className="text-slate-900">{formatINR(c.avg_spend)}</strong>
                    </p>

                    {/* Explicit Frequency & Recency Criteria Box */}
                    <div className="mt-3 rounded-lg bg-slate-50 p-2.5 border border-slate-200/80 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-semibold text-slate-500">{cardI18n.frequencyLabel}</span>
                        <strong className="text-slate-900">{cohortInfo.frequency}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-semibold text-slate-500">{cardI18n.recencyLabel}</span>
                        <span className={`font-semibold ${isAtRisk ? "text-red-700 font-bold" : "text-emerald-700"}`}>
                          {cohortInfo.recency}
                        </span>
                      </div>
                      <div className="pt-1 text-[10px] text-slate-500 border-t border-slate-200/60 font-mono">
                        {cardI18n.criteriaLabel} {cohortInfo.spend}
                      </div>
                    </div>

                    <p className="mt-3 text-[12px] text-slate-600 leading-snug">
                      {cohortInfo.action}
                    </p>
                  </div>

                  {/* Action Buttons: View Cohort in Directory + Launch Campaign */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => openDirectoryView(c.segment)}
                      className="flex-1 flex items-center justify-center space-x-1 rounded-xl py-2 px-2 text-[11px] font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer shadow-2xs"
                      title={`View ${c.count} in directory`}
                    >
                      <Users className="h-3.5 w-3.5 text-[#002E6E]" />
                      <span>{cardI18n.viewBtn} ({c.count})</span>
                    </button>
                    <button
                      onClick={() => onTargetSegment(c.segment)}
                      className={`flex-1 flex items-center justify-center space-x-1 rounded-xl py-2 px-2 text-[11px] font-bold transition active:scale-95 shadow-2xs cursor-pointer ${
                        isAtRisk
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-[#002E6E] text-white hover:bg-[#002456]"
                      }`}
                    >
                      <span>{isAtRisk ? cardI18n.recoverBtn : cardI18n.promoBtn}</span>
                      <ArrowRight className="h-3 w-3 text-current" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Nav Banner to Table */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-2xl bg-[#002E6E] flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0">
                <Users className="h-5 w-5 text-[#00BAF2]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#0A1120]">
                  {cardI18n.bannerTitle}
                </h4>
                <p className="text-xs text-slate-500">
                  {cardI18n.bannerSubtitle}
                </p>
              </div>
            </div>
            <button
              onClick={() => openDirectoryView("All")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#002E6E] hover:bg-[#002456] text-white text-xs font-bold px-4 py-2.5 shadow-sm transition active:scale-95 cursor-pointer whitespace-nowrap self-start sm:self-auto"
            >
              <Users className="h-4 w-4 text-[#00BAF2]" />
              <span>{cardI18n.bannerBtn}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Real Customer Directory Table with Filters, Search & Pagination (Cards Hidden) */
        <div id="customer-directory-section" className="space-y-4 animate-in fade-in duration-200">
          {/* Back button bar */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-2.5">
            <button
              onClick={backToCardsView}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#002E6E] hover:underline cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{cardI18n.backToCardsBtn}</span>
            </button>
            <span className="text-xs text-slate-500 font-medium">
              Filtered Cohort: <strong className="text-slate-900">{selectedSegment === "All" ? t.customers.filterAll : getCohortI18n(language, selectedSegment).title}</strong> ({totalFiltered} {cardI18n.customersUnit})
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#0A1120] flex items-center gap-2">
              <Users className="h-4 w-4 text-[#002E6E]" />
              {cardI18n.ledgerTitle} (600 {cardI18n.shoppersUnit})
            </h3>
            <p className="text-xs text-slate-500">
              Showing {customers.length} of {totalFiltered} {cardI18n.customersUnit} matching criteria • Compliant with DPDP Act 2023.
            </p>
          </div>
          <span className="text-[12px] font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1 self-start sm:self-auto">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            DPDP Masked Identifiers
          </span>
        </div>

        {/* Filter Pills + Search Input Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
          {/* Segment Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {[
              { id: "All", label: `${t.customers.filterAll} (600)` },
              { id: "Champions", label: `👑 ${cardI18n.cohorts["Champions"].title} (54)` },
              { id: "Regulars", label: `🤝 ${cardI18n.cohorts["Regulars"].title} (102)` },
              { id: "At Risk", label: `⚠️ ${cardI18n.cohorts["At Risk"].title} (42)` },
              { id: "Occasional Walk-in", label: `🚶 ${cardI18n.cohorts["Occasional Walk-ins"].title} (402)` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedSegment(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedSegment === tab.id
                    ? "bg-[#002E6E] text-white shadow-sm font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative min-w-[240px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.customers.searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#002E6E]"
            />
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          </form>
        </div>

        {/* The Customers Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">{t.customers.tableCustomer}</th>
                <th className="py-3 px-4">Masked Phone / VPA</th>
                <th className="py-3 px-4">{t.customers.tableSegment}</th>
                <th className="py-3 px-4">{t.customers.tableLastVisit}</th>
                <th className="py-3 px-4 text-center">{t.customers.tableOrders}</th>
                <th className="py-3 px-4 text-right">{t.customers.tableSpend}</th>
                <th className="py-3 px-4 text-center">{t.customers.tableAction}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {loadingCustomers ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading shoppers from ledger...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No customers found matching &quot;{searchQuery}&quot;.
                  </td>
                </tr>
              ) : (
                customers.map((c) => {
                  const isRajeshwari =
                    c.name.toLowerCase().includes("rajeshwari") ||
                    c.phone === "8374360774";

                  return (
                    <tr
                      key={c.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isRajeshwari ? "bg-amber-50/40" : ""
                      }`}
                    >
                      {/* Name */}
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span>{c.name}</span>
                          {isRajeshwari && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 animate-pulse">
                              ⭐ Demo Recipient
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Masked VPA & Phone */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-[11px] text-slate-600 font-medium">
                          {c.masked_vpa}
                        </div>
                        {isRajeshwari ? (
                          <div className="font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                            +91 8374360774 (Live)
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {c.masked_phone}
                          </div>
                        )}
                      </td>

                      {/* Segment */}
                      <td className="py-3 px-4">
                        {getSegmentBadge(c.segment)}
                      </td>

                      {/* Frequency & Recency */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[12px] font-semibold ${
                            c.segment === "At Risk"
                              ? "text-red-600"
                              : "text-slate-800"
                          }`}
                        >
                          {c.frequency_label}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          Last order: {c.last_seen}
                        </div>
                      </td>

                      {/* Total Bills */}
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                        {c.total_orders} bills
                      </td>

                      {/* Lifetime Collection */}
                      <td className="py-3 px-4 text-right font-bold text-[#002E6E]">
                        {formatINR(c.total_spent)}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openWhatsAppModal(c)}
                            className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 text-[11px] flex items-center gap-1 shadow-xs transition active:scale-95 cursor-pointer"
                            title="Open 1-Click WhatsApp Direct Message"
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span>WhatsApp</span>
                          </button>
                          <button
                            onClick={() => onTargetSegment(c.segment)}
                            className={`rounded-lg px-2 py-1 text-[11px] font-bold transition shadow-xs cursor-pointer ${
                              c.segment === "At Risk"
                                ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                            }`}
                            title="Draft campaign in Campaigns Tab"
                          >
                            Promo
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Customer Directory Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
          {/* Summary */}
          <div className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{startIdx}</strong> to{" "}
            <strong className="text-slate-900">{endIdx}</strong> of{" "}
            <strong className="text-slate-900">{totalFiltered}</strong> customers
            {selectedSegment !== "All" && (
              <span className="ml-1 text-slate-400">
                (filtered by {selectedSegment})
              </span>
            )}
          </div>

          {/* Controls: Page size selector + Page navigation buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#002E6E] cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1 || loadingCustomers}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs transition cursor-pointer"
                title="First Page"
              >
                «
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loadingCustomers}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs transition cursor-pointer"
                title="Previous Page"
              >
                ‹ Prev
              </button>

              {/* Dynamic Numbered Page Pills */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  return (
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 2
                  );
                })
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;

                  return (
                    <React.Fragment key={p}>
                      {showEllipsis && (
                        <span className="px-1 text-slate-400 select-none">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(p)}
                        disabled={loadingCustomers}
                        className={`h-7 min-w-7 px-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                          currentPage === p
                            ? "bg-[#002E6E] text-white shadow-xs"
                            : "border border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || loadingCustomers}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs transition cursor-pointer"
                title="Next Page"
              >
                Next ›
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || loadingCustomers}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs transition cursor-pointer"
                title="Last Page"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}

      {/* Interactive WhatsApp Direct Modal (100% Free wa.me Link) */}
      {whatsappModalCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* WhatsApp Green Header */}
            <div className="bg-[#075E54] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-[#128C7E] flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    Real-Time WhatsApp Dispatcher
                  </h3>
                  <p className="text-xs text-emerald-200 font-medium">
                    Merchant: Abhishek (8919581022) • Sharma General Store
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWhatsappModalCustomer(null)}
                className="rounded-full p-1.5 text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Recipient Details & Editable Phone */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">Target Recipient:</span>
                  <span className="font-extrabold text-[#002E6E] text-sm">
                    {whatsappModalCustomer.name} ({whatsappModalCustomer.segment})
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Recipient WhatsApp Mobile Number (Editable for Testing):
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 shadow-2xs focus-within:ring-2 focus-within:ring-emerald-500">
                    <span className="font-mono font-bold text-slate-500 mr-2 text-xs">+91</span>
                    <input
                      type="text"
                      value={modalPhone}
                      onChange={(e) => setModalPhone(e.target.value)}
                      placeholder="8374360774"
                      className="w-full font-mono font-bold text-sm text-slate-900 bg-transparent outline-none"
                    />
                    <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      Live Recipient
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Pre-filled with Rajeshwari&apos;s verified number. You can change it to any mobile number to test live WhatsApp dispatch.
                  </p>
                </div>
              </div>

              {/* Offer Template Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Select Offer Template:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "at_risk", code: "SAVE30", label: "₹30 Win-Back", desc: "For Inactive Shoppers" },
                    { id: "loyalty", code: "VIP15", label: "15% VIP Reward", desc: "For Top Regulars" },
                    { id: "slump", code: "BOOST10", label: "10% Flash Deal", desc: "Afternoon Rush Booster" },
                  ].map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleTemplateChange(tpl.id as any)}
                      className={`rounded-xl p-2.5 text-left border transition cursor-pointer ${
                        modalTemplate === tpl.id
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600 shadow-2xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-mono text-[10px] font-bold text-emerald-700">{tpl.code}</div>
                      <div className="text-xs font-bold">{tpl.label}</div>
                      <div className="text-[10px] text-slate-400">{tpl.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Message Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Message Copy (Editable):
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Personalized with store signature
                  </span>
                </div>
                <textarea
                  rows={7}
                  value={modalMessageText}
                  onChange={(e) => setModalMessageText(e.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-[#ECE5DD]/30 p-3.5 text-xs text-slate-800 leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <a
                    href={`https://wa.me/91${modalPhone.replace(/\D/g, "") || "8374360774"}?text=${encodeURIComponent(modalMessageText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-sm py-3.5 px-4 shadow-lg hover:shadow-xl active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer text-center"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Open in WhatsApp (wa.me) 🚀</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const clean = modalPhone.replace(/\D/g, "") || "8374360774";
                      const href = `https://wa.me/91${clean}?text=${encodeURIComponent(modalMessageText)}`;
                      navigator.clipboard.writeText(href);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2500);
                    }}
                    className="rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs py-3.5 px-4 transition active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    {copiedLink ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-500" />}
                    <span>{copiedLink ? "Link Copied!" : "Copy Link"}</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-500 text-center leading-tight">
                  ⚡ <strong>100% Free wa.me Link:</strong> Direct WhatsApp Web & App integration with zero Twilio / Meta API costs. Opens instantly on your device with pre-filled message.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
