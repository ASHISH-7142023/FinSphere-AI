"use client";

import React from "react";
import { currency } from "@/lib/utils";
import type { DashboardSummary } from "@/shared";

interface ReportsViewProps {
  report: {
    totalIncome: number;
    totalExpenses: number;
    categoryAnalysis: Array<{ category: string; amount: number; count: number }>;
  } | null;
  summary: DashboardSummary | null;
}

export default function ReportsView({ report, summary }: ReportsViewProps) {
  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h2 className="font-display-lg text-4xl font-extrabold tracking-tight text-white">Investment Report</h2>
          <p className="text-on-surface-variant text-base mt-1">Generated Real-time • Elite Tier Analytics</p>
        </div>
        <div className="flex gap-3 self-end">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-on-surface font-semibold text-xs hover:bg-surface-variant transition-all">
            <span className="material-symbols-outlined text-[18px]">download</span> Download PDF
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-on-surface font-semibold text-xs hover:bg-surface-variant transition-all">
            <span className="material-symbols-outlined text-[18px]">share</span> Share
          </button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
            <span className="material-symbols-outlined text-6xl">account_balance</span>
          </div>
          <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">
            Monthly Inflow
          </p>
          <h3 className="font-display-lg text-2xl font-extrabold text-on-surface">
            {currency(report?.totalIncome ?? 150000)}
          </h3>
          <div className="flex items-center gap-1.5 mt-4 text-primary text-xs font-bold">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span>+12.4% vs last month</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
            <span className="material-symbols-outlined text-6xl">show_chart</span>
          </div>
          <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">
            Monthly Outflow
          </p>
          <h3 className="font-display-lg text-2xl font-extrabold text-primary">
            -{currency(report?.totalExpenses ?? 102000)}
          </h3>
          <div className="flex items-center gap-1.5 mt-4 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>Processed across categories</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-white">
            <span className="material-symbols-outlined text-6xl">percent</span>
          </div>
          <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">
            Health Score Grade
          </p>
          <h3 className="font-display-lg text-2xl font-extrabold text-on-surface">
            {summary?.financialHealthGrade ?? "Excellent"}
          </h3>
          <div className="flex items-center gap-1.5 mt-4 text-on-surface-variant text-xs">
            <span className="material-symbols-outlined text-sm">star</span>
            <span>Level 9 Asset Stability</span>
          </div>
        </div>
      </div>

      {/* Detailed breakdowns */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Asset Allocation Breakdown */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <section className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h4 className="font-headline-md text-base font-bold text-on-surface">Asset Allocation Breakdown</h4>
              <span className="px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                Optimal Risk
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="relative flex justify-center">
                {/* Simulated Donut Chart */}
                <div className="w-52 h-52 rounded-full border-[16px] border-surface-container-highest relative flex items-center justify-center">
                  <div className="absolute inset-[-16px] rounded-full border-[16px] border-primary border-r-transparent border-b-transparent transform rotate-45"></div>
                  <div className="absolute inset-[-16px] rounded-full border-[16px] border-secondary-container border-l-transparent border-t-transparent border-r-transparent transform -rotate-12"></div>
                  <div className="absolute inset-[-16px] rounded-full border-[16px] border-tertiary-container border-l-transparent border-t-transparent border-r-transparent transform rotate-[140deg]"></div>
                  <div className="text-center">
                    <span className="text-on-surface-variant text-[10px] font-semibold uppercase">Diversify</span>
                    <div className="text-xl font-bold text-on-surface">94/100</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                    <span className="text-on-surface-variant">Equity Assets</span>
                  </div>
                  <span className="font-bold text-white">62%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary-container"></div>
                    <span className="text-on-surface-variant">Debt / Bonds</span>
                  </div>
                  <span className="font-bold text-white">24%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-tertiary-container"></div>
                    <span className="text-on-surface-variant">Gold / Commodities</span>
                  </div>
                  <span className="font-bold text-white">14%</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-xl bg-surface-container/50 border-l-4 border-primary text-xs leading-relaxed text-on-surface">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  smart_toy
                </span>
                <div>
                  <p className="font-bold text-primary mb-1">AI Risk Assessment</p>
                  <p className="text-on-surface-variant">
                    Your current allocation is <span className="text-on-surface font-semibold">"Moderately Aggressive."</span>{" "}
                    While Equity exposure is high, the 24% Debt cushion protects against short-term volatility. AI detects
                    a slight overweight in Tech stocks; consider rebalancing.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Performance Attribution */}
          <section className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h4 className="font-headline-md text-base font-bold text-on-surface">Category Spending Attribution</h4>
            </div>
            <div className="overflow-x-auto text-sm">
              <table className="w-full text-left">
                <thead className="bg-surface-container-high/50 text-xs text-on-surface-variant uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Category</th>
                    <th className="px-6 py-3 font-semibold">Amount Spent</th>
                    <th className="px-6 py-3 font-semibold">Transaction Volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(report?.categoryAnalysis ?? []).map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">{item.category}</td>
                      <td className="px-6 py-4 text-primary font-bold">{currency(item.amount)}</td>
                      <td className="px-6 py-4 text-on-surface-variant text-xs">{item.count} Transactions</td>
                    </tr>
                  ))}
                  {(report?.categoryAnalysis ?? []).length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant text-xs">
                        No spending entries registered for this cycle.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right tax sidebar */}
        <div className="xl:col-span-4 space-y-6">
          <section className="glass-card rounded-2xl p-6 border-l-2 border-tertiary/30">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-tertiary">receipt_long</span>
              <h4 className="font-headline-md text-base font-bold text-on-surface">Tax Implications</h4>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/5">
                <p className="text-on-surface-variant mb-1 font-semibold">Unrealized Gains</p>
                <p className="text-xl font-bold text-on-surface">₹1,42,000</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/5">
                  <p className="text-on-surface-variant text-[10px] uppercase font-semibold mb-1">LTCG (Est.)</p>
                  <p className="text-sm font-bold text-on-surface">₹12,450</p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/5">
                  <p className="text-on-surface-variant text-[10px] uppercase font-semibold mb-1">STCG (Est.)</p>
                  <p className="text-sm font-bold text-on-surface">₹3,120</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-tertiary/10 border border-tertiary/20 text-[11px] leading-relaxed text-tertiary-container">
                <span className="font-bold">Tax-Loss Harvesting Alert:</span> You have ₹8,200 in carry-forward losses.
                Offsetting these against STCG could save you ₹2,460 this fiscal year.
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6 glow-pulse">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <h4 className="font-headline-md text-base font-bold text-on-surface">AI Action Plan</h4>
            </div>
            <div className="space-y-4 text-xs">
              <div className="flex gap-3 p-3 rounded-xl bg-surface-container-highest/30">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                  1
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-white">Trim Tech Exposure</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Sell 5% of Tech ETF to lock in profits while valuations are high.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-3 rounded-xl bg-surface-container-highest/30">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-[10px]">
                  2
                </div>
                <div className="space-y-0.5">
                  <p className="font-bold text-white">Deploy Cash reserves</p>
                  <p className="text-[11px] text-on-surface-variant">
                    Liquidate ₹20k idle cash and move to Liquid / dividend Yield funds.
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2.5 btn-emerald-gradient rounded-xl font-bold text-xs text-on-primary">
              Execute Rebalancing Plan
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
