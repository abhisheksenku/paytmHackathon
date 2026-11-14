"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Crown,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
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

const COHORT_CRITERIA: Record<string, { frequency: string; recency: string; spend: string }> = {
  Champions: {
    frequency: "3–4 visits / week",
    recency: "Active in last 7 days",
    spend: "18+ orders • Spend > ₹5,000",
  },
  Champion: {
    frequency: "3–4 visits / week",
    recency: "Active in last 7 days",
    spend: "18+ orders • Spend > ₹5,000",
  },
  Regulars: {
    frequency: "1–2 visits / week",
    recency: "Active in last 21 days",
    spend: "8 to 17 orders • Spend ₹1.5k–₹5k",
  },
  Regular: {
    frequency: "1–2 visits / week",
    recency: "Active in last 21 days",
    spend: "8 to 17 orders • Spend ₹1.5k–₹5k",
  },
  "At Risk": {
    frequency: "Used to visit 1-2x/week",
    recency: "⚠️ Not seen in >21 days (Churn Alert)",
    spend: "5+ past orders • At risk of churning",
  },
  "Occasional Walk-ins": {
    frequency: "Passing / 1st visit",
    recency: "Recent or one-time footfall",
    spend: "1 to 4 orders • Low basket size",
  },
};

export const CustomersTab: React.FC<CustomersTabProps> = ({ onTargetSegment, language = "Hinglish" }) => {
  const t = getTranslation(language);
  const [cohorts, setCohorts] = useState<CustomerCohort[]>([]);
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [totalFiltered, setTotalFiltered] = useState<number>(0);
  const [selectedSegment, setSelectedSegment] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loadingCohorts, setLoadingCohorts] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

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

  const scrollToDirectory = (segment?: string) => {
    if (segment) {
      setSelectedSegment(segment);
      setCurrentPage(1);
    }
    const el = document.getElementById("customer-directory-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getSegmentBadge = (segment: string) => {
    const s = segment.toLowerCase();
    if (s.includes("champion")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5">
          <Crown className="h-3 w-3 text-amber-500" /> Champion
        </span>
      );
    }
    if (s.includes("risk")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 text-red-800 text-[11px] font-bold px-2.5 py-0.5">
          <AlertTriangle className="h-3 w-3 text-red-600" /> At Risk
        </span>
      );
    }
    if (s.includes("regular")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 text-[#002E6E] text-[11px] font-bold px-2.5 py-0.5">
          <UserCheck className="h-3 w-3 text-[#00BAF2]" /> Regular
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium px-2.5 py-0.5">
        Walk-in
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
              {t.customers.badge}
            </span>
            <span className="text-xs text-slate-500 font-medium">• 600 Total Profiled Shoppers</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1120]">
            {t.customers.title}
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl">
            {t.customers.subtitle}
          </p>
        </div>
        <button
          onClick={() => scrollToDirectory("All")}
          className="inline-flex items-center gap-2 rounded-xl bg-[#002E6E] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#002456] active:scale-95 transition cursor-pointer self-start sm:self-center whitespace-nowrap"
        >
          <Users className="h-4 w-4 text-[#00BAF2]" />
          <span>View All 600 Customers ↓</span>
        </button>
      </div>

      {/* 4 Cohort Cards Grid with Explicit Frequency & Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cohorts.map((c) => {
          const isAtRisk = c.segment === "At Risk";
          const isChampion = c.segment === "Champions" || c.segment === "Champion";
          const isRegular = c.segment === "Regulars" || c.segment === "Regular";
          const criteria = COHORT_CRITERIA[c.segment] || {
            frequency: "1–2 visits/wk",
            recency: "Active",
            spend: "Regular spend",
          };

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
                    {c.segment}
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
                  <span className="text-xs text-slate-500 font-semibold">customers</span>
                </div>

                <p className="mt-1 text-xs text-slate-600 font-medium">
                  Average spend: <strong className="text-slate-900">{formatINR(c.avg_spend)}</strong>
                </p>

                {/* Explicit Frequency & Recency Criteria Box */}
                <div className="mt-3 rounded-lg bg-slate-50 p-2.5 border border-slate-200/80 space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold text-slate-500">Visit Frequency:</span>
                    <strong className="text-slate-900">{criteria.frequency}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold text-slate-500">Recency Status:</span>
                    <span className={`font-semibold ${isAtRisk ? "text-red-700 font-bold" : "text-emerald-700"}`}>
                      {criteria.recency}
                    </span>
                  </div>
                  <div className="pt-1 text-[10px] text-slate-500 border-t border-slate-200/60 font-mono">
                    Criteria: {criteria.spend}
                  </div>
                </div>

                <p className="mt-3 text-[12px] text-slate-600 leading-snug">
                  {c.recommended_action}
                </p>
              </div>

              {/* Action Buttons: View Cohort in Directory + Launch Campaign */}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => scrollToDirectory(c.segment)}
                  className="flex-1 flex items-center justify-center space-x-1 rounded-xl py-2 px-2 text-[11px] font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition active:scale-95 cursor-pointer shadow-2xs"
                  title={`View ${c.count} ${c.segment} customers in directory`}
                >
                  <Users className="h-3.5 w-3.5 text-[#002E6E]" />
                  <span>View ({c.count})</span>
                </button>
                <button
                  onClick={() => onTargetSegment(c.segment)}
                  className={`flex-1 flex items-center justify-center space-x-1 rounded-xl py-2 px-2 text-[11px] font-bold transition active:scale-95 shadow-2xs cursor-pointer ${
                    isAtRisk
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-[#002E6E] text-white hover:bg-[#002456]"
                  }`}
                >
                  <span>{isAtRisk ? "Recover 42" : "Promo"}</span>
                  <ArrowRight className="h-3 w-3 text-current" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real Customer Directory Table with Filters, Search & Pagination */}
      <div id="customer-directory-section" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#0A1120] flex items-center gap-2">
              <Users className="h-4 w-4 text-[#002E6E]" />
              Merchant Customer Directory (600 Shoppers)
            </h3>
            <p className="text-xs text-slate-500">
              Showing {customers.length} of {totalFiltered} shoppers matching criteria • Compliant with DPDP Act 2023.
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
              { id: "Champions", label: `👑 ${t.customers.champions} (54)` },
              { id: "Regulars", label: `🤝 ${t.customers.regulars} (102)` },
              { id: "At Risk", label: `⚠️ ${t.customers.atRisk} (42)` },
              { id: "Occasional Walk-in", label: `🚶 ${t.customers.occasional} (402)` },
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
