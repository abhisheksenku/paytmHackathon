export interface OverviewSummary {
  timeframe: string;
  total_revenue: number;
  revenue_growth_pct: number;
  total_transactions: number;
  txn_growth_pct: number;
  avg_order_value: number;
  aov_growth_pct: number;
  repeat_customer_rate: number;
  active_customers: number;
}

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
  transactions: number;
}

export interface PeakHourSlot {
  day_of_week: string;
  hour: number;
  footfall: number;
  revenue: number;
}

export interface CustomerCohort {
  segment: "Champion" | "Champions" | "Regular" | "Regulars" | "At Risk" | "Occasional" | string;
  count: number;
  pct: number;
  avg_spend: number;
  recommended_action: string;
  color?: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  masked_vpa: string;
  masked_phone: string;
  phone?: string;
  segment: string;
  frequency_label: string;
  days_ago: number;
  total_orders: number;
  total_spent: number;
  last_seen: string;
}

export interface SoundboxBriefing {
  date: string;
  audio_url?: string;
  audio_base64?: string;
  transcript: string;
  metrics: {
    yesterday_revenue: number;
    yesterday_txns: number;
    peak_hour: string;
    growth_vs_last_week_pct: number;
  };
  key_highlights: string[];
}

export interface Campaign {
  id: string;
  name: string;
  target_segment: string;
  objective: string;
  message_text: string;
  discount_code?: string;
  discount_pct: number;
  status: "DRAFT" | "APPROVED" | "SENT" | "REJECTED" | string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "tool";
  content: string;
  tool_badge?: {
    tool_name: string;
    status: "verified" | "executing" | "failed";
    details?: string;
  };
  created_at: string;
}
