"use client";

import React from "react";
import { Store, Zap, RefreshCw, Languages } from "lucide-react";
import type { AppLanguage } from "@/components/dashboard/ProfileTab";

interface NavbarProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  language?: AppLanguage;
  onLanguageChange?: (lang: AppLanguage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRefresh,
  isRefreshing,
  language = "Hinglish",
  onLanguageChange,
}) => {
  const langOptions: { code: AppLanguage; label: string; flag: string }[] = [
    { code: "Hinglish", label: "Hinglish", flag: "🇮🇳" },
    { code: "Hindi", label: "हिंदी (Hindi)", flag: "🇮🇳" },
    { code: "Telugu", label: "తెలుగు (Telugu)", flag: "🇮🇳" },
    { code: "Tamil", label: "தமிழ் (Tamil)", flag: "🇮🇳" },
    { code: "Kannada", label: "ಕನ್ನಡ (Kannada)", flag: "🇮🇳" },
    { code: "English", label: "English", flag: "🇬🇧" },
  ];
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur-md">
      {/* Brand & Track */}
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#002E6E] text-white shadow-sm">
          <Store className="h-5 w-5 text-[#00BAF2]" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold tracking-tight text-[#0A1120]">
              Vyapaar <span className="text-[#00BAF2]">AI</span>
            </span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[13px] font-semibold text-[#002E6E] border border-blue-200">
              Paytm Edition
            </span>
          </div>
          <p className="text-[13px] text-slate-500 font-medium">
            Merchant Growth Copilot & Dukaan Engine
          </p>
        </div>
      </div>

      {/* Center: Active Merchant Profile */}
      <div className="hidden md:flex items-center space-x-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold text-slate-800">
          Sharma General Store
        </span>
        <span className="text-xs text-slate-400">•</span>
        <span className="text-xs text-slate-500">Kirana & Retail (Hyderabad)</span>
        <span className="text-xs text-slate-400">•</span>
        <span className="text-[13px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
          UPI ID: sharmakirana@paytm
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Interactive Language Selector */}
        <div className="flex items-center space-x-1.5 rounded-lg bg-purple-50 px-2.5 py-1 border border-purple-200/80 text-purple-900 text-xs font-semibold shadow-sm hover:border-purple-300 transition-all">
          <Languages className="h-3.5 w-3.5 text-purple-600 flex-shrink-0" />
          <select
            value={language}
            onChange={(e) => onLanguageChange && onLanguageChange(e.target.value as AppLanguage)}
            className="bg-transparent text-purple-900 text-xs font-bold cursor-pointer outline-none border-none pr-1 focus:ring-0"
            title="Change Application Language"
          >
            {langOptions.map((opt) => (
              <option key={opt.code} value={opt.code} className="text-slate-900 bg-white">
                {opt.flag} {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Gemini Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 rounded-lg bg-cyan-50 px-3 py-1.5 border border-cyan-200/70 text-cyan-900 text-xs font-medium">
          <Zap className="h-3.5 w-3.5 text-[#00BAF2]" />
          <span>Gemini 1.5 Flash</span>
          <span className="text-[12px] bg-[#00BAF2] text-white font-bold px-1.5 py-0.2 rounded-full">FREE</span>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 disabled:opacity-60"
            title="Reload live business calculations"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh Dashboard</span>
          </button>
        )}
      </div>
    </header>
  );
};
