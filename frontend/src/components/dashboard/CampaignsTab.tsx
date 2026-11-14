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
} from "lucide-react";
import { apiEndpoints } from "@/lib/api";
import { Campaign } from "@/lib/types";
import { getTranslation } from "@/lib/translations";

interface CampaignsTabProps {
  language?: string;
}

export const CampaignsTab: React.FC<CampaignsTabProps> = ({ language = "Hinglish" }) => {
  const t = getTranslation(language);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [targetSegment, setTargetSegment] = useState("At Risk Inactive Customers");
  const [objective, setObjective] = useState("Retention");
  const [discountPct, setDiscountPct] = useState(15);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePreviewCampaign, setActivePreviewCampaign] = useState<Campaign | null>(null);
  const [recipientPhone, setRecipientPhone] = useState<string>("8374360774");
  const [recipientName, setRecipientName] = useState<string>("Rajeshwari");

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

  const handleGenerateCampaign = async () => {
    setIsGenerating(true);
    try {
      const res = await apiEndpoints.generateCampaign({
        target_segment: targetSegment,
        objective: objective,
        discount_pct: discountPct,
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
          <h3 className="text-sm font-bold text-[#0A1120] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#00BAF2]" />
            {t.campaigns.createTitle}
          </h3>

          <div className="space-y-4">
            {/* Target Segment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-slate-400" /> {t.campaigns.targetLabel}
              </label>
              <select
                value={targetSegment}
                onChange={(e) => setTargetSegment(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#002E6E] focus:outline-none"
              >
                {t.campaigns.targetOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Campaign Objective */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t.campaigns.objectiveLabel}
                </label>
                <select
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-800 focus:border-[#002E6E] focus:outline-none"
                >
                  {t.campaigns.objectiveOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Discount Percentage */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-slate-400" /> {t.campaigns.discountLabel}
                </label>
                <div className="flex space-x-2">
                  {[10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDiscountPct(pct)}
                      className={`flex-1 rounded-xl py-2 text-xs font-bold transition cursor-pointer ${
                        discountPct === pct
                          ? "bg-[#002E6E] text-white shadow-sm"
                          : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {pct}% OFF
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateCampaign}
              disabled={isGenerating}
              className="w-full rounded-xl bg-[#002E6E] py-3 text-xs font-bold text-white hover:bg-[#002456] transition shadow-sm active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-[#00BAF2]" />
              <span>{isGenerating ? t.campaigns.generatingBtn : t.campaigns.generateBtn}</span>
            </button>
          </div>

          {/* Campaign Approval & WhatsApp Dispatch Callout */}
          {activePreviewCampaign && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#002E6E]">
                    Status: {activePreviewCampaign.status}
                  </p>
                  <p className="text-[12px] text-slate-500">
                    {activePreviewCampaign.status === "APPROVED"
                      ? "Campaign verified & ready for instant 1-click WhatsApp dispatch."
                      : "Review the simulated smartphone preview before approving."}
                  </p>
                </div>

                {activePreviewCampaign.status !== "APPROVED" && (
                  <button
                    onClick={() => handleApproveCampaign(activePreviewCampaign.id)}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>{t.campaigns.approveBtn}</span>
                  </button>
                )}
              </div>

              {/* Real-time Recipient Selector & wa.me Dispatch */}
              <div className="pt-2 border-t border-blue-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-600">Send To:</span>
                  <div className="flex items-center rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs shadow-2xs">
                    <span className="text-slate-400 font-mono mr-1">+91</span>
                    <input
                      type="text"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="8374360774"
                      className="w-24 font-mono font-bold text-slate-800 bg-transparent outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setRecipientPhone("8374360774");
                      setRecipientName("Rajeshwari");
                    }}
                    className="text-[11px] text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded font-bold cursor-pointer transition"
                    title="Pre-fill with Rajeshwari (Demo At-Risk Customer)"
                  >
                    ⭐ Rajeshwari
                  </button>
                </div>

                <a
                  href={`https://wa.me/91${recipientPhone.replace(/\D/g, "") || "8374360774"}?text=${encodeURIComponent(activePreviewCampaign.message_text)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] px-4 py-2 text-xs font-bold text-white transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Send via WhatsApp (wa.me) 🚀</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 Cols: Smartphone WhatsApp Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-center mb-2">
            <span className="text-[13px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
              <Smartphone className="h-3.5 w-3.5" /> {t.campaigns.previewTitle}
            </span>
          </div>

          {/* Smartphone Bezel */}
          <div className="w-[310px] rounded-[40px] border-4 border-slate-800 bg-slate-900 p-3 shadow-2xl">
            {/* Screen Inner */}
            <div className="rounded-[32px] overflow-hidden bg-[#ECE5DD] flex flex-col h-[520px]">
              {/* WhatsApp Header */}
              <div className="bg-[#075E54] text-white px-4 py-3 flex items-center space-x-2.5 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-slate-200 text-[#075E54] font-bold text-xs flex items-center justify-center">
                  SG
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">{t.navbar.storeName} (Abhishek)</p>
                  <p className="text-[11px] text-emerald-200">📞 8919581022 • Paytm Verified</p>
                </div>
              </div>

              {/* Chat Message Bubble Body */}
              <div className="flex-1 p-3 overflow-y-auto space-y-2.5">
                <div className="text-center">
                  <span className="bg-white/80 text-[11px] text-slate-600 px-2 py-0.5 rounded shadow-sm">
                    TODAY
                  </span>
                </div>

                <div className="rounded-lg bg-amber-50 border border-amber-200 p-2 text-[10px] text-amber-900 flex items-center justify-between">
                  <span>Target: <strong>{recipientName} (+91 {recipientPhone})</strong></span>
                  <span className="bg-amber-200 text-amber-950 font-bold px-1.5 py-0.5 rounded text-[9px]">LIVE</span>
                </div>

                {activePreviewCampaign ? (
                  <div className="max-w-[95%] rounded-2xl rounded-tl-none bg-white p-3 text-[12px] text-slate-800 shadow-sm leading-relaxed whitespace-pre-line border border-slate-200">
                    {activePreviewCampaign.message_text}
                    <div className="mt-1.5 text-right text-[10px] text-slate-400">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ✓✓
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-400 mt-20">
                    Click "Generate AI WhatsApp Message" to see preview here.
                  </div>
                )}
              </div>

              {/* WhatsApp Bottom Input Placeholder */}
              <div className="bg-[#F0F0F0] px-3 py-2 flex items-center space-x-2 border-t border-slate-200">
                <div className="flex-1 rounded-full bg-white px-3 py-1.5 text-[13px] text-slate-400">
                  Message
                </div>
                <div className="h-7 w-7 rounded-full bg-[#075E54] flex items-center justify-center text-white">
                  <Send className="h-3.5 w-3.5" />
                </div>
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
