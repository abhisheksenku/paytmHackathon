import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vyapaar AI | Dukaan Intelligence & Merchant Growth Copilot",
  description: "AI-Powered Merchant Copilot for Indian Retailers. From Daily Soundbox to Business Growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#F8FAFC] text-slate-900">
        {children}
      </body>
    </html>
  );
}
