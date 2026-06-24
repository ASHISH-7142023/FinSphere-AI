"use client";

import React, { useState } from "react";
import { currency } from "@/lib/utils";
import type { Budget, Expense } from "@/shared";

interface BudgetsViewProps {
  budgets: Budget[];
  expenses: Expense[];
  alerts: Array<{ category: string; overBy: number }>;
  onOpenAddModal: () => void;
  onApplyOptimization: () => void;
}

export default function BudgetsView({
  budgets,
  expenses,
  alerts,
  onOpenAddModal,
  onApplyOptimization,
}: BudgetsViewProps) {
  const [autoAdjust, setAutoAdjust] = useState(true);
  const [dismissedInsight, setDismissedInsight] = useState(false);

  // Sum expenses per category
  const categorySpent = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <h2 className="font-display-lg text-4xl font-extrabold tracking-tight text-white">Budget Planner</h2>
          <p className="text-on-surface-variant text-base mt-1">
            Precision management for your elite financial ecosystem.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 self-end">
          <div className="flex items-center gap-3 bg-surface-container px-4 py-2.5 rounded-xl border border-white/5 shadow-inner">
            <span className="font-label-md text-xs text-on-surface-variant font-semibold">Auto-Adjust</span>
            <button
              aria-pressed={autoAdjust}
              onClick={() => setAutoAdjust(!autoAdjust)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                autoAdjust ? "bg-primary" : "bg-surface-container-highest"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  autoAdjust ? "translate-x-6" : "translate-x-1"
                }`}
              ></span>
            </button>
            <span className="material-symbols-outlined text-primary text-sm ai-pulse">auto_awesome</span>
          </div>
          <button
            onClick={onOpenAddModal}
            className="btn-emerald-gradient px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all text-xs"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>New Budget</span>
          </button>
        </div>
      </div>

      {/* AI Smart Insight Banner */}
      {!dismissedInsight && (
        <div className="glass-panel rounded-xl p-6 border-l-4 border-l-primary flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="p-3 bg-primary/10 rounded-full">
            <span className="material-symbols-outlined text-primary text-2xl">smart_toy</span>
          </div>
          <div className="flex-1">
            <h3 className="font-headline-md text-base font-bold text-on-surface mb-1">AI Smart Insight</h3>
            <p className="text-on-surface-variant text-sm">
              Your dining spend is 15% higher than usual this month. Consider a{" "}
              <span className="text-primary font-bold">₹2,000 limit adjustment</span> to stay on track for your vacation goal.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setDismissedInsight(true)}
              className="px-5 py-2 rounded-lg bg-surface-container-highest text-on-surface font-label-md text-xs hover:bg-surface-bright transition-colors"
            >
              Dismiss
            </button>
            <button
              onClick={onApplyOptimization}
              className="px-5 py-2 rounded-lg bg-primary/20 text-primary border border-primary/30 font-bold text-xs hover:bg-primary/30 transition-colors"
            >
              Apply Optimization
            </button>
          </div>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Chart Section */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h4 className="font-headline-md text-base font-bold text-on-surface">Spending Velocity</h4>
                <p className="text-[11px] text-on-surface-variant font-medium">
                  Actual Spend vs. Planned Trajectory
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                  <span className="text-on-surface-variant">Actual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20 border border-white/40"></span>
                  <span className="text-on-surface-variant">Planned</span>
                </div>
              </div>
            </div>

            <div className="h-64 relative w-full overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#42e5b0" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#42e5b0" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                {/* Planned path */}
                <path
                  d="M0,180 L100,165 L200,150 L300,140 L400,130 L500,115 L600,105 L700,95 L800,85"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeDasharray="4"
                  strokeWidth="2"
                ></path>
                {/* Actual Area */}
                <path
                  d="M0,180 L100,170 L200,165 L300,145 L400,155 L500,130 L600,120 L700,100 L800,80 V200 H0 Z"
                  fill="url(#areaGradient)"
                ></path>
                {/* Actual Line */}
                <path
                  d="M0,180 L100,170 L200,165 L300,145 L400,155 L500,130 L600,120 L700,100 L800,80"
                  fill="none"
                  stroke="#42e5b0"
                  strokeLinecap="round"
                  strokeWidth="3"
                  className="chart-path"
                ></path>
                <circle cx="500" cy="130" fill="#42e5b0" r="4" className="pulsing-glow"></circle>
              </svg>
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-[10px] text-on-surface-variant font-bold uppercase tracking-wider opacity-50">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid from code.html */}
          <div className="glass-panel rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary text-lg group-hover:scale-110 transition-transform">home</span>
                  <span className="font-label-md text-on-surface">Housing</span>
                </div>
                <div className="text-xl font-bold text-on-surface">₹45,000</div>
                <p className="text-[10px] text-on-surface-variant mt-1">Fixed Monthly Cost</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary text-lg group-hover:scale-110 transition-transform">shopping_cart</span>
                  <span className="font-label-md text-on-surface">Groceries</span>
                </div>
                <div className="text-xl font-bold text-on-surface">₹12,000</div>
                <p className="text-[10px] text-on-surface-variant mt-1">Variable Allocation</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary text-lg group-hover:scale-110 transition-transform">commute</span>
                  <span className="font-label-md text-on-surface">Transport</span>
                </div>
                <div className="text-xl font-bold text-on-surface">₹8,500</div>
                <p className="text-[10px] text-on-surface-variant mt-1">Fuel & Commute</p>
              </div>
            </div>
          </div>

          {/* Active Limits & Tracking */}
          <div className="glass-panel rounded-xl p-6">
            <h3 className="font-headline-md text-base font-bold mb-6 text-white">Active Limits & Tracking</h3>

            {alerts.length > 0 && (
              <div className="mb-6 rounded-xl border border-danger/40 bg-danger/10 p-3 text-xs text-danger font-semibold">
                {alerts.map((item) => `${item.category} limit overspent by ${currency(item.overBy)}`).join(" | ")}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {budgets.map((b) => {
                const spent = categorySpent[b.category] || 0;
                const ratio = Math.min(100, (spent / b.limitAmount) * 100);
                const isOver = spent > b.limitAmount;
                return (
                  <div
                    key={b.id}
                    className="bg-white/5 rounded-xl p-5 border border-white/5 hover:border-primary/20 transition-all hover:scale-[1.02] duration-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-secondary-container/30 rounded-xl">
                        <span className="material-symbols-outlined text-secondary text-lg">
                          {b.category === "Food"
                            ? "restaurant"
                            : b.category === "Travel"
                            ? "flight"
                            : b.category === "Shopping"
                            ? "shopping_bag"
                            : "receipt_long"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase">Cycle Month</span>
                        <p className="text-on-surface font-semibold text-xs">{b.month}</p>
                      </div>
                    </div>

                    <h5 className="font-headline-md text-sm font-bold text-on-surface mb-1">{b.category}</h5>
                    <div className="flex justify-between items-baseline mb-3 text-xs">
                      <span className="text-on-surface-variant">
                        Spent <span className="text-on-surface font-bold">{currency(spent)}</span>
                      </span>
                      <span className="text-[11px] text-on-surface-variant">Limit {currency(b.limitAmount)}</span>
                    </div>

                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          isOver ? "bg-error" : "bg-primary"
                        }`}
                        style={{ width: `${ratio}%` }}
                      ></div>
                    </div>

                    <p
                      className={`text-[10px] font-semibold ${
                        isOver ? "text-error" : "text-on-surface-variant opacity-60"
                      }`}
                    >
                      {isOver ? "Limit Exceeded - Budget alert triggered" : `${Math.round(ratio)}% of monthly budget utilized`}
                    </p>
                  </div>
                );
              })}
              {budgets.length === 0 && (
                <div className="col-span-2 py-8 text-center text-on-surface-variant text-sm bg-white/5 rounded-xl border border-white/5">
                  No budgets configured. Click "New Budget" to begin.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side alerts feeds */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">account_balance</span>
              <h4 className="font-headline-md text-base font-bold text-on-surface">Savings Impact</h4>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-on-surface-variant">Emergency Fund</span>
                  <span className="text-primary">+₹4,500 projection</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/45 rounded-full" style={{ width: "75%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-on-surface-variant">Tesla Roadster</span>
                  <span className="text-primary">+₹1,200 projection</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/45 rounded-full" style={{ width: "22%" }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-on-surface-variant">European Summer</span>
                  <span className="text-primary">+₹8,400 projection</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary/45 rounded-full" style={{ width: "48%" }}></div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl text-xs leading-relaxed text-on-surface">
              <span className="font-bold text-primary">Tip:</span> If you maintain your current spending velocity, you'll
              reach your 'Emergency Fund' goal <span className="font-bold">14 days earlier</span> than forecasted.
            </div>
          </div>

          {/* Recent Alerts Panel */}
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-headline-md text-base font-bold text-on-surface">Recent Alerts</h4>
              <button className="text-xs font-label-sm text-primary uppercase tracking-widest hover:underline">
                View All
              </button>
            </div>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors">
                <div className="mt-1 w-2 h-2 rounded-full bg-error animate-pulse"></div>
                <div>
                  <p className="font-semibold text-on-surface">Netflix Subscription</p>
                  <p className="text-on-surface-variant mt-0.5">Recurring payment increased by ₹150</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors">
                <div className="mt-1 w-2 h-2 rounded-full bg-primary"></div>
                <div>
                  <p className="font-semibold text-on-surface">Zomato Refund</p>
                  <p className="text-on-surface-variant mt-0.5">₹420 credited back to Dining</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors">
                <div className="mt-1 w-2 h-2 rounded-full bg-secondary"></div>
                <div>
                  <p className="font-semibold text-on-surface">Shell Fuel Stop</p>
                  <p className="text-on-surface-variant mt-0.5">Transaction categorized under Travel</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ad Promo Card */}
          <div className="relative h-48 rounded-xl overflow-hidden group cursor-pointer border border-white/5">
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAThSoIY3jJ6qevV5YrT1E5JJZtRYeeB2FfqAUrv4xY_rkUKLFbtb2NMX2bEPTTQE3tC5NZkOutVG6065TJ49Itnw1OPeO-KcMfNCz1JNe0pwV8qL9YBzzpTnb42ZmghDrdpEUsYsNjGEm1jZtA3isgbsEcht9sm6rjvnQimpuIZcWEdIViOHd8ZUasjU9c1KRTrx85W-LO0qSnHYZ4scZN5PyQ9hsykVTyc8RVHai1RZih-2d2wxQmBw-rP52GYvT0PNpVB0hx42ZK')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <span className="text-[10px] font-label-sm text-primary bg-primary/20 px-2 py-0.5 rounded uppercase tracking-widest font-bold">
                Limited Offer
              </span>
              <h5 className="text-on-surface font-bold text-lg mt-1">Unlock Sapphire Perks</h5>
              <p className="text-xs text-on-surface-variant">Get 4% cashback on all travel budgets.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
