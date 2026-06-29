"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import type { Expense } from "@/shared";

interface CreditViewProps {
  token: string;
  expenses: Expense[];
}

export default function CreditView({ token, expenses }: CreditViewProps) {
  const [session] = useState(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("finsphere.session");
      if (raw) return JSON.parse(raw);
    }
    return null;
  });

  const income = session?.user?.monthlyIncome || 150000;

  // Calculate dynamic utilization based on transactions (Shopping/Food spends minus Card payments)
  const cardSpends = expenses.filter(e => e.category === "Shopping" || e.category === "Food" || e.category === "Entertainment").reduce((sum, e) => sum + e.amount, 0);
  const cardPayments = expenses.filter(e => e.description.toLowerCase().includes("credit card")).reduce((sum, e) => sum + e.amount, 0);
  const dynamicUtilization = Math.max(2, Math.min(95, 24 + Math.round((cardSpends - cardPayments) / 1000)));

  const [utilization, setUtilization] = useState(dynamicUtilization);
  const [paymentHistory, setPaymentHistory] = useState(98);
  const [creditAge, setCreditAge] = useState(6);
  const [simulatedScore, setSimulatedScore] = useState<number | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Sync state with calculated dynamic utilization
  useEffect(() => {
    setUtilization(dynamicUtilization);
  }, [dynamicUtilization]);

  // Run simulation automatically when credit parameters change
  useEffect(() => {
    runSimulation();
  }, [utilization, paymentHistory, creditAge]);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await apiRequest<{ estimatedScore: number; recommendations: string[] }>("/credit-profile/simulate", {
        method: "POST",
        body: JSON.stringify({
          utilization,
          paymentHistory,
          creditAge,
        }),
      }, token);
      setSimulatedScore(res.estimatedScore);
      setRecommendations(res.recommendations);
    } catch {
      // Fallback mockup calculation if server route not reachable
      const calculated = Math.round(
        500 + (paymentHistory / 100) * 200 - (utilization / 100) * 150 + creditAge * 10
      );
      setSimulatedScore(Math.min(900, Math.max(300, calculated)));
      setRecommendations([
        "Consider reducing your credit card utilization to below 30%.",
        "Maintain your excellent payment history record.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h2 className="font-display-lg text-4xl font-extrabold tracking-tight text-white">Wealth & Credit Engine</h2>
        <p className="text-on-surface-variant text-base mt-1">
          High-fidelity simulations and credit repair intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aggregated Net Worth */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 relative overflow-hidden border-l-4 border-l-primary">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-on-surface-variant text-xs uppercase tracking-wider font-semibold">
                Aggregated Wealth Net Worth
              </p>
              <h1 className="font-display-lg text-3xl font-extrabold text-primary mt-1">₹4,28,420.00</h1>
            </div>
            <div className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1.5 text-xs text-primary font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
              <span>Linked (4 Accounts)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-xs font-semibold">
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300">
              <p className="text-on-surface-variant">Liquid Cash</p>
              <p className="text-sm font-bold text-white mt-1">₹1.2L</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300">
              <p className="text-on-surface-variant">Investments</p>
              <p className="text-sm font-bold text-white mt-1">₹2.8L</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300">
              <p className="text-on-surface-variant">Digital Gold</p>
              <p className="text-sm font-bold text-white mt-1">₹24K</p>
            </div>
            <div className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300">
              <p className="text-on-surface-variant">Liabilities</p>
              <p className="text-sm font-bold text-error mt-1">₹0.00</p>
            </div>
          </div>
        </div>

        {/* Wealth AI Advice */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
              smart_toy
            </span>
            <h3 className="font-headline-md text-base font-bold text-on-surface">Wealth AI</h3>
          </div>
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-surface-container rounded-xl border-l-4 border-l-primary italic text-on-surface-variant leading-relaxed">
              "Gold prices are dipping. A ₹500 SIP today could increase your 24K holdings by 1.2% before the festival season rally."
            </div>
            <div className="p-3 bg-surface-container-high rounded-xl leading-relaxed">
              <p className="font-bold text-on-surface mb-1">Strategy Tip</p>
              <p className="text-on-surface-variant text-xs">
                Your credit score is {simulatedScore || 782}. You qualify for an exclusive 8.5% interest rate on home
                improvement loans.
              </p>
            </div>
          </div>
        </div>

        {/* Gold Simulator Box */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    savings
                  </span>
                </div>
                <h3 className="font-headline-md text-base font-bold text-white">Digital Gold Index</h3>
              </div>
              <div className="text-right text-xs">
                <p className="text-on-surface-variant font-semibold">Live Price (24K/gm)</p>
                <p className="text-primary font-bold">
                  ₹7,242.40 <span className="text-[10px]">▲ 0.4%</span>
                </p>
              </div>
            </div>
            <p className="text-on-surface-variant text-xs leading-relaxed mb-6">
              Invest in pure 24K gold with as little as ₹1. Vault-secured, fully insured gold assets directly at your
              fingertips.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex-1 bg-surface-container hover:bg-surface-container-high border border-white/5 py-3 rounded-xl font-bold transition-all text-xs text-white">
              Sell
            </button>
            <button className="flex-1 bg-primary text-background py-3 rounded-xl font-bold hover:brightness-110 shadow-lg shadow-primary/20 transition-all text-xs">
              Buy Now
            </button>
          </div>
        </div>

        {/* Credit Score Gauge Component */}
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-28 h-28 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" fill="none" r="15.915" stroke="rgba(255,255,255,0.05)" strokeWidth="3"></circle>
              <circle
                className="emerald-glow"
                cx="18"
                cy="18"
                fill="none"
                r="15.915"
                stroke="#42e5b0"
                strokeDasharray={`${((simulatedScore || 782) / 900) * 100}, 100`}
                strokeLinecap="round"
                strokeWidth="3"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-on-surface font-bold text-xl">{simulatedScore || 782}</span>
              <span className="text-primary text-[8px] font-bold uppercase tracking-wider">FICO SCORE</span>
            </div>
          </div>
          <p className="text-on-surface font-bold text-sm">Credit Score Status</p>
          <p className="text-on-surface-variant text-[11px] mt-0.5">Experian Real-time Sync Active</p>
        </div>

        {/* Loan pre-approval widget */}
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-surface-container-high to-surface-container overflow-hidden relative">
          <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-7xl opacity-5 text-white">
            account_balance
          </span>
          <h3 className="font-headline-md text-base font-bold text-white mb-2">Instant Pre-Approved Loan</h3>
          <p className="text-on-surface-variant text-xs leading-relaxed mb-6 font-medium">
            Eligible credit limit up to ₹{(income * 3.33).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span>Interest Rate</span>
              <span className="text-on-surface font-bold">10.5% p.a.</span>
            </div>
            <div className="flex justify-between items-center text-on-surface-variant">
              <span>Flexible Tenure</span>
              <span className="text-on-surface font-bold">Up to 60 Months</span>
            </div>
          </div>
          <button className="w-full mt-6 bg-white/5 border border-white/10 hover:bg-white/10 py-2.5 rounded-xl font-bold text-xs text-white transition-colors">
            Apply Now
          </button>
        </div>

        {/* Credit Simulator sliders form */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <h3 className="font-headline-md text-base font-bold mb-6 text-white">Interactive FICO Score Simulator</h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-on-surface-variant">Credit Card Utilization</span>
                <span className="text-primary font-bold">{utilization}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={utilization}
                onChange={(e) => setUtilization(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-on-surface-variant">Payment On-Time History</span>
                <span className="text-primary font-bold">{paymentHistory}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={paymentHistory}
                onChange={(e) => setPaymentHistory(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-on-surface-variant">Credit Account Age (Years)</span>
                <span className="text-primary font-bold">{creditAge} Years</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={creditAge}
                onChange={(e) => setCreditAge(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <button
              onClick={runSimulation}
              disabled={loading}
              className="w-full btn-emerald-gradient py-3 rounded-xl text-on-primary font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">speed</span>
              {loading ? "Calculating..." : "Run Simulator Engine"}
            </button>
          </div>

          {simulatedScore !== null && (
            <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-on-surface-variant">Simulated Projection Score:</span>
                <span className="text-xl font-extrabold text-primary">{simulatedScore}</span>
              </div>
              {recommendations.length > 0 && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs text-on-surface-variant space-y-2 text-left">
                  <p className="font-bold text-white text-xs mb-1">AI Action Plan:</p>
                  {recommendations.map((rec, i) => (
                    <p key={i} className="flex gap-2 items-start text-on-surface-variant">
                      <span className="text-primary font-bold">•</span>
                      <span>{rec}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
