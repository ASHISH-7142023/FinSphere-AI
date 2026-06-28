"use client";

import React, { useState } from "react";
import { currency } from "@/lib/utils";
import type { Expense } from "@/shared";
import { EXPENSE_CATEGORIES } from "@/shared";

interface PersonalExpenseLedgerProps {
  expenses: Expense[];
  onOpenAddModal: () => void;
  onDeleteExpense: (id: string) => Promise<void>;
  monthlySalary: number;
}

// Category configuration for icons and color accents
const getCategoryConfig = (category: string) => {
  switch (category) {
    case "Food":
      return { icon: "restaurant", color: "text-[#42e5b0]", bg: "bg-[#42e5b0]/10", method: "Amex Centurion", methodIcon: "credit_card" };
    case "Travel":
      return { icon: "flight_takeoff", color: "text-blue-400", bg: "bg-blue-400/10", method: "Wire Transfer", methodIcon: "payments" };
    case "Shopping":
      return { icon: "shopping_bag", color: "text-purple-400", bg: "bg-purple-400/10", method: "Visa Infinite", methodIcon: "credit_card" };
    case "Bills":
      return { icon: "electric_bolt", color: "text-yellow-400", bg: "bg-yellow-400/10", method: "Apple Pay", methodIcon: "account_balance_wallet" };
    case "Entertainment":
      return { icon: "sports_esports", color: "text-pink-400", bg: "bg-pink-400/10", method: "Apple Pay", methodIcon: "account_balance_wallet" };
    case "Education":
      return { icon: "school", color: "text-orange-400", bg: "bg-orange-400/10", method: "Wire Transfer", methodIcon: "payments" };
    case "Health":
      return { icon: "fitness_center", color: "text-red-400", bg: "bg-red-400/10", method: "Visa Infinite", methodIcon: "credit_card" };
    default:
      return { icon: "payments", color: "text-emerald-400", bg: "bg-emerald-400/10", method: "UPI QR", methodIcon: "qr_code_2" };
  }
};

export default function PersonalExpenseLedger({
  expenses,
  onOpenAddModal,
  onDeleteExpense,
  monthlySalary,
}: PersonalExpenseLedgerProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [deletingIds, setDeletingIds] = useState<Record<string, boolean>>({});

  // Filter expenses based on search query and category
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate total monthly spending based on all loaded expenses
  const totalMonthlySpending = expenses.reduce((sum, e) => sum + e.amount, 0);
  const updatedSalary = monthlySalary - totalMonthlySpending;

  const handleDelete = async (id: string) => {
    setDeletingIds((prev) => ({ ...prev, [id]: true }));
    try {
      await onDeleteExpense(id);
    } catch (error) {
      console.error("Failed to delete expense:", error);
    } finally {
      setDeletingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & KPI Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        <div className="space-y-1">
          <span className="text-primary font-bold text-xs uppercase tracking-widest">Financial Overview</span>
          <h2 className="font-display-lg text-3xl font-extrabold tracking-tight text-white leading-tight">Track your wealth flow.</h2>
          <p className="text-on-surface-variant text-xs">Real-time ledger of lifestyle expenditures and corporate transactions.</p>
        </div>
        
        {/* Monthly Spending Card */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden border border-white/5">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant text-[10px] font-bold tracking-wider uppercase">MONTHLY SPENDING</span>
            <span className="material-symbols-outlined text-red-400 text-base">trending_down</span>
          </div>
          <div className="flex items-baseline gap-1 mt-auto">
            <span className="text-2xl font-extrabold text-white font-display-lg">{currency(totalMonthlySpending)}</span>
            <span className="text-[10px] text-on-surface-variant font-bold">INR</span>
          </div>
        </div>

        {/* Updated Salary Card */}
        <div className="glass-card p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden conic-border">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant text-[10px] font-bold tracking-wider uppercase">UPDATED SALARY</span>
            <span className="material-symbols-outlined text-primary text-base">payments</span>
          </div>
          <div className="flex flex-col mt-auto">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-primary font-display-lg">{currency(updatedSalary)}</span>
              <span className="text-[10px] text-primary font-bold">INR</span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-semibold mt-1">Base Salary: {currency(monthlySalary)}</span>
          </div>
        </div>
      </div>

      {/* Controls: Search, Filters & Add CTA */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 sm:flex-initial">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
            <input
              type="text"
              placeholder="Search entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#0e1511] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-outline/40 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 w-full sm:w-60"
            />
          </div>

          {/* Category Dropdown Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#0e1511] border border-white/10 rounded-xl py-2 pl-3 pr-8 text-xs text-white focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40 appearance-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">expand_more</span>
          </div>
        </div>

        <button
          onClick={onOpenAddModal}
          className="btn-emerald-gradient px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all text-xs"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          <span>Add New Entry</span>
        </button>
      </div>

      {/* Expense List Table Container */}
      <div className="glass-card rounded-[2rem] overflow-hidden border border-white/5" id="ledger-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                <th className="px-6 py-4 w-20 text-center">Icon</th>
                <th className="px-6 py-4">Item / Description</th>
                <th className="px-6 py-4 hidden md:table-cell">Date</th>
                <th className="px-6 py-4 hidden md:table-cell">Category</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5" id="expense-list">
              {filteredExpenses.map((item) => {
                const config = getCategoryConfig(item.category);
                const isDeleting = !!deletingIds[item.id];
                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-white/[0.02] transition-all group ${
                      isDeleting ? "opacity-30 pointer-events-none" : ""
                    }`}
                  >
                    {/* Category Icon */}
                    <td className="px-6 py-4">
                      <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center ${config.color} mx-auto`}>
                        <span className="material-symbols-outlined text-sm">{config.icon}</span>
                      </div>
                    </td>

                    {/* Description & Method (Mobile details) */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-xs text-white leading-tight">{item.description}</div>
                      <div className="flex items-center gap-1 mt-0.5 md:hidden">
                        <span className="material-symbols-outlined text-[10px] text-on-surface-variant">{config.methodIcon}</span>
                        <span className="text-[10px] text-on-surface-variant font-medium">{config.method}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-on-surface-variant hidden md:table-cell">{item.date}</td>

                    {/* Category & Method (Desktop details) */}
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-col justify-center gap-0.5">
                        <span className="text-xs text-white font-medium">{item.category}</span>
                        <div className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[10px] text-on-surface-variant">{config.methodIcon}</span>
                          <span className="text-[10px] text-on-surface-variant">{config.method}</span>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="px-6 py-4 text-right font-display-lg font-bold text-primary text-xs whitespace-nowrap">
                      {currency(item.amount)}
                    </td>

                    {/* Action Delete */}
                    <td className="px-6 py-4">
                      <div className="md:opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 hover:text-red-400 transition-all"
                          title="Remove Entry"
                          disabled={isDeleting}
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* Empty State Pattern inside table */}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-16 px-6 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center border border-white/5">
                        <span className="material-symbols-outlined text-primary text-3xl opacity-60">drafts</span>
                      </div>
                      <div className="max-w-xs space-y-1 mx-auto">
                        <h3 className="font-headline-md text-sm font-bold text-white">No entries found</h3>
                        <p className="text-on-surface-variant text-xs">
                          Your expense ledger is empty or matches no filters. Start tracking your investments and lifestyle spending.
                        </p>
                      </div>
                      <button
                        onClick={onOpenAddModal}
                        className="px-5 py-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold rounded-xl hover:bg-primary/20 transition-all"
                      >
                        Add My First Expense
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insight Card & Info Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 glass-card p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 border-l-4 border-primary">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
            </div>
          </div>
          <div className="space-y-1 text-center md:text-left flex-grow">
            <h4 className="font-headline-sm text-sm font-bold text-primary">FinSphere AI Ledger Insight</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Based on your last 30 days, you've optimized travel costs by <span className="text-white font-semibold">12%</span> using corporate wire transfers. We recommend reviewing your dining category, which is trending <span className="text-white font-semibold">15% higher</span> than your peer average.
            </p>
          </div>
          <button className="mt-4 md:mt-0 px-4 py-2 border border-primary/30 text-primary hover:bg-primary/5 rounded-xl transition-all text-xs font-bold flex-shrink-0">
            View Analysis Report
          </button>
        </div>

        <div className="glass-card p-6 rounded-[2rem] overflow-hidden relative group cursor-pointer border border-white/5 flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-primary text-lg">account_balance_wallet</span>
            <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Upcoming Due</span>
          </div>
          <div className="mt-4">
            <h5 className="font-bold text-xs text-white">Centurion Bill</h5>
            <p className="text-on-surface-variant text-[10px] mt-0.5">Due in 4 days</p>
          </div>
          <div className="text-lg font-bold text-primary mt-2">{currency(18240)}</div>
        </div>
      </div>
      
    </div>
  );
}
