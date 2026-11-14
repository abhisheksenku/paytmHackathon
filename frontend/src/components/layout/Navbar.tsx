"use client";

import React from "react";
import { Store, Sparkles, RefreshCw, Languages, MapPin } from "lucide-react";
import type { AppLanguage } from "@/components/dashboard/ProfileTab";
import { getTranslation } from "@/lib/translations";

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
  const t = getTranslation(language);

  const langOptions: { code: AppLanguage; label: string; flag: string }[] = [
    { code: "Hinglish", label: "Hinglish", flag: "🇮🇳" },
    { code: "Hindi", label: "हिंदी", flag: "🇮🇳" },
    { code: "Telugu", label: "తెలుగు", flag: "🇮🇳" },
    { code: "Tamil", label: "தமிழ்", flag: "🇮🇳" },
    { code: "Kannada", label: "ಕನ್ನಡ", flag: "🇮🇳" },
    { code: "English", label: "English", flag: "🇬🇧" },
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-5 lg:px-8 backdrop-blur-md">
      {/* 1. Brand Identity */}
      <div className="flex items-center space-x-3 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#002E6E] to-[#0A1A3A] text-white shadow-sm ring-1 ring-black/5">
          <Store className="h-4.5 w-4.5 text-[#00BAF2]" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-base font-extrabold tracking-tight text-slate-900">
            Vyapaar<span className="text-[#00BAF2] ml-0.5">AI</span>
          </span>
          <span className="hidden sm:inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#002E6E] border border-blue-200/60">
            {t.navbar.brandSubtitle}
          </span>
        </div>
      </div>

      {/* 2. Center: Active Store Persona (Clean & Compact) */}
      <div className="hidden md:flex items-center space-x-2 rounded-full border border-slate-200/80 bg-slate-50/80 px-3.5 py-1.5 shadow-xs">
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs font-bold text-slate-800">
          {t.navbar.storeName}
        </span>
        <span className="text-slate-300">•</span>
        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
          <MapPin className="h-3 w-3 text-slate-400" /> {t.navbar.city}
        </span>
      </div>

      {/* 3. Right Action Controls (Unified & Uncongested) */}
      <div className="flex items-center space-x-2.5">
        {/* Language Dropdown */}
        <div className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 px-2.5 py-1.5 transition-all text-xs font-semibold text-slate-700 shadow-xs">
          <Languages className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <select
            value={language}
            onChange={(e) => onLanguageChange && onLanguageChange(e.target.value as AppLanguage)}
            className="bg-transparent text-xs font-bold text-slate-800 cursor-pointer outline-none border-none pr-1 focus:ring-0"
            title="Switch Language"
          >
            {langOptions.map((opt) => (
              <option key={opt.code} value={opt.code} className="text-slate-900 bg-white">
                {opt.flag} {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Gemini Flash AI Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 rounded-xl border border-sky-100 bg-sky-50/70 px-3 py-1.5 text-xs font-semibold text-[#002E6E] shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-[#00BAF2]" />
          <span>{t.navbar.geminiBadge}</span>
        </div>

        {/* Refresh Action */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-xs active:scale-95 disabled:opacity-50 cursor-pointer"
            title="Refresh live metrics"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${isRefreshing ? "animate-spin text-[#002E6E]" : ""}`} />
            <span>{isRefreshing ? t.navbar.refreshing : t.navbar.refresh}</span>
          </button>
        )}
      </div>
    </header>
  );
};
