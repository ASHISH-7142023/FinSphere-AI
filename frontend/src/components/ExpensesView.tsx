"use client";

import React, { useState } from "react";
import { currency } from "@/lib/utils";
import type { Expense, DashboardSummary } from "@/shared";

interface ExpensesViewProps {
  expenses: Expense[];
  summary: DashboardSummary | null;
  onOpenAddModal: () => void;
}

export default function ExpensesView({ expenses, summary, onOpenAddModal }: ExpensesViewProps) {
  const [search, setSearch] = useState("");
  const [cycleTab, setCycleTab] = useState<"month" | "quarter" | "year">("month");

  // Sum expenses per category
  const categorySum = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {} as Record<string, number>);

  const foodSum = categorySum["Food"] || 14500;
  const travelSum = categorySum["Travel"] || 8000;
  const shoppingSum = categorySum["Shopping"] || 18500;
  const billsSum = categorySum["Bills"] || 22000;


  // Filter transactions
  const filtered = expenses.filter((e) =>
    e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h2 className="font-display-lg text-4xl font-extrabold tracking-tight">Expense Analysis</h2>
          <p className="text-on-surface-variant text-base mt-1">Deep-dive into your financial flow and spending patterns.</p>
        </div>
        <div className="flex flex-wrap gap-3 self-end">
          <div className="bg-surface-container p-1 rounded-xl flex items-center border border-white/5">
            <button 
              onClick={() => setCycleTab("month")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${cycleTab === "month" ? "bg-primary text-background shadow-md" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Month
            </button>
            <button 
              onClick={() => setCycleTab("quarter")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${cycleTab === "quarter" ? "bg-primary text-background shadow-md" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Quarter
            </button>
            <button 
              onClick={() => setCycleTab("year")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${cycleTab === "year" ? "bg-primary text-background shadow-md" : "text-on-surface-variant hover:text-on-surface"}`}
            >
              Year
            </button>
          </div>
          <button onClick={onOpenAddModal} className="btn-emerald-gradient px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all text-xs">
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Cash Flow Sankey Visual */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-[2rem] p-6 relative overflow-hidden conic-border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-base font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_tree</span>
              Cash Flow Architecture
            </h3>
            <div className="flex gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="text-on-surface-variant">Inflow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
                <span className="text-on-surface-variant">Outflow</span>
              </div>
            </div>
          </div>

          <div className="relative h-80 w-full flex items-center justify-between gap-6 md:gap-12">
            
            {/* Inflow Nodes */}
            <div className="space-y-6 w-36 md:w-44">
              <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-xl">
                <p className="text-[10px] font-bold text-primary uppercase mb-1">Primary Salary</p>
                <p className="font-headline-md text-base font-bold text-on-surface">{currency(summary?.totalIncome ?? 150000)}</p>
              </div>
              <div className="bg-primary/5 border-l-4 border-primary/40 p-4 rounded-r-xl">
                <p className="text-[10px] font-bold text-primary/70 uppercase mb-1">Portfolio Assets</p>
                <p className="font-headline-md text-base font-bold text-on-surface">{currency(summary?.portfolioValue ?? 815000)}</p>
              </div>
            </div>

            {/* Path SVGs */}
            <div className="flex-1 relative h-full">
              <svg className="absolute inset-0 w-full h-full opacity-35" preserveAspectRatio="none" viewBox="0 0 400 300">
                <path d="M 0 50 C 150 50, 250 80, 400 80" fill="none" stroke="#42e5b0" strokeWidth="25" className="chart-path"></path>
                <path d="M 0 50 C 150 50, 250 140, 400 150" fill="none" stroke="#42e5b0" strokeWidth="15" className="chart-path"></path>
                <path d="M 0 200 C 150 200, 250 210, 400 220" fill="none" stroke="#ffbca2" strokeWidth="18" className="chart-path"></path>
              </svg>
            </div>

            {/* Outflow Nodes */}
            <div className="space-y-4 w-36 md:w-44 text-right">
              <div className="bg-surface-container-highest/50 border-r-4 border-primary p-2.5 rounded-l-xl">
                <p className="text-[9px] font-bold text-on-surface-variant uppercase mb-0.5">Food &amp; Dining</p>
                <p className="font-label-md text-sm text-on-surface font-semibold">{currency(foodSum)}</p>
              </div>
              <div className="bg-surface-container-highest/50 border-r-4 border-tertiary p-2.5 rounded-l-xl">
                <p className="text-[9px] font-bold text-on-surface-variant uppercase mb-0.5">Travel</p>
                <p className="font-label-md text-sm text-on-surface font-semibold">{currency(travelSum)}</p>
              </div>
              <div className="bg-surface-container-highest/50 border-r-4 border-secondary p-2.5 rounded-l-xl">
                <p className="text-[9px] font-bold text-on-surface-variant uppercase mb-0.5">Shopping</p>
                <p className="font-label-md text-sm text-on-surface font-semibold">{currency(shoppingSum)}</p>
              </div>
              <div className="bg-surface-container-highest/50 border-r-4 border-primary/40 p-2.5 rounded-l-xl">
                <p className="text-[9px] font-bold text-on-surface-variant uppercase mb-0.5">Bills &amp; Utility</p>
                <p className="font-label-md text-sm text-on-surface font-semibold">{currency(billsSum)}</p>
              </div>
            </div>

          </div>
        </div>

        {/* AI Action Box */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="glass-card rounded-[2rem] p-6 flex-1 border-l-4 border-primary shadow-lg shadow-primary/5 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  auto_awesome
                </span>
              </div>
              <h3 className="font-headline-md text-base font-bold">AI Insights</h3>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-white/5 border-b-2 border-b-primary">
                <p className="font-bold text-primary mb-1">Unusual Spending Detected</p>
                <p className="text-on-surface-variant">Your dining out is 24% higher than average this month, primarily driven by weekend lounge visits.</p>
              </div>
              <div className="bg-surface-container-low p-3.5 rounded-xl border border-white/5">
                <p className="font-bold text-tertiary mb-1">Savings Opportunity</p>
                <p className="text-on-surface-variant">Consolidating your multiple storage subscriptions could save you approximately ₹1,500/mo.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Manager */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-[2rem] p-6 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-base font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">event_repeat</span>
                Subscription Manager
              </h3>
              <p className="text-on-surface-variant text-[11px] mt-0.5">Tracking 3 recurring digital services</p>
            </div>
            <button className="bg-white/5 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-white/10 transition-colors text-white">
              Manage All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center font-bold text-red-500">N</div>
              <div className="flex-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-white">Netflix Ultra</span>
                  <span className="font-bold text-white">₹649</span>
                </div>
                <p className="text-on-surface-variant text-[10px] mt-1">Due: June 24</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center font-bold text-orange-500">A</div>
              <div className="flex-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-white">AWS Cloud</span>
                  <span className="font-bold text-white">₹11,420</span>
                </div>
                <p className="text-on-surface-variant text-[10px] mt-1">Due: June 28</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center font-bold text-blue-500">F</div>
              <div className="flex-1 text-xs">
                <div className="flex justify-between">
                  <span className="font-bold text-white">Figma Team</span>
                  <span className="font-bold text-white">₹3,200</span>
                </div>
                <p className="text-on-surface-variant text-[10px] mt-1">Due: June 29</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Ledger */}
        <div className="col-span-12 glass-card rounded-[2rem] p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-headline-md text-base font-bold">Transaction History</h3>
            <div className="relative w-full md:max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
              <input
                type="text"
                placeholder="Search description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0e1511] border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
              />
            </div>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="border-b border-white/5 text-on-surface-variant uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">receipt</span>
                        </div>
                        <span className="font-semibold text-white">{item.description}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-on-surface-variant">{item.category}</td>
                    <td className="py-3.5 text-on-surface-variant">{item.date}</td>
                    <td className="py-3.5 text-right font-bold text-white">{currency(item.amount)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-on-surface-variant">
                      No matching transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
