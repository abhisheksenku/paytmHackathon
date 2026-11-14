"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar, NavTab } from "@/components/layout/Sidebar";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { SoundboxTab } from "@/components/dashboard/SoundboxTab";
import { CopilotTab } from "@/components/dashboard/CopilotTab";
import { SalesTab } from "@/components/dashboard/SalesTab";
import { CustomersTab } from "@/components/dashboard/CustomersTab";
import { CampaignsTab } from "@/components/dashboard/CampaignsTab";
import { ProfileTab, AppLanguage } from "@/components/dashboard/ProfileTab";
import { apiEndpoints } from "@/lib/api";
import { OverviewSummary, RevenueTrendPoint, SoundboxBriefing } from "@/lib/types";

export default function Home() {
  const [currentTab, setCurrentTab] = useState<NavTab>("overview");
  const [overview, setOverview] = useState<OverviewSummary | null>(null);
  const [trends, setTrends] = useState<RevenueTrendPoint[]>([]);
  const [briefing, setBriefing] = useState<SoundboxBriefing | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copilotInitialPrompt, setCopilotInitialPrompt] = useState<string | undefined>(undefined);
  const [language, setLanguage] = useState<AppLanguage>("Hinglish");

  // Load language preference from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLang = localStorage.getItem("vyapaar_language") as AppLanguage | null;
      if (savedLang && ["English", "Hinglish", "Hindi", "Telugu", "Tamil", "Kannada"].includes(savedLang)) {
        setLanguage(savedLang);
      }
    }
  }, []);

  const handleLanguageChange = (newLang: AppLanguage) => {
    setLanguage(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("vyapaar_language", newLang);
    }
  };

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const [overviewRes, trendsRes, soundboxRes] = await Promise.all([
        apiEndpoints.getOverview("30d"),
        apiEndpoints.getTrends("30d"),
        apiEndpoints.getSoundboxBriefing(),
      ]);

      if (overviewRes.data?.success) setOverview(overviewRes.data.data);
      if (trendsRes.data?.success) setTrends(trendsRes.data.data);
      if (soundboxRes.data?.success) setBriefing(soundboxRes.data.data);
    } catch (e) {
      console.error("Error fetching live store metrics:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleOpenCopilotWithPrompt = (prompt?: string) => {
    setCopilotInitialPrompt(prompt);
    setCurrentTab("copilot");
  };

  const handleTargetSegmentInCampaigns = (segment: string) => {
    setCurrentTab("campaigns");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Header Navbar */}
      <Navbar
        onRefresh={fetchDashboardData}
        isRefreshing={isRefreshing}
        language={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Layout Container */}
      <div className="flex flex-1">
        {/* Persistent Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          language={language}
        />

        {/* Dynamic Content Main View */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {currentTab === "overview" && (
            <OverviewTab
              overview={overview}
              trends={trends}
              onOpenSoundbox={() => setCurrentTab("soundbox")}
              onOpenCopilot={handleOpenCopilotWithPrompt}
              onOpenCampaigns={() => setCurrentTab("campaigns")}
              language={language}
            />
          )}

          {currentTab === "soundbox" && (
            <SoundboxTab
              briefing={briefing}
              language={language}
              onOpenCustomers={() => setCurrentTab("customers")}
            />
          )}

          {currentTab === "copilot" && (
            <CopilotTab
              initialPrompt={copilotInitialPrompt}
              onClearInitialPrompt={() => setCopilotInitialPrompt(undefined)}
              language={language}
            />
          )}

          {currentTab === "sales" && <SalesTab language={language} />}

          {currentTab === "customers" && (
            <CustomersTab onTargetSegment={handleTargetSegmentInCampaigns} language={language} />
          )}

          {currentTab === "campaigns" && <CampaignsTab language={language} />}

          {currentTab === "profile" && (
            <ProfileTab language={language} onLanguageChange={handleLanguageChange} />
          )}
        </main>
      </div>
    </div>
  );
}
