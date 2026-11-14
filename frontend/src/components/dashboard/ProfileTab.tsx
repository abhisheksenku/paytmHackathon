"use client";

import React from "react";
import {
  Store,
  MapPin,
  Phone,
  CreditCard,
  Globe,
  CheckCircle,
  ShieldCheck,
  Languages,
} from "lucide-react";
import { getTranslation } from "@/lib/translations";

export type AppLanguage = "English" | "Hinglish" | "Hindi" | "Telugu" | "Tamil" | "Kannada";

interface ProfileTabProps {
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
}

const LANGUAGES: { code: AppLanguage; label: string; native: string; flag: string; status: "live" | "roadmap" }[] = [
  { code: "English",  label: "English",  native: "English",  flag: "🇬🇧", status: "live" },
  { code: "Hinglish", label: "Hinglish", native: "Hinglish", flag: "🇮🇳", status: "live" },
  { code: "Hindi",    label: "Hindi",    native: "हिंदी",    flag: "🇮🇳", status: "live" },
  { code: "Telugu",   label: "Telugu",   native: "తెలుగు",   flag: "🇮🇳", status: "live" },
  { code: "Tamil",    label: "Tamil",    native: "தமிழ்",    flag: "🇮🇳", status: "live" },
  { code: "Kannada",  label: "Kannada",  native: "ಕನ್ನಡ",   flag: "🇮🇳", status: "live" },
];

export const ProfileTab: React.FC<ProfileTabProps> = ({ language, onLanguageChange }) => {
  const t = getTranslation(language);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-800 border border-purple-200">
          {t.profile.badge}
        </span>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0A1120]">
          {t.profile.title}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {t.profile.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Merchant Details Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#002E6E] text-white shadow">
              <Store className="h-7 w-7 text-[#00BAF2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0A1120]">{t.navbar.storeName}</h3>
              <p className="text-xs text-slate-500">Paytm Registered Merchant</p>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-100">
            {[
              { icon: Store,      label: t.profile.bizType,  value: t.profile.bizTypeValue },
              { icon: MapPin,     label: t.profile.city,     value: t.profile.cityValue },
              { icon: Phone,      label: t.profile.contact,  value: "+91 98765-43210" },
              { icon: CreditCard, label: t.profile.upiVpa,   value: "sharmakirana@paytm" },
              { icon: Globe,      label: t.profile.regOn,    value: "Paytm for Business v2.0" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-500">
                  <Icon className="h-4 w-4 text-[#00BAF2]" />
                  <span className="text-xs font-semibold">{label}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{value}</span>
              </div>
            ))}
          </div>

          {/* Verification Badges */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              <CheckCircle className="h-3 w-3" /> {t.profile.kycVerified}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#002E6E] border border-blue-200">
              <ShieldCheck className="h-3 w-3" /> {t.profile.dpdpCompliant}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800 border border-cyan-200">
              <CreditCard className="h-3 w-3" /> {t.profile.soundboxActive}
            </span>
          </div>
        </div>

        {/* Language Preference Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center space-x-2">
            <Languages className="h-5 w-5 text-[#00BAF2]" />
            <h3 className="text-base font-bold text-[#0A1120]">{t.profile.langCardTitle}</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {t.profile.langCardSubtitle}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all active:scale-95 cursor-pointer ${
                    isSelected
                      ? "border-[#002E6E] bg-[#002E6E] text-white shadow-md"
                      : "border-slate-200 bg-slate-50 hover:border-[#00BAF2] hover:bg-blue-50"
                  }`}
                >
                  <div>
                    <p className={`text-xs font-bold ${isSelected ? "text-white" : "text-slate-800"}`}>
                      {lang.flag} {lang.label}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${isSelected ? "text-blue-200" : "text-slate-500"}`}>
                      {lang.native}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="h-2 w-2 rounded-full bg-[#00BAF2]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active language banner */}
          <div className="rounded-xl bg-gradient-to-r from-[#002E6E]/10 to-[#00BAF2]/10 border border-[#00BAF2]/30 px-4 py-3">
            <p className="text-xs font-semibold text-[#002E6E]">
              ✅ Copilot will now respond in:{" "}
              <span className="font-black">
                {LANGUAGES.find(l => l.code === language)?.flag}{" "}
                {LANGUAGES.find(l => l.code === language)?.label}
              </span>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Go to the AI Business Copilot tab and ask any question to try it now.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
