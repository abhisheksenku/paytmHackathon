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

  const fetchCustomerList = async (segment: string, search: string) => {
    setLoadingCustomers(true);
    try {
      const res = await apiEndpoints.getCustomers({
        segment: segment === "All" ? undefined : segment,
        search: search.trim() || undefined,
        limit: 15,
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
    fetchCustomerList(selectedSegment, searchQuery);
  }, [selectedSegment]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomerList(selectedSegment, searchQuery);
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

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
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

              {/* Target with Promo CTA */}
              <button
                onClick={() => onTargetSegment(c.segment)}
                className={`mt-4 flex items-center justify-center space-x-1.5 rounded-xl py-2 px-3 text-xs font-bold transition active:scale-95 shadow-sm ${
                  isAtRisk
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
                }`}
              >
                <span>{isAtRisk ? "Recover 42 Customers" : "Target with Promo"}</span>
                <ArrowRight className="h-3.5 w-3.5 text-current" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Real Customer Directory Table with Filters & Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
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
                onClick={() => setSelectedSegment(tab.id)}
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
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {c.name}
                    </td>

                    {/* Masked VPA & Phone */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-[11px] text-slate-600 font-medium">
                        {c.masked_vpa}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {c.masked_phone}
                      </div>
                    </td>

                    {/* Segment */}
                    <td className="py-3 px-4">
                      {getSegmentBadge(c.segment)}
                    </td>

                    {/* Frequency & Recency */}
                    <td className="py-3 px-4">
                      <span className={`text-[12px] font-semibold ${c.segment === "At Risk" ? "text-red-600" : "text-slate-800"}`}>
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
                      <button
                        onClick={() => onTargetSegment(c.segment)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition shadow-xs ${
                          c.segment === "At Risk"
                            ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                            : "bg-blue-50 text-[#002E6E] hover:bg-blue-100 border border-blue-200"
                        }`}
                        title="Draft targeted WhatsApp message"
                      >
                        Send Promo
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
