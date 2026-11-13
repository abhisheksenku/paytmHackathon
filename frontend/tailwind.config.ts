import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ["14px", { lineHeight: "20px" }],     // was 12px (+2px)
        sm: ["16px", { lineHeight: "24px" }],     // was 14px (+2px)
        base: ["18px", { lineHeight: "28px" }],   // was 16px (+2px)
        lg: ["20px", { lineHeight: "28px" }],     // was 18px (+2px)
        xl: ["22px", { lineHeight: "30px" }],     // was 20px (+2px)
        "2xl": ["26px", { lineHeight: "34px" }],  // was 24px (+2px)
        "3xl": ["32px", { lineHeight: "38px" }],  // was 30px (+2px)
        "4xl": ["38px", { lineHeight: "44px" }],  // was 36px (+2px)
      },
      colors: {
        paytm: {
          navy: "#0A1120",
          deep: "#1E293B",
          blue: "#002E6E",
          cyan: "#00BAF2",
          lightCyan: "#E0F7FE",
          surface: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
        },
      },
    },
  },
  plugins: [],
};
export default config;
