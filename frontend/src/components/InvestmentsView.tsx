"use client";

import React from "react";
import { currency } from "@/lib/utils";
import type { Investment } from "@/shared";

interface InvestmentsViewProps {
  investments: Investment[];
  onOpenAddModal: () => void;
}

export default function InvestmentsView({ investments, onOpenAddModal }: InvestmentsViewProps) {
  const investedVal = investments.reduce((acc, i) => acc + i.investedAmount, 0);
  const currentVal = investments.reduce((acc, i) => acc + i.currentValue, 0);
  const profitVal = currentVal - investedVal;
  const growthPct = investedVal > 0 ? (profitVal / investedVal) * 100 : 12.4;

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <h2 className="font-display-lg text-4xl font-extrabold tracking-tight text-white">Investments</h2>
          <p className="text-on-surface-variant text-base mt-1">Real-time asset tracking and AI-driven growth forecasting.</p>
        </div>
        <div className="flex gap-4 self-end">
          <button
            onClick={onOpenAddModal}
            className="btn-emerald-gradient px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all text-xs"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New SIP / Asset</span>
          </button>
        </div>
      </div>

      {/* Top Summary Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Value Summary */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-on-surface-variant text-xs uppercase tracking-wider font-semibold mb-1">
                Total Investment Value
              </p>
              <div className="flex items-baseline gap-3">
                <h3 className="font-display-lg text-3xl font-extrabold text-on-surface">
                  {currency(currentVal || 248392)}
                </h3>
                <span className="text-primary bg-primary/10 px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 pulsing-glow">
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                  +{growthPct.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-2xl text-primary">
              <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                account_balance
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
            <div>
              <p className="text-on-surface-variant uppercase font-semibold text-[10px] mb-0.5">Invested Amount</p>
              <p className="font-bold text-sm text-on-surface">{currency(investedVal || 212000)}</p>
            </div>
            <div>
              <p className="text-on-surface-variant uppercase font-semibold text-[10px] mb-0.5">Current Value</p>
              <p className="font-bold text-sm text-primary">{currency(currentVal || 248392)}</p>
            </div>
            <div>
              <p className="text-on-surface-variant uppercase font-semibold text-[10px] mb-0.5">Overall profit</p>
              <p className="font-bold text-sm text-primary">+{currency(profitVal || 36392)}</p>
            </div>
          </div>

          {/* Sparkline Visual SVG */}
          <div className="mt-8 h-28 w-full">
            <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#42e5b0", stopOpacity: 0.45 }}></stop>
                  <stop offset="100%" style={{ stopColor: "#42e5b0", stopOpacity: 0 }}></stop>
                </linearGradient>
              </defs>
              <path d="M0,70 C150,95 200,20 350,55 C450,80 550,15 700,45 C800,70 900,20 1000,35 L1000,100 L0,100 Z" fill="url(#lineGrad)"></path>
              <path className="chart-path" d="M0,70 C150,95 200,20 350,55 C450,80 550,15 700,45 C800,70 900,20 1000,35" fill="none" stroke="#42e5b0" strokeWidth="3.5"></path>
            </svg>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center">
          <h4 className="font-headline-md text-base font-bold mb-4 self-start text-on-surface">Asset Allocation</h4>

          <div className="relative w-36 h-36 mb-6">
            <svg className="w-full h-full -rotate-90 animate-float" viewBox="0 0 36 36">
              <circle cx="18" cy="18" fill="none" r="16" stroke="#42e5b0" strokeDasharray="60, 100" strokeWidth="3.5" className="chart-path"></circle>
              <circle cx="18" cy="18" fill="none" r="16" stroke="#ffbca2" strokeDasharray="25, 100" strokeDashoffset="-60" strokeWidth="3.5" className="chart-path"></circle>
              <circle cx="18" cy="18" fill="none" r="16" stroke="#bec6e0" strokeDasharray="15, 100" strokeDashoffset="-85" strokeWidth="3.5" className="chart-path"></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Growth</span>
              <span className="text-on-surface font-bold text-base">High</span>
            </div>
          </div>

          <div className="grid grid-cols-3 w-full gap-2 text-xs">
            <div className="flex flex-col items-center">
              <span className="w-2 h-2 rounded-full bg-primary mb-1"></span>
              <p className="text-[10px] text-on-surface-variant">Equity</p>
              <p className="font-bold">60%</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2 h-2 rounded-full bg-tertiary mb-1"></span>
              <p className="text-[10px] text-on-surface-variant">Debt</p>
              <p className="font-bold">25%</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="w-2 h-2 rounded-full bg-secondary mb-1"></span>
              <p className="text-[10px] text-on-surface-variant">Hybrid</p>
              <p className="font-bold">15%</p>
            </div>
          </div>
        </div>
      </div>

      {/* SIPs Schedules & AI Advisor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 glass-card rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline-md text-base font-bold text-white">Active Investment Assets</h4>
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">SIP Schedules</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-on-surface-variant font-label-sm border-b border-white/10 text-xs">
                  <th className="pb-3">Asset Description</th>
                  <th className="pb-3">Invested Capital</th>
                  <th className="pb-3">Current Valuation</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3 text-right">Returns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {investments.map((item) => {
                  const gain = item.currentValue - item.investedAmount;
                  const ratio = item.investedAmount > 0 ? (gain / item.investedAmount) * 100 : 0;
                  return (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-sm">analytics</span>
                          </div>
                          <span className="font-bold text-on-surface">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-4">{currency(item.investedAmount)}</td>
                      <td className="py-4 font-bold text-on-surface">{currency(item.currentValue)}</td>
                      <td className="py-4 text-xs text-on-surface-variant">{item.assetType}</td>
                      <td className="py-4 text-right">
                        <span className={`font-bold ${gain >= 0 ? "text-primary" : "text-error"}`}>
                          {gain >= 0 ? "+" : ""}
                          {ratio.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {investments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant text-sm">
                      No active investments in database. Create one using "New SIP / Asset"!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI advisor recommendations card */}
        <div className="glass-card rounded-3xl p-6 flex flex-col relative overflow-hidden group border border-primary/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  smart_toy
                </span>
                <h4 className="font-bold text-primary text-xs uppercase tracking-wider">AI advisor</h4>
              </div>
              <div className="space-y-4 text-[11px] leading-relaxed">
                <div className="p-3.5 rounded-2xl bg-white/5 border-l-4 border-primary">
                  <p className="font-bold text-on-surface mb-0.5">Exposure Alert</p>
                  <p className="text-on-surface-variant">
                    Your portfolio is heavy on Small Cap (42%). Consider diversifying into Large Cap for stability.
                  </p>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border-l-4 border-tertiary">
                  <p className="font-bold text-on-surface mb-0.5">Tax Harvesting</p>
                  <p className="text-on-surface-variant">
                    You can save up to ₹4,200 by booking losses on underperforming sector funds this month.
                  </p>
                </div>
              </div>
            </div>
            <button className="mt-6 w-full py-2.5 rounded-xl border border-primary/40 text-primary font-bold text-xs hover:bg-primary/10 transition-all flex items-center justify-center gap-1">
              Diversify Assets <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Holdings Table */}
      <div className="glass-card rounded-[2rem] p-6">
        <h4 className="font-headline-md text-base font-bold mb-6 text-white">Top Holdings</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-on-surface-variant font-label-sm border-b border-white/10 text-xs">
                <th className="pb-3">Asset</th>
                <th className="pb-3">Last Price</th>
                <th className="pb-3">Day's Change</th>
                <th className="pb-3">Returns Valuation</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              <tr className="group hover:bg-white/5 transition-all">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-9 h-9 rounded-xl object-contain p-1 bg-white/5"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHdykhZk8EcoLY7o17h7xvG74jTO7k8aMwj4rhQrZptWRYJ9nNpg_25m9Dm5t6eKWUwAmkilbn68n8XwyhjjwSifdzSUTEeDvMb17lLiuAUwCA3oxXaTf9YN27-3elnB0LhVjXxhfUfMMR2h597aqP1Vxq8a1qNW1UN-dbujMKq-xKrdWE6APLBi7DFwJASYKOvnMyj3NGT-o_nL0-nAVHu8GvKYokPJ3OIKwzBDovKuTP4jZp3nkwwVuQk0R6i7fWQaZkgvweTM-C"
                      alt="Apple"
                    />
                    <div>
                      <p className="font-bold text-white">Apple Inc (AAPL)</p>
                      <p className="text-xs text-on-surface-variant">Technology • Large Cap</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 font-bold text-white">$182.52</td>
                <td className="py-4 text-primary font-bold">+$3.12 (1.8%)</td>
                <td className="py-4 font-semibold text-primary">+$12,450.00</td>
                <td className="py-4 text-right">
                  <button className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-primary hover:text-background transition-colors">
                    Buy More
                  </button>
                </td>
              </tr>

              <tr className="group hover:bg-white/5 transition-all">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img
                      className="w-9 h-9 rounded-xl object-contain p-1 bg-white/5"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJwGH4yj86PhtEpNL93cLx-kf__7MYGSGl4Eahy1WxL413yfFwcIxG3F8O7jWpVE1nlSHtmsnDsgX0GGnqxD4R3WKVk84hulA1FTJXQOJHkeEAbyO7dRhHX_elBq77pZd3RGcHXV5FrO_xV530_kBIKc4CE8X4JumBHVsm0G7RATKbZAV8ubbhwf3yzJy_En9yNprs4XX2sTBLx0Q76QrulPgvOo5lk82KgGWjKY0LmRW3ci1Q24V4qfqDkeRFUk1mHxN_il7zi_6s"
                      alt="Nvidia"
                    />
                    <div>
                      <p className="font-bold text-white">Nvidia Corp (NVDA)</p>
                      <p className="text-xs text-on-surface-variant">Semiconductors • High Growth</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 font-bold text-white">$460.18</td>
                <td className="py-4 text-primary font-bold">+$12.45 (2.7%)</td>
                <td className="py-4 font-semibold text-primary">+$42,100.00</td>
                <td className="py-4 text-right">
                  <button className="bg-primary/10 text-primary px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-primary hover:text-background transition-colors">
                    Buy More
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
