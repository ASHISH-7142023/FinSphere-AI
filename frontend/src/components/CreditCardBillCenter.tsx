"use client";

import React, { useState } from "react";

export default function CreditCardBillCenter({ session: propSession, onAddExpense }: { session?: any; onAddExpense?: (amount: number, category: string, description: string) => Promise<void> }) {
  const [session] = useState(() => {
    if (propSession) return propSession;
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("finsphere.session");
      if (raw) return JSON.parse(raw);
    }
    return null;
  });

  const income = session?.user?.monthlyIncome || 150000;

  const getDaysRemainingText = (dueDateStr: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateStr);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} Day${Math.abs(diffDays) > 1 ? "s" : ""}`;
    } else if (diffDays === 0) {
      return "Due Today";
    } else if (diffDays === 1) {
      return "1 Day";
    } else {
      return `${diffDays} Days`;
    }
  };

  const hdfcDaysText = getDaysRemainingText("2026-10-28");
  const amexDaysText = getDaysRemainingText("2026-11-05");

  const [hdfcBalance, setHdfcBalance] = useState(Math.round(income * 0.952)); // e.g. 142850 for 150000 salary
  const [amexBalance, setAmexBalance] = useState(Math.round(income * 0.547)); // e.g. 82100 for 150000 salary
  const [timeline, setTimeline] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const hdfcDue = new Date("2026-10-28");
    hdfcDue.setHours(0, 0, 0, 0);
    const hDiff = Math.ceil((hdfcDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    const amexDue = new Date("2026-11-05");
    amexDue.setHours(0, 0, 0, 0);
    const aDiff = Math.ceil((amexDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const hText = hDiff < 0 ? `Overdue by ${Math.abs(hDiff)} days` : hDiff === 0 ? "Due Today" : `Due in ${hDiff} days`;
    const aText = aDiff < 0 ? `Overdue by ${Math.abs(aDiff)} days` : aDiff === 0 ? "Due Today" : `Due in ${aDiff} days`;

    return [
      { id: 1, title: "HDFC Regalia Gold Bill Due", desc: hText, amount: Math.round(income * 0.952), type: "upcoming", color: "border-emerald-500" },
      { id: 2, title: "Amex Platinum Bill Generation", desc: aText, amount: Math.round(income * 0.547), type: "scheduled", color: "border-white/5" },
      { id: 3, title: "SBI Cashback Settled", desc: "Paid Full", amount: Math.round(income * 0.082), type: "settled", color: "border-white/5" },
    ];
  });
  const [toastMsg, setToastMsg] = useState("");

  const handlePayFull = (card: "hdfc" | "amex", amount: number) => {
    if (card === "hdfc") {
      setHdfcBalance(0);
      setTimeline(timeline.map(t => t.id === 1 ? { ...t, desc: "Paid Full", type: "settled" } : t));
    } else {
      setAmexBalance(0);
      setTimeline(timeline.map(t => t.id === 2 ? { ...t, desc: "Paid Full", type: "settled" } : t));
    }
    setToastMsg(`Successfully paid ₹${amount.toLocaleString()} via FinSphere Pay!`);
    setTimeout(() => setToastMsg(""), 3500);

    if (onAddExpense) {
      onAddExpense(amount, "Bills", `Credit Card Bill Payment (${card === "hdfc" ? "HDFC" : "Amex"})`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <span className="font-label-sm text-primary text-xs uppercase tracking-widest font-semibold">Credit Ledger</span>
          <h2 className="font-display-lg text-4xl font-extrabold tracking-tight text-white mt-1">Credit Card Bill Center</h2>
          <p className="text-on-surface-variant text-base mt-1">Manage linked credit card balances, view optimization alerts, and pay bills instantly.</p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="glass-card border border-primary/30 p-4 rounded-2xl flex items-center gap-3 text-primary text-sm font-bold animate-pulse">
          <span className="material-symbols-outlined">payments</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Linked Cards Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-white">Linked Accounts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* HDFC Card */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden group border-white/5 hover:border-primary/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">HDFC REGALIA GOLD</p>
                <p className="text-on-surface-variant/60 font-mono text-xs">**** 4421</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40">contactless</span>
            </div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Outstanding Balance</p>
            <h3 className="text-3xl font-extrabold text-white mb-6">₹{hdfcBalance.toLocaleString()}</h3>
            
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase font-bold">Due Date</p>
                <p className="text-white font-bold text-xs mt-0.5">{hdfcBalance > 0 ? `Oct 28, 2026 (${hdfcDaysText})` : "No Dues Pending"}</p>
              </div>
              <div className="flex gap-2">
                {hdfcBalance > 0 ? (
                  <>
                    <button
                      onClick={() => handlePayFull("hdfc", hdfcBalance)}
                      className="px-4 py-2 bg-primary text-on-primary text-xs font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/10"
                    >
                      Pay Full
                    </button>
                    <button
                      onClick={() => handlePayFull("hdfc", hdfcBalance * 0.05)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-on-surface text-xs font-bold rounded-lg transition-all"
                    >
                      Pay Minimum
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-primary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span> Settled
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* AMEX Card */}
          <div className="glass-card rounded-3xl p-6 relative overflow-hidden group border-white/5 hover:border-primary/20 transition-all duration-300">
            <div className="flex justify-between items-start mb-10">
              <div>
                <p className="text-xs text-on-surface-variant/80 font-bold uppercase tracking-wider mb-1">AMEX PLATINUM</p>
                <p className="text-on-surface-variant/60 font-mono text-xs">**** 9005</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40">contactless</span>
            </div>
            <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Outstanding Balance</p>
            <h3 className="text-3xl font-extrabold text-white mb-6">₹{amexBalance.toLocaleString()}</h3>
            
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <div>
                <p className="text-on-surface-variant text-[10px] uppercase font-bold">Due Date</p>
                <p className="text-white font-bold text-xs mt-0.5">{amexBalance > 0 ? `Nov 05, 2026 (${amexDaysText})` : "No Dues Pending"}</p>
              </div>
              <div className="flex gap-2">
                {amexBalance > 0 ? (
                  <button
                    onClick={() => handlePayFull("amex", amexBalance)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Pay Full
                  </button>
                ) : (
                  <span className="text-xs text-primary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span> Settled
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of timeline and recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        {/* Timeline Column */}
        <section className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-white">Payment Timeline</h3>
            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 text-primary"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Upcoming</span>
              <span className="flex items-center gap-1.5 text-on-surface-variant"><span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/35"></span> Settled</span>
            </div>
          </div>
          <div className="space-y-3">
            {timeline.map((item) => {
              const isSettled = item.type === "settled";
              return (
                <div
                  key={item.id}
                  className={`glass-card rounded-2xl p-5 flex items-center justify-between border-l-4 transition-all ${
                    isSettled ? "border-white/5 opacity-55" : "border-primary shadow-lg shadow-primary/5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSettled ? "bg-white/5 text-on-surface-variant/60" : "bg-primary/10 text-primary"
                    }`}>
                      <span className="material-symbols-outlined text-sm">
                        {isSettled ? "check_circle" : "priority_high"}
                      </span>
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${isSettled ? "text-on-surface-variant/80" : "text-white"}`}>{item.title}</p>
                      <p className="text-xs text-on-surface-variant">{item.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${isSettled ? "text-on-surface-variant/80" : "text-white"}`}>₹{item.amount.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI Recommendations Column */}
        <section className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-white">AI Reward Advisor</h3>
          <div className="glass-card rounded-3xl p-5 space-y-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
              </div>
              <div>
                <p className="font-bold text-sm text-white">Optimization Alert</p>
                <p className="text-on-surface-variant text-[11px]">Groceries spending optimization</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2 p-3 bg-white/5 rounded-xl border border-white/5 items-start">
                <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">auto_awesome</span>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  Your current spending on HDFC Regalia earns 2x reward points. Swapping to AMEX for groceries could net up to <strong className="text-primary font-bold">5x points</strong>.
                </p>
              </div>
              <button
                onClick={() => alert("FinSphere AI Optimization Strategy:\n- Grocery transactions: swap HDFC Regalia for AMEX (earns 5x points, equivalent to 5% return).\n- Flights & luxury travel: continue using HDFC Regalia (earns 4x multiplier + Lounge vouchers).\n- Local utility bills: route via SBI Cashback card to secure direct 5% cash back statement credits.")}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white text-xs font-bold transition-all"
              >
                View Optimization Strategy
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
