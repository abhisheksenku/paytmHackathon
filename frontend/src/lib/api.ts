import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export const apiEndpoints = {
  health: () => api.get("/health"),
  demoLogin: () => api.post("/auth/demo-login"),
  getOverview: (timeframe = "30d") => api.get(`/analytics/overview?timeframe=${timeframe}`),
  getTrends: (timeframe = "30d") => api.get(`/analytics/trends?timeframe=${timeframe}`),
  getPeakHours: (timeframe = "60d") => api.get(`/analytics/peak-hours?timeframe=${timeframe}`),
  getSoundboxBriefing: () => api.get("/soundbox/briefing"),
  getCohorts: () => api.get("/analytics/cohorts"),
  getCustomers: (params?: { segment?: string; search?: string; limit?: number; offset?: number }) =>
    api.get("/analytics/customers", { params }),
  getCampaigns: () => api.get("/campaigns"),
  generateCampaign: (data: {
    target_segment: string;
    objective: string;
    discount_pct: number;
    category?: string;
    language?: string;
    custom_instruction?: string;
    recipient_name?: string;
    recipient_phone?: string;
  }) => api.post("/campaigns/generate", data),
  approveCampaign: (id: string) => api.post(`/campaigns/${id}/approve`),
  sendChatMessage: (data: { message: string; conversation_id?: string; language?: string }) =>
    api.post("/ai/chat", data),
  generateTTS: (data: { text: string; language?: string }) =>
    api.post("/ai/tts", data),
};
