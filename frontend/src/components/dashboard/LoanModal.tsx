"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  Percent,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Building2,
  Lock,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  loanScore: number;
  maxLimit: number;
  language?: string;
}

export const LoanModal: React.FC<LoanModalProps> = ({
  isOpen,
  onClose,
  loanScore,
  maxLimit,
  language = "Hinglish",
}) => {
  const [amount, setAmount] = useState<number>(maxLimit || 250000);
  const [tenureMonths, setTenureMonths] = useState<number>(12);
  const [step, setStep] = useState<"calculator" | "verifying" | "disbursed">("calculator");

  if (!isOpen) return null;

  // 14% APR simple estimation for daily micro-deductions
  const interestRate = 14;
  const totalRepayment = amount * (1 + (interestRate / 100) * (tenureMonths / 12));
  const totalDays = tenureMonths * 30;
  const dailyMicroDeduction = Math.round(totalRepayment / totalDays);

  const avgDailyCollection = 18450;
  const netDailySettlement = avgDailyCollection - dailyMicroDeduction;

  const handleApply = () => {
    setStep("verifying");
    setTimeout(() => {
      setStep("disbursed");
    }, 1500);
  };

  const handleReset = () => {
    setStep("calculator");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002E6E] via-[#004098] to-[#00BAF2] p-6 text-white relative">
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-cyan-200">
            <ShieldCheck className="h-4 w-4" />
            Paytm Merchant Growth Capital • 100% Collateral-Free
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight">
            Instant Working Capital for Bharat Merchants
          </h2>
          <p className="mt-1 text-xs text-blue-100 max-w-md">
            Underwritten purely on 180-day Paytm Soundbox UPI cashflow velocity. Zero ITRs, zero balance sheets, zero branch visits.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
            <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 font-semibold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              Score: <strong className="text-white">{loanScore}/900</strong> (Prime Tier)
            </span>
            <span className="rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-3 py-1 font-semibold">
              ✓ Pre-Approved Limit: {formatINR(maxLimit)}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {step === "calculator" && (
            <div className="space-y-6">
              
              {/* Underwriting Proof Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-center">
                  <span className="text-[11px] font-semibold text-slate-500">Operating Days</span>
                  <p className="mt-0.5 text-base font-black text-slate-800">178 / 180</p>
                  <span className="text-[10px] text-emerald-600 font-bold">98.8% Active</span>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-center">
                  <span className="text-[11px] font-semibold text-slate-500">Cashflow Consistency</span>
                  <p className="mt-0.5 text-base font-black text-slate-800">92% Index</p>
                  <span className="text-[10px] text-blue-600 font-bold">Low Volatility</span>
                </div>
                <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3 text-center">
                  <span className="text-[11px] font-semibold text-slate-500">Daily Revenue Floor</span>
                  <p className="mt-0.5 text-base font-black text-slate-800">₹7,200</p>
                  <span className="text-[10px] text-purple-600 font-bold">Guaranteed Base</span>
                </div>
              </div>

              {/* Loan Amount Slider */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Select Loan Amount
                  </label>
                  <span className="text-2xl font-black text-[#002E6E]">
                    {formatINR(amount)}
                  </span>
                </div>

                <input
                  type="range"
                  min={50000}
                  max={maxLimit}
                  step={10000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="mt-4 w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#002E6E]"
                />

                <div className="mt-2 flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>₹50,000</span>
                  <span>Pre-Approved Max: {formatINR(maxLimit)}</span>
                </div>

                {/* Tenure Selector */}
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Tenure:</span>
                  <div className="flex gap-2">
                    {[6, 12, 18, 24].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setTenureMonths(m)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                          tenureMonths === m
                            ? "bg-[#002E6E] text-white shadow-sm"
                            : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {m} Months
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* The Magic Repayment Mechanism */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-white border border-blue-200/80 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#002E6E] flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#00BAF2]" />
                    Daily Micro-Deduction Repayment
                  </span>
                  <span className="rounded-full bg-blue-100 text-[#002E6E] px-2.5 py-0.5 text-xs font-black">
                    {formatINR(dailyMicroDeduction)} / day
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  No monthly EMI shock. Deducted automatically from your daily Paytm Soundbox evening settlement.
                </p>

                {/* Evening Settlement Split Simulation */}
                <div className="mt-4 rounded-xl bg-white border border-slate-200 p-3 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Average Daily Soundbox Collection:</span>
                    <strong className="text-slate-800">{formatINR(avgDailyCollection)}</strong>
                  </div>
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>- Daily Loan Micro-Deduction:</span>
                    <span>- {formatINR(dailyMicroDeduction)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-emerald-700 text-sm">
                    <span>Net Settled to Sharma Store Bank:</span>
                    <span>{formatINR(netDailySettlement)} / day</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-1/3 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="w-2/3 rounded-xl bg-gradient-to-r from-[#002E6E] to-[#00BAF2] py-3 text-xs font-black text-white hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Lock className="h-4 w-4" />
                  Instant Disburse {formatINR(amount)} to Bank
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>
          )}

          {step === "verifying" && (
            <div className="py-16 text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full border-4 border-[#00BAF2] border-t-transparent animate-spin" />
              <h3 className="text-lg font-bold text-slate-800">
                Verifying Soundbox UPI Settlement Ledger...
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Validating 180-day NPCI transaction velocity and generating instant digital loan agreement with partner bank.
              </p>
            </div>
          )}

          {step === "disbursed" && (
            <div className="py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="mx-auto h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                <CheckCircle2 className="h-12 w-12" />
              </div>

              <div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                  Loan Successfully Disbursed! 🎉
                </span>
                <h3 className="mt-3 text-3xl font-black text-slate-900">
                  {formatINR(amount)} Credited
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Transferred via IMPS to <strong>Sharma General Store</strong> (HDFC Bank A/c ending in <strong>**4821</strong>).
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Loan Account No:</span>
                  <strong className="text-slate-800">PYTM-MC-2026-88194</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Repayment Mode:</span>
                  <strong className="text-slate-800">Daily Soundbox Nodal Split</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Installment:</span>
                  <strong className="text-emerald-700 font-bold">{formatINR(dailyMicroDeduction)} / day</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">First Deduction:</span>
                  <strong className="text-slate-800">Tonight @ 9:00 PM Settlement</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="w-full max-w-md rounded-xl bg-[#002E6E] py-3 text-xs font-bold text-white hover:bg-[#002456] transition-all shadow-md"
              >
                Done • Back to Store Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
