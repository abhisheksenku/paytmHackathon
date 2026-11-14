"use client";

import React from "react";
import {
  LayoutDashboard,
  Volume2,
  Sparkles,
  TrendingUp,
  Users,
  MessageSquare,
  UserCircle,
  Radio,
} from "lucide-react";

export type NavTab =
  | "overview"
  | "soundbox"
  | "copilot"
  | "sales"
  | "customers"
  | "campaigns"
  | "profile";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language?: string;
}

const LANG_NATIVE_BADGE: Record<string, string> = {
  Hindi: "हिंदी",
  Telugu: "తెలుగు",
  Tamil: "தமிழ்",
  Kannada: "ಕನ್ನಡ",
  English: "English",
  Hinglish: "Hinglish",
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  language = "Hinglish",
}) => {
  const navItems = [
    {
      id: "overview" as NavTab,
      label: "Store Overview",
      icon: LayoutDashboard,
      badge: "Core",
    },
    {
      id: "soundbox" as NavTab,
      label: "AI Soundbox Briefing",
      icon: Volume2,
      badge: "Voice",
      badgeColor: "bg-cyan-100 text-[#002E6E]",
    },
    {
      id: "copilot" as NavTab,
      label: "AI Business Copilot",
      icon: Sparkles,
      badge: LANG_NATIVE_BADGE[language] || language,
      badgeColor: "bg-blue-100 text-[#002E6E]",
    },
    {
      id: "sales" as NavTab,
      label: "Sales & Rush Hours",
      icon: TrendingUp,
    },
    {
      id: "customers" as NavTab,
      label: "Customer Loyalty",
      icon: Users,
    },
    {
      id: "campaigns" as NavTab,
      label: "WhatsApp Campaigns",
      icon: MessageSquare,
      badge: "Growth",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "profile" as NavTab,
      label: "Merchant Profile",
      icon: UserCircle,
      badge: "Settings",
      badgeColor: "bg-purple-100 text-purple-800",
    },
  ];

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200/80 bg-white min-h-[calc(100vh-4rem)] p-3.5 justify-between shrink-0">
      <div className="space-y-5">
        {/* Navigation Section */}
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Dukaan Navigation
          </p>
          <nav className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#002E6E] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                        isActive ? "text-[#00BAF2]" : "text-slate-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[12px] font-bold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : item.badgeColor || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Soundbox Voice Copilot & Retention Card in Sidebar */}
        <div className="rounded-xl border border-cyan-200/80 bg-gradient-to-br from-cyan-50/70 via-blue-50/50 to-slate-50 p-3.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#002E6E] uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-[#00BAF2] animate-pulse" />
              Soundbox Voice 4G
            </span>
            <span className="text-[11px] font-bold text-cyan-800 bg-cyan-100/90 px-2 py-0.5 rounded-full">
              Voice-First
            </span>
          </div>
          <p className="mt-2 text-xs font-semibold text-slate-800">
            At-Risk Regulars: <span className="text-amber-600 font-bold">42 Tracked</span>
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>Eyes-Free Copilot Ready (6 Langs)</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 leading-tight">
            100% screen-free voice intelligence for inclusive retail commerce.
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-100 pt-3">
        <div className="flex items-center justify-between text-[13px] text-slate-400">
          <span>Paytm Build for India</span>
          <span className="font-mono">v2.0</span>
        </div>
      </div>
    </aside>
  );
};
