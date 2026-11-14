"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Send,
  CheckCircle,
  Clock,
  Sparkles,
  Share2,
  Check,
  Smartphone,
  Tag,
  Users,
  Languages,
  Copy,
  Edit3,
  Flame,
  Gift,
  RefreshCw,
} from "lucide-react";
import { apiEndpoints } from "@/lib/api";
import { Campaign } from "@/lib/types";
import { getTranslation } from "@/lib/translations";

interface CampaignsTabProps {
  language?: string;
}

const CAMPAIGN_LANGUAGES = [
  { id: "Hinglish", label: "Hinglish", flag: "🇮🇳", native: "Hinglish" },
  { id: "Telugu",   label: "Telugu",   flag: "🇮🇳", native: "తెలుగు" },
  { id: "Hindi",    label: "Hindi",    flag: "🇮🇳", native: "हिंदी" },
  { id: "English",  label: "English",  flag: "🇬🇧", native: "English" },
  { id: "Tamil",    label: "Tamil",    flag: "🇮🇳", native: "தமிழ்" },
  { id: "Kannada",  label: "Kannada",  flag: "🇮🇳", native: "ಕನ್ನಡ" },
];

const CAMPAIGN_CATEGORIES = [
  {
    id: "Customer Win-Back",
    label: "⚠️ Win-Back / At-Risk",
    badge: "Retention",
    desc: "Recover regular shoppers inactive for 20+ days",
  },
  {
    id: "VIP Loyalty Reward",
    label: "👑 VIP Loyalty",
    badge: "Loyalty",
    desc: "Delight and reward top recurring shoppers",
  },
  {
    id: "Afternoon Flash Deal",
    label: "⚡ Afternoon Flash Deal",
    badge: "Slump Rush",
    desc: "Boost quiet afternoon hours (1 PM – 5 PM)",
  },
  {
    id: "Festival Special",
    label: "🪔 Festive & Seasonal",
    badge: "Festival",
    desc: "Diwali, Sankranti, Eid, festive grocery hampers",
  },
  {
    id: "Weekend Basket Booster",
    label: "🛒 Weekend Super Saver",
    badge: "Basket Size",
    desc: "Incentivize bulk grocery orders above ₹499",
  },
  {
    id: "Custom Announcement",
    label: "✨ Custom Promotion",
    badge: "Custom Offer",
    desc: "Special new stock or personalized discount",
  },
];

export const CampaignsTab: React.FC<CampaignsTabProps> = ({ language = "Hinglish" }) => {
  const t = getTranslation(language);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignLanguage, setCampaignLanguage] = useState<string>(language || "Hinglish");
  const [campaignCategory, setCampaignCategory] = useState<string>("Customer Win-Back");
  const [targetSegment, setTargetSegment] = useState("At Risk Inactive Customers");
  const [discountPct, setDiscountPct] = useState(15);
  const [customInstruction, setCustomInstruction] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePreviewCampaign, setActivePreviewCampaign] = useState<Campaign | null>(null);
  const [recipientPhone, setRecipientPhone] = useState<string>("8374360774");
  const [recipientName, setRecipientName] = useState<string>("Rajeshwari");
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);

  // Synchronize campaignLanguage when app language changes
  useEffect(() => {
    if (language) {
      setCampaignLanguage(language);
    }
  }, [language]);

  // Load campaigns from backend
  const loadCampaigns = async () => {
    try {
      const res = await apiEndpoints.getCampaigns();
      if (res.data?.success && res.data?.data) {
        setCampaigns(res.data.data);
        if (res.data.data.length > 0 && !activePreviewCampaign) {
          setActivePreviewCampaign(res.data.data[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load campaigns:", e);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleGenerateCampaign = async (overrides?: {
    category?: string;
    language?: string;
    discountPct?: number;
    targetSegment?: string;
    customInstruction?: string;
  }) => {
    setIsGenerating(true);
    const cat = overrides?.category ?? campaignCategory;
    const lang = overrides?.language ?? campaignLanguage;
    const disc = overrides?.discountPct ?? discountPct;
    const seg = overrides?.targetSegment ?? targetSegment;
    const instr = overrides?.customInstruction ?? customInstruction;

    try {
      const res = await apiEndpoints.generateCampaign({
        target_segment: seg,
        objective: cat,
        category: cat,
        language: lang,
        discount_pct: disc,
        custom_instruction: instr,
        recipient_name: recipientName,
        recipient_phone: recipientPhone,
      });

      if (res.data?.success && res.data?.data) {
        const newCamp = res.data.data;
        setCampaigns((prev) => [newCamp, ...prev]);
        setActivePreviewCampaign(newCamp);
      }
    } catch (e) {
      console.error("Campaign generation error:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setCampaignLanguage(newLang);
    handleGenerateCampaign({ language: newLang });
  };

  const handleCategoryChange = (newCat: string) => {
    setCampaignCategory(newCat);
    handleGenerateCampaign({ category: newCat });
  };

  const handleApproveCampaign = async (id: string) => {
    try {
      const res = await apiEndpoints.approveCampaign(id);
      if (res.data?.success) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: "APPROVED" } : c))
        );
        if (activePreviewCampaign?.id === id) {
          setActivePreviewCampaign((prev) => (prev ? { ...prev, status: "APPROVED" } : null));
        }
      }
    } catch (e) {
      console.error("Failed to approve campaign:", e);
    }
  };

  const handleCopyText = () => {
    if (!activePreviewCampaign?.message_text) return;
    navigator.clipboard.writeText(activePreviewCampaign.message_text);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
            {t.campaigns.badge}
          </span>
          <span className="text-xs text-slate-500">• {t.campaigns.subBadge}</span>
        </div>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1120]">
          {t.campaigns.title}
        </h2>
        <p className="text-xs text-slate-500">
          {t.campaigns.subtitle}
        </p>
      </div>

      {/* Main Row: Campaign Generator Form + Smartphone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Generator Controls */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-[#0A1120] uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#00BAF2]" />
              AI Multilingual WhatsApp Campaign Studio
            </h3>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              ⚡ 100% Free wa.me Link
            </span>
          </div>

          <div className="space-y-5">
            {/* 1. Language Category / Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Languages className="h-3.5 w-3.5 text-[#00BAF2]" />
                  1. Message Language (Changes Output Script &amp; Tone):
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  Active: {campaignLanguage}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {CAMPAIGN_LANGUAGES.map((langItem) => {
                  const isSelected = campaignLanguage.toLowerCase() === langItem.id.toLowerCase();
                  return (
                    <button
                      key={langItem.id}
                      type="button"
                      onClick={() => handleLanguageChange(langItem.id)}
                      className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition cursor-pointer active:scale-95 ${
                        isSelected
                          ? "border-[#002E6E] bg-[#002E6E] text-white shadow-sm ring-1 ring-[#002E6E]"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="text-xs">{langItem.flag}</span>
                      <span className="text-[11px] font-bold mt-0.5">{langItem.native}</span>
                      <span className={`text-[9px] ${isSelected ? "text-cyan-200" : "text-slate-400"}`}>
                        {langItem.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Campaign Category / Objective */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-[#00BAF2]" />
                2. Campaign Category / Marketing Purpose:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CAMPAIGN_CATEGORIES.map((cat) => {
                  const isSelected = campaignCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer active:scale-95 ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50 text-emerald-950 ring-1 ring-emerald-600 shadow-2xs"
                          : "border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{cat.label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-2">
                        {cat.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Merchant Custom Requirements / Product Specific Notes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5 text-[#00BAF2]" />
                  3. Custom Requirement &amp; Specific Product Notes (AI will adapt):
                </label>
                <span className="text-[10px] text-slate-400">Optional</span>
              </div>
              <textarea
                rows={2}
                value={customInstruction}
                onChange={(e) => setCustomInstruction(e.target.value)}
                placeholder="e.g. Special offer on Sunflower Oil and Aashirvaad Atta for festival, or free 100g coffee pack on bills above ₹499"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#002E6E] focus:outline-none transition"
              />
            </div>

            {/* 4. Target Recipient & Discount Offer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Recipient Details */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-slate-400" /> Target Customer:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setRecipientName("Rajeshwari");
                      setRecipientPhone("8374360774");
                    }}
                    className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded cursor-pointer hover:bg-amber-200"
                  >
                    ⭐ Demo Rajeshwari
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Customer Name"
                    className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-800 outline-none"
                  />
                  <div className="flex items-center rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs">
                    <span className="text-slate-400 font-mono mr-1 text-[11px]">+91</span>
                    <input
                      type="text"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="Mobile No"
                      className="w-full font-mono text-xs font-medium text-slate-800 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Discount Percentage */}
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5 text-slate-400" /> Discount Offer %:
                </label>
                <div className="flex space-x-1.5">
                  {[10, 15, 20, 25, 30].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        setDiscountPct(pct);
                        handleGenerateCampaign({ discountPct: pct });
                      }}
                      className={`flex-1 rounded-lg py-1.5 text-xs font-bold transition cursor-pointer ${
                        discountPct === pct
                          ? "bg-[#002E6E] text-white shadow-sm"
                          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Generate Button */}
            <button
              onClick={() => handleGenerateCampaign()}
              disabled={isGenerating}
              className="w-full rounded-xl bg-gradient-to-r from-[#002E6E] via-blue-700 to-[#002E6E] py-3.5 text-xs font-black text-white hover:brightness-110 transition shadow-md active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-[#00BAF2] animate-spin" />
              <span>
                {isGenerating
                  ? `AI Drafting in ${campaignLanguage}...`
                  : `✨ Generate AI WhatsApp Copy (${campaignLanguage} • ${campaignCategory})`}
              </span>
            </button>
          </div>

          {/* Campaign Approval & Direct WhatsApp Dispatch Callout */}
          {activePreviewCampaign && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#002E6E]">
                      {activePreviewCampaign.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {activePreviewCampaign.discount_pct}% OFF • {activePreviewCampaign.discount_code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ready for 1-click WhatsApp dispatch to {recipientName} (+91 {recipientPhone}).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyText}
                    className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition shadow-2xs flex items-center gap-1 cursor-pointer"
                  >
                    {copiedMessage ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
                    <span>{copiedMessage ? "Copied!" : "Copy"}</span>
                  </button>

                  <a
                    href={`https://wa.me/91${recipientPhone.replace(/\D/g, "") || "8374360774"}?text=${encodeURIComponent(activePreviewCampaign.message_text)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] px-4 py-1.5 text-xs font-black text-white transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    <span>Send via WhatsApp 🚀</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Smartphone WhatsApp Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-center mb-2 flex items-center gap-2">
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-center gap-1">
              <Smartphone className="h-3.5 w-3.5 text-[#00BAF2]" /> Live WhatsApp Preview
            </span>
            <span className="text-[10px] font-extrabold bg-[#002E6E] text-white px-2 py-0.5 rounded-full">
              {campaignLanguage}
            </span>
          </div>

          {/* Smartphone Bezel */}
          <div className="w-[320px] rounded-[42px] border-4 border-slate-800 bg-slate-900 p-3 shadow-2xl">
            {/* Screen Inner */}
            <div className="rounded-[34px] overflow-hidden bg-[#ECE5DD] flex flex-col h-[540px]">
              {/* WhatsApp Header */}
              <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center space-x-2.5">
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-[#075E54] font-black text-xs flex items-center justify-center shadow-xs">
                    SG
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">{t.navbar.storeName} (Abhishek)</p>
                    <p className="text-[10px] text-emerald-200">📞 8919581022 • Paytm Verified</p>
                  </div>
                </div>
              </div>

              {/* Chat Message Bubble Body */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                <div className="text-center">
                  <span className="bg-white/80 text-[10px] text-slate-600 px-2.5 py-0.5 rounded-full shadow-2xs">
                    TODAY
                  </span>
                </div>

                {/* Recipient Callout Bar */}
                <div className="rounded-xl bg-amber-50/90 border border-amber-200/80 p-2 text-[10px] text-amber-950 flex items-center justify-between shadow-2xs">
                  <span>To: <strong>{recipientName} (+91 {recipientPhone})</strong></span>
                  <span className="bg-emerald-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[9px]">
                    {campaignLanguage}
                  </span>
                </div>

                {/* Dynamic Message Bubble */}
                {activePreviewCampaign ? (
                  <div className="rounded-2xl rounded-tl-none bg-white p-3 text-[12px] text-slate-800 shadow-sm leading-relaxed whitespace-pre-line border border-slate-200 space-y-2">
                    <textarea
                      value={activePreviewCampaign.message_text}
                      onChange={(e) => {
                        const val = e.target.value;
                        setActivePreviewCampaign((prev) =>
                          prev ? { ...prev, message_text: val } : null
                        );
                      }}
                      rows={10}
                      className="w-full bg-transparent text-[12px] text-slate-900 leading-relaxed font-sans outline-none resize-none border-none p-0 focus:ring-0"
                    />
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                      <span className="italic flex items-center gap-1 text-slate-400">
                        <Edit3 className="h-2.5 w-2.5" /> Editable preview
                      </span>
                      <span>
                        {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ✓✓
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-400 mt-20">
                    Select a category and language to see the AI preview here.
                  </div>
                )}
              </div>

              {/* WhatsApp Bottom Send Action Bar */}
              <div className="bg-[#F0F0F0] px-3 py-2 flex items-center space-x-2 border-t border-slate-200">
                <a
                  href={`https://wa.me/91${recipientPhone.replace(/\D/g, "") || "8374360774"}?text=${encodeURIComponent(activePreviewCampaign?.message_text || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 text-[11px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer text-center"
                >
                  <Share2 className="h-3 w-3" />
                  <span>Send to {recipientName} (wa.me)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign History Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#0A1120] uppercase tracking-wider mb-4">
          All Generated Campaigns ({campaigns.length})
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[12px]">
                <th className="pb-3">Campaign Name</th>
                <th className="pb-3">Target Segment</th>
                <th className="pb-3">Discount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Created</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3">{c.target_segment}</td>
                  <td className="py-3 font-mono font-bold text-[#002E6E]">{c.discount_pct}% OFF</td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[12px] font-bold ${
                        c.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-400">{c.created_at}</td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => setActivePreviewCampaign(c)}
                      className="text-[#002E6E] hover:underline font-bold text-[13px]"
                    >
                      Preview Phone
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
