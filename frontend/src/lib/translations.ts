/**
 * Vyapaar AI Centralized Internationalization (i18n) Engine
 * 
 * Supports all 6 Indian languages:
 * - English
 * - Hinglish
 * - Hindi (हिंदी)
 * - Telugu (తెలుగు)
 * - Tamil (தமிழ்)
 * - Kannada (ಕನ್ನಡ)
 */

export type AppLanguage = "English" | "Hinglish" | "Hindi" | "Telugu" | "Tamil" | "Kannada";

export interface AppTranslation {
  navbar: {
    brandSubtitle: string;
    storeName: string;
    city: string;
    refresh: string;
    refreshing: string;
    geminiBadge: string;
  };
  sidebar: {
    navigation: string;
    overview: string;
    soundbox: string;
    copilot: string;
    sales: string;
    customers: string;
    campaigns: string;
    profile: string;
    soundboxCardTitle: string;
    soundboxCardBadge: string;
    soundboxCardAtRisk: string;
    soundboxCardDesc: string;
  };
  soundbox: {
    headerBadge: string;
    headerSub: string;
    headerTitle: string;
    headerDesc: string;
    stage1Tab: string;
    stage1Desc: string;
    stage2Tab: string;
    stage2Desc: string;
    stage3Tab: string;
    stage3Desc: string;
    morningMetricTitle: string;
    morningMetricGrowth: string;
    peakMetricTitle: string;
    peakMetricDesc: string;
    retentionMetricTitle: string;
    retentionMetricCount: string;
    retentionMetricDesc: string;
  };
  sales: {
    badge: string;
    title: string;
    subtitle: string;
    timeframe60d: string;
    timeframe30d: string;
    timeframe7d: string;
    viewFootfall: string;
    viewRevenue: string;
    peakWindow: string;
    peakWindowTime: string;
    peakWindowDesc: string;
    slumpWindow: string;
    slumpWindowTime: string;
    slumpWindowDesc: string;
    days: string[];
    gridTimeLabel: string;
    gridDayLabel: string;
    legendPeak: string;
    legendHigh: string;
    legendMed: string;
    legendLow: string;
  };
  customers: {
    badge: string;
    title: string;
    subtitle: string;
    champions: string;
    regulars: string;
    atRisk: string;
    occasional: string;
    searchPlaceholder: string;
    filterAll: string;
    tableCustomer: string;
    tableSegment: string;
    tableOrders: string;
    tableSpend: string;
    tableLastVisit: string;
    tableAction: string;
    sendOffer: string;
    customersFound: (count: number) => string;
  };
  campaigns: {
    badge: string;
    subBadge: string;
    title: string;
    subtitle: string;
    createTitle: string;
    targetLabel: string;
    objectiveLabel: string;
    discountLabel: string;
    generateBtn: string;
    generatingBtn: string;
    previewTitle: string;
    approveBtn: string;
    approvedBadge: string;
    targetOptions: { id: string; label: string }[];
    objectiveOptions: { id: string; label: string }[];
  };
  profile: {
    badge: string;
    title: string;
    subtitle: string;
    bizType: string;
    bizTypeValue: string;
    city: string;
    cityValue: string;
    contact: string;
    upiVpa: string;
    regOn: string;
    kycVerified: string;
    dpdpCompliant: string;
    soundboxActive: string;
    langCardTitle: string;
    langCardSubtitle: string;
  };
}

export const TRANSLATIONS: Record<AppLanguage, AppTranslation> = {
  English: {
    navbar: {
      brandSubtitle: "Paytm Edition",
      storeName: "Sharma General Store",
      city: "Hyderabad",
      refresh: "Refresh",
      refreshing: "Refreshing...",
      geminiBadge: "Gemini Flash AI",
    },
    sidebar: {
      navigation: "Dukaan Navigation",
      overview: "Store Overview",
      soundbox: "AI Soundbox Briefing",
      copilot: "AI Business Copilot",
      sales: "Sales & Rush Hours",
      customers: "Customer Loyalty",
      campaigns: "WhatsApp Campaigns",
      profile: "Merchant Profile",
      soundboxCardTitle: "Soundbox Voice 4G",
      soundboxCardBadge: "Voice-First",
      soundboxCardAtRisk: "At-Risk Regulars: 42 Tracked",
      soundboxCardDesc: "Recovers lost customers via spoken morning briefing & slump hours audio alerts.",
    },
    soundbox: {
      headerBadge: "Paytm Soundbox 5.0 AI Edition",
      headerSub: "3-Stage Daily Dukaan Audio Routine",
      headerTitle: "Merchant Daily Voice Intelligence",
      headerDesc: "How the Soundbox assists the merchant throughout the day without audio spam or screen dependence.",
      stage1Tab: "1. 30-Sec Morning Briefing",
      stage1Desc: "Yesterday collection, peak rush hours & morning business motivation.",
      stage2Tab: "2. Proactive Retention Alert",
      stage2Desc: "Quiet afternoon warning: 42 at-risk regulars inactive 22d • 1-word approval.",
      stage3Tab: "3. On-Demand Spoken Query",
      stage3Desc: "Speak directly with mic or tap queries • Displays both question & answer aloud.",
      morningMetricTitle: "Morning 8:00 AM Metric",
      morningMetricGrowth: "+12.5% vs last week same day",
      peakMetricTitle: "Peak Rush Window",
      peakMetricDesc: "34 verified Soundbox UPI bills",
      retentionMetricTitle: "Customer Retention Alert",
      retentionMetricCount: "42 At-Risk Regulars",
      retentionMetricDesc: "Inactive >21 days • ₹14,200 monthly recoverable",
    },
    sales: {
      badge: "Dukaan Footfall Matrix",
      title: "Sales Velocity & Peak Hours Intelligence",
      subtitle: "Analyzes your Paytm Soundbox payment timestamps by Hour of Day and Day of Week to pinpoint when to prep fast-moving stock and schedule extra counter helpers.",
      timeframe60d: "60-Day Season (Sep–Nov 2026)",
      timeframe30d: "Last 30 Days",
      timeframe7d: "7-Day Week (Nov 2026)",
      viewFootfall: "Customer Footfall (Bills)",
      viewRevenue: "Collection Volume (₹)",
      peakWindow: "Verified Peak Rush Window",
      peakWindowTime: "7:00 PM – 8:00 PM",
      peakWindowDesc: "Average 34 verified UPI bills per hour. Staff counters fully during this window.",
      slumpWindow: "Afternoon Slump Window",
      slumpWindowTime: "1:30 PM – 3:30 PM",
      slumpWindowDesc: "Footfall drops below 5 bills/hr. Ideal window for Soundbox customer retention alerts.",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      gridTimeLabel: "Hour of Day (7:00 AM – 9:00 PM)",
      gridDayLabel: "Day of Week",
      legendPeak: "Peak Rush (>20 bills)",
      legendHigh: "High Rush (14–19 bills)",
      legendMed: "Moderate (8–13 bills)",
      legendLow: "Quiet (<8 bills)",
    },
    customers: {
      badge: "Paytm VPA Loyalty Ledger",
      title: "Customer Loyalty & RFM Retention",
      subtitle: "Segments verified Soundbox UPI customers by Recency, Frequency, and Monetary spend to stop customer churn before it happens.",
      champions: "Champions",
      regulars: "Regular Customers",
      atRisk: "At-Risk (Churn Alert)",
      occasional: "Occasional Walk-ins",
      searchPlaceholder: "Search customer by phone or VPA...",
      filterAll: "All Customers",
      tableCustomer: "Customer Identifier",
      tableSegment: "Loyalty Tier",
      tableOrders: "Verified UPI Bills",
      tableSpend: "Total Lifetime Spend",
      tableLastVisit: "Last Seen",
      tableAction: "Action",
      sendOffer: "Send Offer",
      customersFound: (count) => `Showing ${count} verified customers`,
    },
    campaigns: {
      badge: "WhatsApp Growth Marketing Engine",
      subBadge: "1-Click Customer Re-engagement",
      title: "Targeted WhatsApp Micro-Campaigns",
      subtitle: "Transform transaction data anomalies into personalized WhatsApp discount broadcasts.",
      createTitle: "Generate AI WhatsApp Campaign",
      targetLabel: "Target Customer Cohort",
      objectiveLabel: "Campaign Objective",
      discountLabel: "Discount Coupon Percentage",
      generateBtn: "Generate WhatsApp Campaign",
      generatingBtn: "Drafting Personalized WhatsApp Copy...",
      previewTitle: "Live WhatsApp Preview (Merchant Store)",
      approveBtn: "Approve & Dispatch via WhatsApp",
      approvedBadge: "Dispatched to Customers",
      targetOptions: [
        { id: "At Risk Inactive Customers", label: "At-Risk Regulars (Inactive 21+ Days)" },
        { id: "High Value Champions", label: "Champions & VIPs (Top 10% Spenders)" },
        { id: "Occasional Walk-ins", label: "Occasional Walk-ins (Convert to Regulars)" },
      ],
      objectiveOptions: [
        { id: "Retention", label: "Customer Retention (Win Back Lost Shoppers)" },
        { id: "Reward Loyalty", label: "VIP Reward (Thank You Discount)" },
        { id: "Festive Clearance", label: "Weekend Stock Clearance" },
      ],
    },
    profile: {
      badge: "Merchant Profile & Settings",
      title: "Store Profile & Preferences",
      subtitle: "Manage your store details and AI copilot language preference.",
      bizType: "Business Type",
      bizTypeValue: "Kirana & General Retail",
      city: "City",
      cityValue: "Hyderabad, Telangana",
      contact: "Contact Phone",
      upiVpa: "Soundbox UPI / VPA",
      regOn: "Merchant Platform",
      kycVerified: "KYC Verified",
      dpdpCompliant: "DPDP Compliant",
      soundboxActive: "Soundbox Active",
      langCardTitle: "Application & Voice Language",
      langCardSubtitle: "Switch the entire dashboard, voice briefing, and AI Copilot into your preferred language.",
    },
  },

  Hinglish: {
    navbar: {
      brandSubtitle: "Paytm Edition",
      storeName: "Sharma General Store",
      city: "Hyderabad",
      refresh: "Refresh",
      refreshing: "Refresh ho raha hai...",
      geminiBadge: "Gemini Flash AI",
    },
    sidebar: {
      navigation: "Dukaan Navigation",
      overview: "Store Overview",
      soundbox: "AI Soundbox Briefing",
      copilot: "AI Business Copilot",
      sales: "Sales & Rush Hours",
      customers: "Customer Loyalty",
      campaigns: "WhatsApp Campaigns",
      profile: "Merchant Profile",
      soundboxCardTitle: "Soundbox Voice 4G",
      soundboxCardBadge: "Voice-First",
      soundboxCardAtRisk: "At-Risk Regulars: 42 Tracked",
      soundboxCardDesc: "Subah ki audio report aur dopahar ke voice alert se grahakon ko wapas bulata hai.",
    },
    soundbox: {
      headerBadge: "Paytm Soundbox 5.0 AI Edition",
      headerSub: "3-Stage Daily Dukaan Audio Routine",
      headerTitle: "Merchant Daily Voice Intelligence",
      headerDesc: "Dukaan par poore din bina screen aur bina audio spam ke Soundbox guidance.",
      stage1Tab: "1. 30-Sec Morning Briefing",
      stage1Desc: "Kal ka collection, peak rush hours aur subah ki dhandha report.",
      stage2Tab: "2. Proactive Retention Alert",
      stage2Desc: "Dopahar me 42 regular grahakon ke liye 1-word spoken approval.",
      stage3Tab: "3. On-Demand Spoken Query",
      stage3Desc: "Mic se seedhe bolein ya query tap karein • Sawaal aur jawaab dono bolkar batayega.",
      morningMetricTitle: "Subah 8:00 AM Metric",
      morningMetricGrowth: "Pichle hafte se +12.5% behtar",
      peakMetricTitle: "Peak Rush Window",
      peakMetricDesc: "34 verified Soundbox UPI bills",
      retentionMetricTitle: "Customer Retention Alert",
      retentionMetricCount: "42 At-Risk Regulars",
      retentionMetricDesc: "21+ dino se inactive • ₹14,200 monthly recovery",
    },
    sales: {
      badge: "Dukaan Footfall Matrix",
      title: "Sales Velocity & Peak Hours Intelligence",
      subtitle: "Paytm Soundbox payment timestamps ko analyse karke batata hai ki dukaan par kab sabse zyada bheed hogi aur extra help kab chahiye.",
      timeframe60d: "60-Day Season (Sep–Nov 2026)",
      timeframe30d: "Pichle 30 Din",
      timeframe7d: "7-Day Week (Nov 2026)",
      viewFootfall: "Grahak Bheed (Bills)",
      viewRevenue: "Collection Volume (₹)",
      peakWindow: "Verified Peak Rush Window",
      peakWindowTime: "Shaam 7:00 PM – 8:00 PM",
      peakWindowDesc: "Average 34 verified UPI bills per hour. Iss time counter par poori tayyari rakhein.",
      slumpWindow: "Afternoon Slump Window",
      slumpWindowTime: "Dopahar 1:30 PM – 3:30 PM",
      slumpWindowDesc: "Footfall 5 bills/hr se kam hota hai. Soundbox retention offers ke liye best time.",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      gridTimeLabel: "Din ke Ghante (7:00 AM – 9:00 PM)",
      gridDayLabel: "Hafte ke Din",
      legendPeak: "Sabse Zyada Bheed (>20 bills)",
      legendHigh: "Acchi Bheed (14–19 bills)",
      legendMed: "Medium Bheed (8–13 bills)",
      legendLow: "Kam Bheed (<8 bills)",
    },
    customers: {
      badge: "Paytm VPA Loyalty Ledger",
      title: "Customer Loyalty & RFM Retention",
      subtitle: "Verified Soundbox UPI customers ko Recency, Frequency aur Spend ke hisaab se segment karta hai taaki grahak tootne se bachein.",
      champions: "Champions (VIP Grahak)",
      regulars: "Regular Grahak",
      atRisk: "At-Risk (Tootne Wale)",
      occasional: "Occasional Walk-ins",
      searchPlaceholder: "Phone ya VPA se customer search karein...",
      filterAll: "Sabhi Grahak",
      tableCustomer: "Grahak Pehchan",
      tableSegment: "Loyalty Category",
      tableOrders: "Verified UPI Bills",
      tableSpend: "Kul Kharidari",
      tableLastVisit: "Aakhri Baar Aaye",
      tableAction: "Action",
      sendOffer: "Offer Bhejo",
      customersFound: (count) => `${count} verified grahak dikh rahe hain`,
    },
    campaigns: {
      badge: "WhatsApp Growth Marketing Engine",
      subBadge: "1-Click Customer Re-engagement",
      title: "Targeted WhatsApp Micro-Campaigns",
      subtitle: "Transaction data se personalized WhatsApp discount coupons dispatch karein.",
      createTitle: "Generate AI WhatsApp Campaign",
      targetLabel: "Target Grahak Category",
      objectiveLabel: "Campaign Objective",
      discountLabel: "Discount Coupon Percentage",
      generateBtn: "WhatsApp Offer Banao",
      generatingBtn: "Personalized WhatsApp Copy ban raha hai...",
      previewTitle: "Live WhatsApp Preview (Merchant Store)",
      approveBtn: "Approve & WhatsApp par Bhejo",
      approvedBadge: "Grahakon ko Bhej Diya Gaya",
      targetOptions: [
        { id: "At Risk Inactive Customers", label: "At-Risk Regulars (21+ Dino se nahi aaye)" },
        { id: "High Value Champions", label: "Champions & VIPs (Sabse Zyada Kharidari)" },
        { id: "Occasional Walk-ins", label: "Occasional Walk-ins (Regular Banane ke liye)" },
      ],
      objectiveOptions: [
        { id: "Retention", label: "Customer Retention (Chhoote Grahak Wapas Bulao)" },
        { id: "Reward Loyalty", label: "VIP Reward (Loyalty Discount)" },
        { id: "Festive Clearance", label: "Weekend Stock Clearance" },
      ],
    },
    profile: {
      badge: "Merchant Profile & Settings",
      title: "Store Profile & Preferences",
      subtitle: "Dukaan details aur AI language preference manage karein.",
      bizType: "Business Type",
      bizTypeValue: "Kirana & General Retail",
      city: "City",
      cityValue: "Hyderabad, Telangana",
      contact: "Contact Phone",
      upiVpa: "Soundbox UPI / VPA",
      regOn: "Merchant Platform",
      kycVerified: "KYC Verified",
      dpdpCompliant: "DPDP Compliant",
      soundboxActive: "Soundbox Active",
      langCardTitle: "Application & Voice Language",
      langCardSubtitle: "Poore dashboard, voice briefing aur AI Copilot ko apni pasandida bhasha mein switch karein.",
    },
  },

  Hindi: {
    navbar: {
      brandSubtitle: "पेटीएम एडिशन",
      storeName: "शर्मा जनरल स्टोर",
      city: "हैदराबाद",
      refresh: "रिफ्रेश",
      refreshing: "रिफ्रेश हो रहा है...",
      geminiBadge: "जेमिनी फ्लैश AI",
    },
    sidebar: {
      navigation: "दुकान नेविगेशन",
      overview: "दुकान अवलोकन",
      soundbox: "AI साउंडबॉक्स ब्रीफिंग",
      copilot: "AI बिजनेस कोपायलट",
      sales: "बिक्री और व्यस्त घंटे",
      customers: "ग्राहक निष्ठा (RFM)",
      campaigns: "व्हाट्सएप अभियान",
      profile: "व्यापारी प्रोफाइल",
      soundboxCardTitle: "साउंडबॉक्स वॉयस 4G",
      soundboxCardBadge: "वॉयस-फर्स्ट",
      soundboxCardAtRisk: "छूटे हुए ग्राहक: 42 ट्रैक",
      soundboxCardDesc: "सुबह की ऑडियो रिपोर्ट और दोपहर के वॉयस अलर्ट से ग्राहकों को वापस लाता है।",
    },
    soundbox: {
      headerBadge: "पेटीएम साउंडबॉक्स 5.0 AI एडिशन",
      headerSub: "3-चरणीय दैनिक दुकान ऑडियो रूटीन",
      headerTitle: "दुकानदार दैनिक वॉयस इंटेलिजेंस",
      headerDesc: "साउंडबॉक्स दिन भर बिना स्क्रीन और बिना ऑडियो स्पैम के दुकानदार की मदद करता है।",
      stage1Tab: "1. 30-सेकंड सुबह की ब्रीफिंग",
      stage1Desc: "कल का कलेक्शन, व्यस्त समय और सुबह की बिक्री प्रेरणा।",
      stage2Tab: "2. ग्राहक वापसी वॉयस अलर्ट",
      stage2Desc: "दोपहर में 42 छूटे नियमित ग्राहकों के लिए 1-शब्द वॉयस कूपन।",
      stage3Tab: "3. ऑन-डिमांड वॉयस सवाल",
      stage3Desc: "माइक से सीधे बोलकर पूछें • सवाल और जवाब दोनों बोलकर बताएगा।",
      morningMetricTitle: "सुबह 8:00 बजे का कलेक्शन",
      morningMetricGrowth: "पिछले हफ्ते से +12.5% अधिक",
      peakMetricTitle: "व्यस्ततम समय (Peak Window)",
      peakMetricDesc: "34 सत्यापित साउंडबॉक्स UPI बिल",
      retentionMetricTitle: "ग्राहक वापसी अलर्ट",
      retentionMetricCount: "42 नियमित ग्राहक जोखिम में",
      retentionMetricDesc: "21+ दिनों से नहीं आए • ₹14,200 मासिक रिकवरी",
    },
    sales: {
      badge: "दुकान फुटफॉल मैट्रिक्स",
      title: "बिक्री रफ्तार और व्यस्त समय विश्लेषण",
      subtitle: "पेटीएम साउंडबॉक्स पेमेंट समय का विश्लेषण करके बताता है कि कब काउंटर पर सबसे ज्यादा भीड़ होगी और अतिरिक्त मदद की जरूरत होगी।",
      timeframe60d: "60-दिन सीजन (सितंबर–नवंबर 2026)",
      timeframe30d: "पिछले 30 दिन",
      timeframe7d: "7-दिन सप्ताह (नवंबर 2026)",
      viewFootfall: "ग्राहक संख्या (बिल)",
      viewRevenue: "कलेक्शन राशि (₹)",
      peakWindow: "सत्यापित व्यस्ततम समय",
      peakWindowTime: "शाम 7:00 – 8:00 बजे",
      peakWindowDesc: "औसतन 34 सत्यापित UPI बिल प्रति घंटा। इस समय काउंटर पर पूरी तैयारी रखें।",
      slumpWindow: "दोपहर का शांत समय",
      slumpWindowTime: "दोपहर 1:30 – 3:30 बजे",
      slumpWindowDesc: "ग्राहक संख्या 5 बिल/घंटा से कम। साउंडबॉक्स ग्राहक वापसी अलर्ट के लिए सबसे सही समय।",
      days: ["सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार", "रविवार"],
      gridTimeLabel: "दिन का समय (सुबह 7:00 – रात 9:00)",
      gridDayLabel: "सप्ताह के दिन",
      legendPeak: "सर्वाधिक भीड़ (>20 बिल)",
      legendHigh: "अधिक भीड़ (14–19 बिल)",
      legendMed: "मध्यम भीड़ (8–13 बिल)",
      legendLow: "शांत समय (<8 बिल)",
    },
    customers: {
      badge: "पेटीएम VPA ग्राहक लेजर",
      title: "ग्राहक निष्ठा और RFM ग्राहक वापसी",
      subtitle: "ग्राहकों के आने की आवृत्ति और खर्च के आधार पर वर्गीकरण ताकि पुराने नियमित ग्राहक दुकान छोड़ कर न जाएं।",
      champions: "चैंपियंस (शीर्ष ग्राहक)",
      regulars: "नियमित ग्राहक",
      atRisk: "जोखिम में (छूटने वाले)",
      occasional: "आकस्मिक ग्राहक",
      searchPlaceholder: "फोन या VPA से ग्राहक खोजें...",
      filterAll: "सभी ग्राहक",
      tableCustomer: "ग्राहक पहचान",
      tableSegment: "निष्ठा वर्ग",
      tableOrders: "सत्यापित बिल",
      tableSpend: "कुल खर्च",
      tableLastVisit: "अंतिम बार आए",
      tableAction: "कार्रवाई",
      sendOffer: "ऑफर भेजें",
      customersFound: (count) => `${count} सत्यापित ग्राहक दिखाए जा रहे हैं`,
    },
    campaigns: {
      badge: "व्हाट्सएप ग्रोथ मार्केटिंग",
      subBadge: "1-क्लिक ग्राहक वापसी",
      title: "लक्षित व्हाट्सएप माइक्रो-अभियान",
      subtitle: "लेनदेन के आंकड़ों के आधार पर ग्राहकों को व्यक्तिगत व्हाट्सएप डिस्काउंट कूपन भेजें।",
      createTitle: "नया AI व्हाट्सएप ऑफर बनाएं",
      targetLabel: "लक्षित ग्राहक वर्ग",
      objectiveLabel: "अभियान का उद्देश्य",
      discountLabel: "डिस्काउंट कूपन प्रतिशत",
      generateBtn: "व्हाट्सएप ऑफर तैयार करें",
      generatingBtn: "व्हाट्सएप संदेश तैयार हो रहा है...",
      previewTitle: "लाइव व्हाट्सएप संदेश पूर्वावलोकन",
      approveBtn: "स्वीकार करें और व्हाट्सएप पर भेजें",
      approvedBadge: "ग्राहकों को भेज दिया गया",
      targetOptions: [
        { id: "At Risk Inactive Customers", label: "छूटे हुए ग्राहक (21+ दिनों से नहीं आए)" },
        { id: "High Value Champions", label: "चैंपियंस और VIP ग्राहक (सर्वाधिक खर्च)" },
        { id: "Occasional Walk-ins", label: "आकस्मिक ग्राहक (नियमित बनाने हेतु)" },
      ],
      objectiveOptions: [
        { id: "Retention", label: "ग्राहक वापसी (छूटे हुए ग्राहकों को वापस लाएं)" },
        { id: "Reward Loyalty", label: "VIP आभार डिस्काउंट" },
        { id: "Festive Clearance", label: "सप्ताहांत स्टॉक क्लीयरेंस" },
      ],
    },
    profile: {
      badge: "व्यापारी प्रोफाइल और सेटिंग्स",
      title: "दुकान प्रोफाइल और प्राथमिकताएं",
      subtitle: "दुकान का विवरण और AI भाषा प्राथमिकता प्रबंधित करें।",
      bizType: "व्यापार का प्रकार",
      bizTypeValue: "किराना और जनरल स्टोर",
      city: "शहर",
      cityValue: "हैदराबाद, तेलंगाना",
      contact: "संपर्क फोन",
      upiVpa: "साउंडबॉक्स UPI / VPA",
      regOn: "व्यापारी प्लेटफॉर्म",
      kycVerified: "KYC सत्यापित",
      dpdpCompliant: "DPDP अनुपालन",
      soundboxActive: "साउंडबॉक्स सक्रिय",
      langCardTitle: "एप्लिकेशन और वॉयस भाषा",
      langCardSubtitle: "पूरे डैशबोर्ड, वॉयस रिपोर्ट और AI कोपायलट को अपनी पसंदीदा भाषा में बदलें।",
    },
  },

  Telugu: {
    navbar: {
      brandSubtitle: "పేటీఎం ఎడిషన్",
      storeName: "శర్మ జనరల్ స్టోర్",
      city: "హైదరాబాద్",
      refresh: "రిఫ్రెష్",
      refreshing: "రిఫ్రెష్ అవుతోంది...",
      geminiBadge: "జెమిని ఫ్లాష్ AI",
    },
    sidebar: {
      navigation: "దుకాణం నావిగేషన్",
      overview: "స్టోర్ అవలోకనం",
      soundbox: "AI సౌండ్‌బాక్స్ బ్రీఫింగ్",
      copilot: "AI బిజినెస్ కోపైలట్",
      sales: "అమ్మకాలు & రద్దీ వేళలు",
      customers: "కస్టమర్ లాయల్టీ",
      campaigns: "వాట్సాప్ ప్రచారాలు",
      profile: "వర్తక ప్రొఫైల్",
      soundboxCardTitle: "సౌండ్‌బాక్స్ వాయిస్ 4G",
      soundboxCardBadge: "వాయిస్-ఫస్ట్",
      soundboxCardAtRisk: "రిస్క్‌లో ఉన్న కస్టమర్లు: 42 మంది",
      soundboxCardDesc: "ఉదయం ఆడియో బ్రీఫింగ్ మరియు మధ్యాహ్నపు వాయిస్ అలర్ట్‌ల ద్వారా కస్టమర్లను తిరిగి రప్పిస్తుంది.",
    },
    soundbox: {
      headerBadge: "పేటీఎం సౌండ్‌బాక్స్ 5.0 AI ఎడిషన్",
      headerSub: "3-దశల రోజువారీ దుకాణం ఆడియో రొటీన్",
      headerTitle: "వర్తక రోజువారీ వాయిస్ ఇంటెలిజెన్స్",
      headerDesc: "స్క్రీన్ చూడనక్కర్లేదు మరియు ఆడియో స్పామ్ లేకుండా సౌండ్‌బాక్స్ వ్యాపార సహాయం చేస్తుంది.",
      stage1Tab: "1. 30-సెకన్ల మార్నింగ్ బ్రీఫింగ్",
      stage1Desc: "నిన్నటి కలెక్షన్, పీక్ రద్దీ వేళలు & ఉదయపు వ్యాపార ఉత్సాహం.",
      stage2Tab: "2. కస్టమర్ రిటెన్షన్ అలర్ట్",
      stage2Desc: "మధ్యాహ్నం 42 మంది కస్టమర్లను తిరిగి రప్పించే 1-పదం వాయిస్ ఆఫర్.",
      stage3Tab: "3. ఆన్-డిమాండ్ వాయిస్ ప్రశ్నలు",
      stage3Desc: "మైక్ ద్వారా నేరుగా మాట్లాడండి • ప్రశ్న మరియు సమాధానం రెండూ వినిపిస్తుంది.",
      morningMetricTitle: "ఉదయం 8:00 కలెక్షన్ లెక్క",
      morningMetricGrowth: "గత వారంతో పోలిస్తే +12.5% వృద్ధి",
      peakMetricTitle: "పీక్ రద్దీ సమయం",
      peakMetricDesc: "34 ధృవీకరించబడిన UPI బిల్లులు",
      retentionMetricTitle: "కస్టమర్ రిటెన్షన్ అలర్ట్",
      retentionMetricCount: "42 మంది రిస్క్‌లో ఉన్న కస్టమర్లు",
      retentionMetricDesc: "21+ రోజులుగా రాలేదు • ₹14,200 నెలవారీ రికవరీ",
    },
    sales: {
      badge: "దుకాణం కస్టమర్ రద్దీ మ్యాట్రిక్స్",
      title: "అమ్మకాల వేగం & రద్దీ వేళల విశ్లేషణ",
      subtitle: "మీ పేటీఎం సౌండ్‌బాక్స్ పేమెంట్ సమయాలను విశ్లేషించి, ఏ రోజు ఏ సమయంలో రద్దీ ఎక్కువగా ఉంటుందో మరియు ఎప్పుడు సరుకు సిద్ధం చేసుకోవాలో చెబుతుంది.",
      timeframe60d: "60-రోజుల సీజన్ (సెప్టెంబర్–నవంబర్ 2026)",
      timeframe30d: "గత 30 రోజులు",
      timeframe7d: "7-రోజుల వారం (నవంబర్ 2026)",
      viewFootfall: "కస్టమర్ల రద్దీ (బిల్లులు)",
      viewRevenue: "కలెక్షన్ మొత్తం (₹)",
      peakWindow: "ధృవీకరించబడిన పీక్ రద్దీ సమయం",
      peakWindowTime: "సాయంత్రం 7:00 – 8:00",
      peakWindowDesc: "గంటకు సగటున 34 ధృవీకరించబడిన UPI బిల్లులు. ఈ సమయంలో కౌంటర్ వద్ద సహాయకులను సిద్ధంగా ఉంచండి.",
      slumpWindow: "మధ్యాహ్నపు రద్దీ లేని సమయం",
      slumpWindowTime: "మధ్యాహ్నం 1:30 – 3:30",
      slumpWindowDesc: "రద్దీ గంటకు 5 బిల్లుల కంటే తగ్గుతుంది. సౌండ్‌బాక్స్ కస్టమర్ రిటెన్షన్ ఆఫర్ల కోసం అనువైన సమయం.",
      days: ["సోమవారం", "మంగళవారం", "బుధవారం", "గురువారం", "శుక్రవారం", "శనివారం", "ఆదివారం"],
      gridTimeLabel: "రోజు సమయం (ఉదయం 7:00 – రాత్రి 9:00)",
      gridDayLabel: "వారం రోజులు",
      legendPeak: "అత్యధిక రద్దీ (>20 బిల్లులు)",
      legendHigh: "ఎక్కువ రద్దీ (14–19 బిల్లులు)",
      legendMed: "మధ్యస్థ రద్దీ (8–13 బిల్లులు)",
      legendLow: "తక్కువ రద్దీ (<8 బిల్లులు)",
    },
    customers: {
      badge: "పేటీఎం VPA లాయల్టీ లెడ్జర్",
      title: "కస్టమర్ లాయల్టీ & RFM రిటెన్షన్",
      subtitle: "గతంలో వచ్చిన రోజులు, ఆర్డర్ల సంఖ్య మరియు ఖర్చు ఆధారంగా కస్టమర్లను వర్గీకరించి పాత కస్టమర్లను కాపాడుతుంది.",
      champions: "ఛాంపియన్లు (టాప్ కస్టమర్లు)",
      regulars: "రెగ్యులర్ కస్టమర్లు",
      atRisk: "రిస్క్‌లో ఉన్నవారు (అలర్ట్)",
      occasional: "అప్పుడప్పుడు వచ్చే కస్టమర్లు",
      searchPlaceholder: "ఫోన్ లేదా VPA ద్వారా వెతకండి...",
      filterAll: "అందరు కస్టమర్లు",
      tableCustomer: "కస్టమర్ వివరాలు",
      tableSegment: "లాయల్టీ వర్గం",
      tableOrders: "ధృవీకరించబడిన బిల్లులు",
      tableSpend: "మొత్తం ఖర్చు",
      tableLastVisit: "చివరి సందర్శన",
      tableAction: "చర్య",
      sendOffer: "ఆఫర్ పంపండి",
      customersFound: (count) => `${count} ధృవీకరించబడిన కస్టమర్లు చూపబడుతున్నారు`,
    },
    campaigns: {
      badge: "వాట్సాప్ గ్రోత్ మార్కెటింగ్ ఇంజిన్",
      subBadge: "1-క్లిక్ కస్టమర్ రిటెన్షన్",
      title: "లక్ష్య ఆధారిత వాట్సాప్ ప్రచారాలు",
      subtitle: "లావాదేవీల డేటా ఆధారంగా వ్యక్తిగతీకరించిన వాట్సాప్ డిస్కౌంట్ ఆఫర్లను పంపండి.",
      createTitle: "కొత్త AI వాట్సాప్ ప్రచారం రూపొందించండి",
      targetLabel: "లక్ష్య కస్టమర్ విభాగం",
      objectiveLabel: "ప్రచారం యొక్క ఉద్దేశం",
      discountLabel: "డిస్కౌంట్ కూపన్ శాతం",
      generateBtn: "వాట్సాప్ ఆఫర్ రూపొందించండి",
      generatingBtn: "వాట్సాప్ సందేశం రూపొందుతోంది...",
      previewTitle: "లైవ్ వాట్సాప్ సందేశ ప్రివ్యూ",
      approveBtn: "ఆమోదించి వాట్సాప్‌లో పంపండి",
      approvedBadge: "కస్టమర్లకు పంపబడింది",
      targetOptions: [
        { id: "At Risk Inactive Customers", label: "రిస్క్‌లో ఉన్న రెగ్యులర్లు (21+ రోజులుగా రాలేదు)" },
        { id: "High Value Champions", label: "ఛాంపియన్స్ & VIPలు (అత్యధిక కొనుగోళ్లు)" },
        { id: "Occasional Walk-ins", label: "అప్పుడప్పుడు వచ్చే కస్టమర్లు (రెగ్యులర్‌గా మార్చడానికి)" },
      ],
      objectiveOptions: [
        { id: "Retention", label: "కస్టమర్ రిటెన్షన్ (పాత కస్టమర్లను రప్పించండి)" },
        { id: "Reward Loyalty", label: "VIP లాయల్టీ డిస్కౌంట్" },
        { id: "Festive Clearance", label: "వీకెండ్ స్టాక్ క్లియరెన్స్" },
      ],
    },
    profile: {
      badge: "వర్తక ప్రొఫైల్ & సెట్టింగ్‌లు",
      title: "స్టోర్ ప్రొఫైల్ & ప్రాధాన్యతలు",
      subtitle: "మీ దుకాణ వివరాలు మరియు AI భాషా ప్రాధాన్యతలను నిర్వహించండి.",
      bizType: "వ్యాపార రకం",
      bizTypeValue: "కిరాణా & జనరల్ రిటైల్",
      city: "నగరం",
      cityValue: "హైదరాబాద్, తెలంగాణ",
      contact: "సంప్రదింపు ఫోన్",
      upiVpa: "సౌండ్‌బాక్స్ UPI / VPA",
      regOn: "మర్చంట్ ప్లాట్‌ఫారమ్",
      kycVerified: "KYC ధృవీకరించబడింది",
      dpdpCompliant: "DPDP చట్టం అనుగుణంగా ఉంది",
      soundboxActive: "సౌండ్‌బాక్స్ యాక్టివ్‌గా ఉంది",
      langCardTitle: "అప్లికేషన్ & వాయిస్ భాష",
      langCardSubtitle: "మొత్తం డ్యాష్‌బోర్డ్, వాయిస్ బ్రీఫింగ్ మరియు AI కోపైలట్‌ను మీ మాతృభాషలోకి మార్చండి.",
    },
  },

  Tamil: {
    navbar: {
      brandSubtitle: "பேடிஎம் பதிப்பு",
      storeName: "சர்மா ஜெனரல் ஸ்டோர்",
      city: "ஹைதராபாத்",
      refresh: "புதுப்பி",
      refreshing: "புதுப்பிக்கிறது...",
      geminiBadge: "ஜெமினி ஃப்ளாஷ் AI",
    },
    sidebar: {
      navigation: "கடை வழிசெலுத்தல்",
      overview: "கடை கண்ணோட்டம்",
      soundbox: "AI சவுண்ட்பாக்ஸ் அறிக்கை",
      copilot: "AI வணிக கோபைலட்",
      sales: "விற்பனை & பீக் ஹவர்ஸ்",
      customers: "வாடிக்கையாளர் விசுவாசம்",
      campaigns: "வாட்ஸ்அப் பிரச்சாரங்கள்",
      profile: "வணிகர் சுயவிவரம்",
      soundboxCardTitle: "சவுண்ட்பாக்ஸ் குரல் 4G",
      soundboxCardBadge: "குரல் வழி",
      soundboxCardAtRisk: "வராத வாடிக்கையாளர்கள்: 42 பேர்",
      soundboxCardDesc: "காலை ஆடியோ சுருக்கம் மற்றும் மதிய குரல் எச்சரிக்கைகள் மூலம் வாடிக்கையாளர்களை மீட்டெடுக்கிறது.",
    },
    soundbox: {
      headerBadge: "பேடிஎம் சவுண்ட்பாக்ஸ் 5.0 AI பதிப்பு",
      headerSub: "3-நிலை தினசரி கடை ஆடியோ வழக்கம்",
      headerTitle: "வணிகர் தினசரி குரல் நுண்ணறிவு",
      headerDesc: "திரை பார்க்காமல் சவுண்ட்பாக்ஸ் நாள் முழுவதும் வணிகருக்கு உதவுகிறது.",
      stage1Tab: "1. 30-வினாடி காலை சுருக்கம்",
      stage1Desc: "நேற்றைய வசூல், பீக் ஹவர்ஸ் மற்றும் காலை வணிக வழிகாட்டல்.",
      stage2Tab: "2. வாடிக்கையாளர் தக்கவைப்பு",
      stage2Desc: "மதிய வேளையில் 42 வாடிக்கையாளர்களை அழைக்க 1-சொல் குரல் அனுமதி.",
      stage3Tab: "3. உடனடி குரல் கேள்வி",
      stage3Desc: "மைக் மூலம் நேராகக் கேளுங்கள் • கேள்வியும் பதிலும் குரலில் ஒலிக்கும்.",
      morningMetricTitle: "காலை 8:00 மணி வசூல்",
      morningMetricGrowth: "கடந்த வாரத்தை விட +12.5% அதிகரிப்பு",
      peakMetricTitle: "அதிக கூட்டம் உள்ள நேரம்",
      peakMetricDesc: "34 சரிபார்க்கப்பட்ட UPI பில்கள்",
      retentionMetricTitle: "வாடிக்கையாளர் தக்கவைப்பு எச்சரிக்கை",
      retentionMetricCount: "42 வரத் தவறிய வாடிக்கையாளர்கள்",
      retentionMetricDesc: "21+ நாட்களாக வரவில்லை • ₹14,200 மீட்பு",
    },
    sales: {
      badge: "கடை வாடிக்கையாளர் வருகை",
      title: "விற்பனை வேகம் மற்றும் பீக் ஹவர்ஸ் நுண்ணறிவு",
      subtitle: "உங்கள் பேடிஎம் சவுண்ட்பாக்ஸ் கட்டண நேரங்களை பகுப்பாய்வு செய்து, எந்த நேரத்தில் கூட்டம் அதிகமாக இருக்கும் என்பதை முன்கூட்டியே காட்டுகிறது.",
      timeframe60d: "60-நாள் பருவம் (செப்–நவ 2026)",
      timeframe30d: "கடந்த 30 நாட்கள்",
      timeframe7d: "7-நாள் வாரம் (நவ 2026)",
      viewFootfall: "வாடிக்கையாளர் வருகை (பில்கள்)",
      viewRevenue: "வசூல் தொகை (₹)",
      peakWindow: "அதிக கூட்டம் உள்ள நேரம்",
      peakWindowTime: "மாலை 7:00 – 8:00",
      peakWindowDesc: "ஒரு மணி நேரத்திற்கு சராசரியாக 34 UPI பில்கள். இந்த நேரத்தில் கடையில் முழு கவனத்துடன் இருங்கள்.",
      slumpWindow: "மதிய ஓய்வு நேரம்",
      slumpWindowTime: "மதியம் 1:30 – 3:30",
      slumpWindowDesc: "கூட்டம் குறைவாக இருக்கும் நேரம். வாடிக்கையாளர் சலுகைகளை அனுப்ப சிறந்த நேரம்.",
      days: ["திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி", "ஞாயிறு"],
      gridTimeLabel: "நாளின் நேரம் (காலை 7:00 – இரவு 9:00)",
      gridDayLabel: "வார நாட்கள்",
      legendPeak: "அதிகபட்ச கூட்டம் (>20 பில்கள்)",
      legendHigh: "அதிக கூட்டம் (14–19 பில்கள்)",
      legendMed: "நடுத்தர கூட்டம் (8–13 பில்கள்)",
      legendLow: "குறைந்த கூட்டம் (<8 பில்கள்)",
    },
    customers: {
      badge: "பேடிஎம் VPA விசுவாச கணக்கு",
      title: "வாடிக்கையாளர் விசுவாசம் மற்றும் தக்கவைப்பு",
      subtitle: "வாடிக்கையாளர்கள் கடைக்கு வரும் இடைவெளி மற்றும் செலவை பகுப்பாய்வு செய்து தக்கவைக்கிறது.",
      champions: "சாம்பியன்ஸ் (முக்கிய வாடிக்கையாளர்கள்)",
      regulars: "வழக்கமான வாடிக்கையாளர்கள்",
      atRisk: "வரத் தவறியவர்கள் (எச்சரிக்கை)",
      occasional: "அவ்வப்போது வருபவர்கள்",
      searchPlaceholder: "தொலைபேசி அல்லது VPA மூலம் தேடுங்கள்...",
      filterAll: "அனைத்து வாடிக்கையாளர்கள்",
      tableCustomer: "வாடிக்கையாளர்",
      tableSegment: "விசுவாச நிலை",
      tableOrders: "பில்கள்",
      tableSpend: "மொத்த செலவு",
      tableLastVisit: "கடைசி வருகை",
      tableAction: "செயல்",
      sendOffer: "சலுகை அனுப்பு",
      customersFound: (count) => `${count} வாடிக்கையாளர்கள் காட்டப்படுகின்றனர்`,
    },
    campaigns: {
      badge: "வாட்ஸ்அப் வளர்ச்சி இயந்திரம்",
      subBadge: "1-கிளிக் வாடிக்கையாளர் தொடர்பு",
      title: "குறிப்பிட்ட வாட்ஸ்அப் பிரச்சாரங்கள்",
      subtitle: "விற்பனை தரவுகளின் அடிப்படையில் தனிப்பயனாக்கப்பட்ட வாட்ஸ்அப் தள்ளுபடி சலுகைகளை அனுப்பவும்.",
      createTitle: "புதிய AI வாட்ஸ்அப் பிரச்சாரம்",
      targetLabel: "இலக்கு வாடிக்கையாளர்கள்",
      objectiveLabel: "பிரச்சாரத்தின் நோக்கம்",
      discountLabel: "தள்ளுபடி சதவீதம்",
      generateBtn: "வாட்ஸ்அப் சலுகை உருவாக்கு",
      generatingBtn: "செய்தி உருவாக்கப்படுகிறது...",
      previewTitle: "நேரடி வாட்ஸ்அப் முன்னோட்டம்",
      approveBtn: "அனுமதிக்க மற்றும் அனுப்ப",
      approvedBadge: "அனுப்பப்பட்டது",
      targetOptions: [
        { id: "At Risk Inactive Customers", label: "வரத் தவறியவர்கள் (21+ நாட்கள்)" },
        { id: "High Value Champions", label: "சாம்பியன்ஸ் & VIP வாடிக்கையாளர்கள்" },
        { id: "Occasional Walk-ins", label: "அவ்வப்போது வருபவர்கள்" },
      ],
      objectiveOptions: [
        { id: "Retention", label: "வாடிக்கையாளர் தக்கவைப்பு" },
        { id: "Reward Loyalty", label: "VIP நன்றி தள்ளுபடி" },
        { id: "Festive Clearance", label: "வார இறுதி தள்ளுபடி" },
      ],
    },
    profile: {
      badge: "வணிகர் விவரம் & அமைப்புகள்",
      title: "கடை விவரம் & விருப்பங்கள்",
      subtitle: "கடை விவரங்கள் மற்றும் AI மொழி விருப்பங்களை நிர்வகிக்கவும்.",
      bizType: "வணிக வகை",
      bizTypeValue: "மளிகை மற்றும் பொது சில்லறை",
      city: "நகரம்",
      cityValue: "ஹைதராபாத், தெலுங்கானா",
      contact: "தொடர்பு எண்",
      upiVpa: "சவுண்ட்பாக்ஸ் UPI / VPA",
      regOn: "வணிக தளம்",
      kycVerified: "KYC சரிபார்க்கப்பட்டது",
      dpdpCompliant: "DPDP இணக்கமானது",
      soundboxActive: "சவுண்ட்பாக்ஸ் செயலில் உள்ளது",
      langCardTitle: "செயலி மற்றும் குரல் மொழி",
      langCardSubtitle: "முழு டாஷ்போர்டு, குரல் அறிக்கை மற்றும் AI உதவியாளரை உங்கள் தாய்மொழியில் மாற்றவும்.",
    },
  },

  Kannada: {
    navbar: {
      brandSubtitle: "ಪೇಟಿಎಂ ಆವೃತ್ತಿ",
      storeName: "ಶರ್ಮಾ ಜನರಲ್ ಸ್ಟೋರ್",
      city: "ಹೈದರಾಬಾದ್",
      refresh: "ರಿಫ್ರೆಶ್",
      refreshing: "ರಿಫ್ರೆಶ್ ಆಗುತ್ತಿದೆ...",
      geminiBadge: "ಜೆಮಿನಿ ಫ್ಲ್ಯಾಶ್ AI",
    },
    sidebar: {
      navigation: "ಅಂಗಡಿ ನ್ಯಾವಿಗೇಷನ್",
      overview: "ಅಂಗಡಿ ಅವಲೋಕನ",
      soundbox: "AI ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಬ್ರೀಫಿಂಗ್",
      copilot: "AI ಬಿಸಿನೆಸ್ ಕೋಪೈಲಟ್",
      sales: "ಮಾರಾಟ & ರಶ್ ಸಮಯ",
      customers: "ಗ್ರಾಹಕರ ಲಾಯಲ್ಟಿ",
      campaigns: "ವಾಟ್ಸಾಪ್ ಅಭಿಯಾನಗಳು",
      profile: "ವರ್ತಕರ ಪ್ರೊಫೈಲ್",
      soundboxCardTitle: "ಸೌಂಡ್‌ಬಾಕ್ಸ್ ವಾಯ್ಸ್ 4G",
      soundboxCardBadge: "ಧ್ವನಿ-ಪ್ರಥಮ",
      soundboxCardAtRisk: "ಅಪಾಯದಲ್ಲಿರುವ ಗ್ರಾಹಕರು: 42",
      soundboxCardDesc: "ಬೆಳಗಿನ ಆಡಿಯೋ ವರದಿ ಮತ್ತು ಮಧ್ಯಾಹ್ನದ ಧ್ವನಿ ಎಚ್ಚರಿಕೆಗಳ ಮೂಲಕ ಗ್ರಾಹಕರನ್ನು ಮರಳಿ ತರುತ್ತದೆ.",
    },
    soundbox: {
      headerBadge: "ಪೇಟಿಎಂ ಸೌಂಡ್‌ಬಾಕ್ಸ್ 5.0 AI ಆವೃತ್ತಿ",
      headerSub: "3-ಹಂತದ ದೈನಂದಿನ ಅಂಗಡಿ ಆಡಿಯೋ ದಿನಚರಿ",
      headerTitle: "ವರ್ತಕರ ದೈನಂದಿನ ಧ್ವನಿ ಬುದ್ಧಿಮತ್ತೆ",
      headerDesc: "ಸ್ಕ್ರೀನ್ ನೋಡದೆ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ದಿನವಿಡೀ ವರ್ತಕರಿಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡುತ್ತದೆ.",
      stage1Tab: "1. 30-ಸೆಕೆಂಡ್ ಬೆಳಗಿನ ಸಾರಾಂಶ",
      stage1Desc: "ನಿನ್ನೆಯ ಸಂಗ್ರಹ, ಗರಿಷ್ಠ ವ್ಯಾಪಾರದ ಸಮಯ ಮತ್ತು ಬೆಳಗಿನ ಪ್ರೇರಣೆ.",
      stage2Tab: "2. ಗ್ರಾಹಕರ ರಿಟೆನ್ಷನ್ ಎಚ್ಚರಿಕೆ",
      stage2Desc: "ಮಧ್ಯಾಹ್ನ 42 ನಿಯಮಿತ ಗ್ರಾಹಕರನ್ನು ಮರಳಿ ಕರೆತರಲು 1-ಪದದ ಧ್ವನಿ ಅನುಮೋದನೆ.",
      stage3Tab: "3. ಆನ್-ಡಿಮಾಂಡ್ ಧ್ವನಿ ಪ್ರಶ್ನೆಗಳು",
      stage3Desc: "ಮೈಕ್ ಬಳಸಿ ನೇರವಾಗಿ ಮಾತನಾಡಿ • ಪ್ರಶ್ನೆ ಮತ್ತು ಉತ್ತರ ಎರಡನ್ನೂ ಧ್ವನಿಯಲ್ಲಿ ತಿಳಿಸುತ್ತದೆ.",
      morningMetricTitle: "ಬೆಳಿಗ್ಗೆ 8:00 ಗಂಟೆಯ ಸಂಗ್ರಹ",
      morningMetricGrowth: "ಕಳೆದ ವಾರಕ್ಕಿಂತ +12.5% ಹೆಚ್ಚಳ",
      peakMetricTitle: "ಗರಿಷ್ಠ ವ್ಯಾಪಾರದ ಸಮಯ",
      peakMetricDesc: "34 ದೃಢೀಕರಿಸಿದ UPI ಬಿಲ್‌ಗಳು",
      retentionMetricTitle: "ಗ್ರಾಹಕರ ರಿಟೆನ್ಷನ್ ಎಚ್ಚರಿಕೆ",
      retentionMetricCount: "42 ಅಪಾಯದಲ್ಲಿರುವ ನಿಯಮಿತ ಗ್ರಾಹಕರು",
      retentionMetricDesc: "21+ ದಿನಗಳಿಂದ ಬಂದಿಲ್ಲ • ₹14,200 ಮಾಸಿಕ ರಿಕವರಿ",
    },
    sales: {
      badge: "ಅಂಗಡಿ ಗ್ರಾಹಕರ ರಶ್ ಮ್ಯಾಟ್ರಿಕ್ಸ್",
      title: "ಮಾರಾಟದ ವೇಗ ಮತ್ತು ಗರಿಷ್ಠ ವ್ಯಾಪಾರದ ಸಮಯ",
      subtitle: "ನಿಮ್ಮ ಪೇಟಿಎಂ ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಪಾವತಿ ಸಮಯವನ್ನು ವಿಶ್ಲೇಷಿಸಿ, ಯಾವಾಗ ಹೆಚ್ಚಿನ ಗ್ರಾಹಕರು ಬರುತ್ತಾರೆ ಎಂದು ತಿಳಿಸುತ್ತದೆ.",
      timeframe60d: "60-ದಿನಗಳ ಸೀಸನ್ (ಸೆಪ್ಟೆಂಬರ್–ನವೆಂಬರ್ 2026)",
      timeframe30d: "ಕಳೆದ 30 ದಿನಗಳು",
      timeframe7d: "7-ದಿನಗಳ ವಾರ (ನವೆಂಬರ್ 2026)",
      viewFootfall: "ಗ್ರಾಹಕರ ಸಂಖ್ಯೆ (ಬಿಲ್‌ಗಳು)",
      viewRevenue: "ಸಂಗ್ರಹ ಮೊತ್ತ (₹)",
      peakWindow: "ಗರಿಷ್ಠ ವ್ಯಾಪಾರದ ಸಮಯ",
      peakWindowTime: "ಸಂಜೆ 7:00 – 8:00",
      peakWindowDesc: "ಗಂಟೆಗೆ ಸರಾಸರಿ 34 ಪರಿಶೀಲಿಸಿದ UPI ಬಿಲ್‌ಗಳು. ಈ ಸಮಯದಲ್ಲಿ ಕೌಂಟರ್‌ನಲ್ಲಿ ಪೂರ್ಣ ಸಿದ್ಧತೆ ಇರಲಿ.",
      slumpWindow: "ಮಧ್ಯಾಹ್ನದ ವಿಶ್ರಾಂತಿ ಸಮಯ",
      slumpWindowTime: "ಮಧ್ಯಾಹ್ನ 1:30 – 3:30",
      slumpWindowDesc: "ಗ್ರಾಹಕರ ಸಂಖ್ಯೆ ಕಡಿಮೆಯಾಗುವ ಸಮಯ. ಗ್ರಾಹಕರ ರಿಟೆನ್ಷನ್ ಆಫರ್ ಕಳುಹಿಸಲು ಉತ್ತಮ ಸಮಯ.",
      days: ["ಸೋಮವಾರ", "ಮಂಗಳವಾರ", "ಬುಧವಾರ", "ಗುರುವಾರ", "ಶುಕ್ರವಾರ", "ಶನಿವಾರ", "ಭಾನುವಾರ"],
      gridTimeLabel: "ದಿನದ ಸಮಯ (ಬೆಳಿಗ್ಗೆ 7:00 – ರಾತ್ರಿ 9:00)",
      gridDayLabel: "ವಾರದ ದಿನಗಳು",
      legendPeak: "ಗರಿಷ್ಠ ರಶ್ (>20 ಬಿಲ್‌ಗಳು)",
      legendHigh: "ಹೆಚ್ಚಿನ ರಶ್ (14–19 ಬಿಲ್‌ಗಳು)",
      legendMed: "ಮಧ್ಯಮ ರಶ್ (8–13 ಬಿಲ್‌ಗಳು)",
      legendLow: "ಕಡಿಮೆ ರಶ್ (<8 ಬಿಲ್‌ಗಳು)",
    },
    customers: {
      badge: "ಪೇಟಿಎಂ VPA ಲಾಯಲ್ಟಿ ಲೆಡ್ಜರ್",
      title: "ಗ್ರಾಹಕರ ಲಾಯಲ್ಟಿ ಮತ್ತು ರಿಟೆನ್ಷನ್",
      subtitle: "ಗ್ರಾಹಕರ ಭೇಟಿ ಮತ್ತು ಖರ್ಚಿನ ಆಧಾರದ ಮೇಲೆ ವಿಂಗಡಿಸಿ ಗ್ರಾಹಕರನ್ನು ಉಳಿಸಿಕೊಳ್ಳಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.",
      champions: "ಚಾಂಪಿಯನ್ಸ್ (ಪ್ರಮುಖ ಗ್ರಾಹಕರು)",
      regulars: "ನಿಯಮಿತ ಗ್ರಾಹಕರು",
      atRisk: "ಅಪಾಯದಲ್ಲಿರುವವರು (ಎಚ್ಚರಿಕೆ)",
      occasional: "ಸಾಂದರ್ಭಿಕ ಗ್ರಾಹಕರು",
      searchPlaceholder: "ಫೋನ್ ಅಥವಾ VPA ಮೂಲಕ ಹುಡುಕಿ...",
      filterAll: "ಎಲ್ಲಾ ಗ್ರಾಹಕರು",
      tableCustomer: "ಗ್ರಾಹಕರು",
      tableSegment: "ವರ್ಗ",
      tableOrders: "ಬಿಲ್‌ಗಳು",
      tableSpend: "ಒಟ್ಟು ಖರ್ಚು",
      tableLastVisit: "ಕೊನೆಯ ಭೇಟಿ",
      tableAction: "ಕ್ರಮ",
      sendOffer: "ಆಫರ್ ಕಳುಹಿಸಿ",
      customersFound: (count) => `${count} ಗ್ರಾಹಕರನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ`,
    },
    campaigns: {
      badge: "ವಾಟ್ಸಾಪ್ ಗ್ರೋತ್ ಮಾರ್ಕೆಟಿಂಗ್",
      subBadge: "1-ಕ್ಲಿಕ್ ಗ್ರಾಹಕರ ಸಂಪರ್ಕ",
      title: "ಗುರಿ ಆಧಾರಿತ ವಾಟ್ಸಾಪ್ ಅಭಿಯಾನಗಳು",
      subtitle: "ವಹಿವಾಟು ಡೇಟಾ ಆಧಾರದ ಮೇಲೆ ಕಸ್ಟಮೈಸ್ ಮಾಡಿದ ವಾಟ್ಸಾಪ್ ರಿಯಾಯಿತಿ ಆಫರ್‌ಗಳನ್ನು ಕಳುಹಿಸಿ.",
      createTitle: "ಹೊಸ AI ವಾಟ್ಸಾಪ್ ಅಭಿಯಾನ ರಚಿಸಿ",
      targetLabel: "ಗುರಿ ಗ್ರಾಹಕರ ವರ್ಗ",
      objectiveLabel: "ಅಭಿಯಾನದ ಉದ್ದೇಶ",
      discountLabel: "ರಿಯಾಯಿತಿ ಶೇಕಡಾವಾರು",
      generateBtn: "ವಾಟ್ಸಾಪ್ ಆಫರ್ ರಚಿಸಿ",
      generatingBtn: "ಸಂದೇಶ ರಚಿಸಲಾಗುತ್ತಿದೆ...",
      previewTitle: "ಲೈವ್ ವಾಟ್ಸಾಪ್ ಸಂದೇಶ ಮುನ್ನೋಟ",
      approveBtn: "ಅನುಮೋದಿಸಿ ಮತ್ತು ಕಳುಹಿಸಿ",
      approvedBadge: "ಕಳುಹಿಸಲಾಗಿದೆ",
      targetOptions: [
        { id: "At Risk Inactive Customers", label: "ಅಪಾಯದಲ್ಲಿರುವ ನಿಯಮಿತ ಗ್ರಾಹಕರು (21+ ದಿನಗಳು)" },
        { id: "High Value Champions", label: "ಚಾಂಪಿಯನ್ಸ್ & VIP ಗ್ರಾಹಕರು" },
        { id: "Occasional Walk-ins", label: "ಸಾಂದರ್ಭಿಕ ಗ್ರಾಹಕರು" },
      ],
      objectiveOptions: [
        { id: "Retention", label: "ಗ್ರಾಹಕರ ರಿಟೆನ್ಷನ್" },
        { id: "Reward Loyalty", label: "VIP ಲಾಯಲ್ಟಿ ರಿಯಾಯಿತಿ" },
        { id: "Festive Clearance", label: "ವಾರಾಂತ್ಯದ ಸ್ಟಾಕ್ ಕ್ಲಿಯರೆನ್ಸ್" },
      ],
    },
    profile: {
      badge: "ವರ್ತಕರ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      title: "ಅಂಗಡಿ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಆದ್ಯತೆಗಳು",
      subtitle: "ಅಂಗಡಿಯ ವಿವರಗಳು ಮತ್ತು AI ಭಾಷಾ ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ.",
      bizType: "ವ್ಯಾಪಾರದ ಪ್ರಕಾರ",
      bizTypeValue: "ಕಿರಾಣಿ ಮತ್ತು ಜನರಲ್ ರಿಟೇಲ್",
      city: "ನಗರ",
      cityValue: "ಹೈದರಾಬಾದ್, ತೆಲಂಗಾಣ",
      contact: "ಸಂಪರ್ಕ ಸಂಖ್ಯೆ",
      upiVpa: "ಸೌಂಡ್‌ಬಾಕ್ಸ್ UPI / VPA",
      regOn: "ವರ್ತಕ ವೇದಿಕೆ",
      kycVerified: "KYC ಪರಿಶೀಲಿಸಲಾಗಿದೆ",
      dpdpCompliant: "DPDP ಕಾಯ್ದೆ ಪಾಲನೆ",
      soundboxActive: "ಸೌಂಡ್‌ಬಾಕ್ಸ್ ಸಕ್ರಿಯವಾಗಿದೆ",
      langCardTitle: "ಅಪ್ಲಿಕೇಶನ್ ಮತ್ತು ಧ್ವನಿ ಭಾಷೆ",
      langCardSubtitle: "ಸಂಪೂರ್ಣ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್, ಧ್ವನಿ ವರದಿ ಮತ್ತು AI ಕೋಪೈಲಟ್ ಅನ್ನು ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಗೆ ಬದಲಾಯಿಸಿ.",
    },
  },
};

export function getTranslation(language?: string): AppTranslation {
  if (!language || !(language in TRANSLATIONS)) {
    return TRANSLATIONS.Hinglish;
  }
  return TRANSLATIONS[language as AppLanguage];
}
