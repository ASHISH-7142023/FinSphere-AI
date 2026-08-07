"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Expense } from "@/shared";

export default function CreditCardBillCenter({
  session: propSession,
  onAddExpense,
  expenses = []
}: {
  session?: any;
  onAddExpense?: (amount: number, category: string, description: string) => Promise<void>;
  expenses?: Expense[];
}) {
  const [session] = useState(() => {
    if (propSession) return propSession;
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("finsphere.session");
      if (raw) return JSON.parse(raw);
    }
    return null;
  });

  const income = session?.user?.monthlyIncome || 150000;
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

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

  // Derive balances dynamically based on payment transactions in database expenses
  const paidHdfc = expenses
    .filter(e => e.description.toLowerCase().includes("hdfc") && e.description.toLowerCase().includes("bill"))
    .reduce((sum, e) => sum + e.amount, 0);

  const paidAmex = expenses
    .filter(e => e.description.toLowerCase().includes("amex") && e.description.toLowerCase().includes("bill"))
    .reduce((sum, e) => sum + e.amount, 0);

  const paidEmerald = expenses
    .filter(e => e.description.toLowerCase().includes("emerald") && e.description.toLowerCase().includes("bill"))
    .reduce((sum, e) => sum + e.amount, 0);

  const hdfcBalance = Math.max(0, Math.round(income * 0.952) - paidHdfc);
  const amexBalance = Math.max(0, Math.round(income * 0.547) - paidAmex);
  const emeraldBalance = Math.max(0, Math.round(income * 0.324) - paidEmerald);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hdfcDue = new Date("2026-10-28");
  const hDiff = Math.ceil((hdfcDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const amexDue = new Date("2026-11-05");
  const aDiff = Math.ceil((amexDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const emeraldDue = new Date("2026-11-12");
  const eDiff = Math.ceil((emeraldDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const hText = hdfcBalance === 0 ? "Paid Full" : hDiff < 0 ? `Overdue by ${Math.abs(hDiff)} days` : hDiff === 0 ? "Due Today" : `Due in ${hDiff} days`;
  const aText = amexBalance === 0 ? "Paid Full" : aDiff < 0 ? `Overdue by ${Math.abs(aDiff)} days` : aDiff === 0 ? "Due Today" : `Due in ${aDiff} days`;
  const eText = emeraldBalance === 0 ? "Paid Full" : eDiff < 0 ? `Overdue by ${Math.abs(eDiff)} days` : eDiff === 0 ? "Due Today" : `Due in ${eDiff} days`;

  const cards = [
    {
      id: "hdfc",
      brand: "HDFC REGALIA GOLD",
      number: "4421  7281  9012  4890",
      holder: "ALEX STERLING",
      expiry: "10/29",
      tier: "GOLD MULTIPLIER",
      balance: hdfcBalance,
      dueDate: "Oct 28, 2026",
      daysText: getDaysRemainingText("2026-10-28"),
      diffDays: hDiff,
      colorClass: "from-[#080d0a] via-[#15271e] to-[#244233]",
      accentColor: "#ffd700",
      textColor: "text-[#ffd700]",
      glowColor: "rgba(0, 200, 150, 0.2)"
    },
    {
      id: "amex",
      brand: "AMEX PLATINUM",
      number: "3759  8765  4321  9005",
      holder: "ALEX STERLING",
      expiry: "11/30",
      tier: "PLATINUM ELITE",
      balance: amexBalance,
      dueDate: "Nov 05, 2026",
      daysText: getDaysRemainingText("2026-11-05"),
      diffDays: aDiff,
      colorClass: "from-[#11161d] via-[#242d38] to-[#3a4756]",
      accentColor: "#e5e7eb",
      textColor: "text-white",
      glowColor: "rgba(229, 231, 235, 0.15)"
    },
    {
      id: "emerald",
      brand: "FINSPHERE EMERALD",
      number: "4820  1028  9302  1182",
      holder: "ALEX STERLING",
      expiry: "12/32",
      tier: "NEURAL MEMBERSHIP",
      balance: emeraldBalance,
      dueDate: "Nov 12, 2026",
      daysText: getDaysRemainingText("2026-11-12"),
      diffDays: eDiff,
      colorClass: "from-[#031d10] via-[#053d20] to-[#0a6635]",
      accentColor: "#10b981",
      textColor: "text-[#00c896]",
      glowColor: "rgba(16, 185, 129, 0.3)"
    }
  ];

  const activeCard = (cards[activeCardIndex] || cards[0]) as typeof cards[number];

  const timeline = [
    { id: 1, title: "HDFC Regalia Gold Bill Due", desc: hText, amount: Math.round(income * 0.952), type: hdfcBalance === 0 ? "settled" : "upcoming" },
    { id: 2, title: "Amex Platinum Bill Generation", desc: aText, amount: Math.round(income * 0.547), type: amexBalance === 0 ? "settled" : "upcoming" },
    { id: 3, title: "FinSphere Emerald Dues Target", desc: eText, amount: Math.round(income * 0.324), type: emeraldBalance === 0 ? "settled" : "upcoming" }
  ];

  const handlePayFull = (cardId: string, amount: number) => {
    setToastMsg(`Successfully paid ₹${amount.toLocaleString()} via FinSphere Pay!`);
    setTimeout(() => setToastMsg(""), 3500);

    if (onAddExpense) {
      onAddExpense(amount, "Bills", `Credit Card Bill Payment (${cardId.toUpperCase()})`);
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setActiveCardIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setActiveCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
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

      {/* Deck Container */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Linked Accounts Stack</h3>
          <div className="flex gap-2">
            <button
              onClick={prevCard}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
            </button>
            <button
              onClick={nextCard}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* 3D Stack Viewport */}
        <div className="relative w-full h-[280px] flex items-center justify-center overflow-hidden py-4 bg-white/[0.01] border border-white/5 rounded-3xl">
          <div className="relative w-full max-w-[420px] h-[215px] flex items-center justify-center" style={{ perspective: "1200px" }}>
            {cards.map((card, idx) => {
              const offset = idx - activeCardIndex;
              const isSelected = idx === activeCardIndex;

              // Stack animations using Framer Motion
              return (
                <motion.div
                  key={card.id}
                  onClick={() => {
                    if (!isSelected) {
                      setIsFlipped(false);
                      setActiveCardIndex(idx);
                    }
                  }}
                  style={{
                    position: "absolute",
                    width: "340px",
                    height: "215px",
                    transformStyle: "preserve-3d",
                    zIndex: isSelected ? 30 : 30 - Math.abs(offset),
                    transformOrigin: "center center",
                  }}
                  animate={{
                    x: offset * 90,
                    y: isSelected ? 0 : 10,
                    scale: isSelected ? 1 : 0.82,
                    rotateY: offset * -28,
                    rotateZ: offset * -2,
                    opacity: isSelected ? 1 : 0.45,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className={`relative select-none ${isSelected ? "shadow-2xl shadow-primary/10" : "cursor-pointer hover:opacity-75"}`}
                >
                  {/* Card Flip Container */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      transformStyle: "preserve-3d",
                      transform: isSelected && isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                      transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                    className="relative"
                  >
                    {/* Front Face */}
                    <div
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden"
                      }}
                      className={`absolute inset-0 bg-gradient-to-br ${card.colorClass} border border-white/10 rounded-2xl p-6 flex flex-col justify-between`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider mb-0.5">{card.brand}</p>
                          <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10 ${card.textColor}`}>
                            {card.tier}
                          </span>
                        </div>
                        <span className="material-symbols-outlined text-white/40 text-lg">contactless</span>
                      </div>

                      {/* Gold Card Chip and NFC graphics */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded bg-gradient-to-br from-amber-300 to-amber-600 border border-black/10 relative overflow-hidden">
                          {/* Inner lines */}
                          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/25"></div>
                          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-black/25"></div>
                        </div>
                        <div className="flex flex-col gap-0.5 opacity-25">
                          <div className="w-3 h-0.5 bg-white rounded-full"></div>
                          <div className="w-4 h-0.5 bg-white rounded-full"></div>
                          <div className="w-5 h-0.5 bg-white rounded-full"></div>
                        </div>
                      </div>

                      <div>
                        <p className="text-white/80 font-mono text-base tracking-wider mb-2">{card.number}</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[7px] text-white/40 uppercase tracking-widest font-bold">Holder</p>
                            <p className="text-[10px] text-white font-bold tracking-wide uppercase">{card.holder}</p>
                          </div>
                          <div>
                            <p className="text-[7px] text-white/40 uppercase tracking-widest font-bold">Expires</p>
                            <p className="text-[10px] text-white font-bold font-mono">{card.expiry}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Back Face */}
                    <div
                      style={{
                        transform: "rotateY(180deg)",
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden"
                      }}
                      className="absolute inset-0 bg-[#0d0e10] border border-white/10 rounded-2xl flex flex-col justify-between py-6"
                    >
                      {/* Magnetic Strip */}
                      <div className="w-full h-9 bg-black/90"></div>

                      <div className="px-6 flex items-center justify-between mt-2">
                        {/* Signature Box */}
                        <div className="w-[180px] h-8 bg-white/95 rounded flex items-center px-3 border border-white/20 select-none">
                          <span className="font-serif italic text-xs text-slate-800 tracking-wider">Alex Sterling</span>
                        </div>
                        {/* CVV */}
                        <div className="flex flex-col items-center">
                          <p className="text-[6px] text-white/30 uppercase tracking-widest font-bold mb-0.5">CVV</p>
                          <div className="w-10 h-7 bg-white text-black font-extrabold text-xs flex items-center justify-center rounded">
                            {card.id === "hdfc" ? "421" : card.id === "amex" ? "308" : "912"}
                          </div>
                        </div>
                      </div>

                      <div className="px-6">
                        <p className="text-[6px] text-white/20 leading-tight">
                          Authorized signature required. This card is issued by FinSphere AI under license terms.
                          If found, drop in any post box or call +1 (555) 012-3456.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Primary Card Tools Panel */}
      <section className="glass-card rounded-3xl p-6 border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h4 className="text-xl font-extrabold text-white">{activeCard.brand} Overview</h4>
            <p className="text-xs text-on-surface-variant mt-0.5">Linked card configuration details & options.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFlipped((prev) => !prev)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl transition-all border border-white/10 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">autorenew</span>
              Flip Card
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Outstanding Dues</span>
            <h3 className="text-3xl font-extrabold text-white">₹{activeCard.balance.toLocaleString()}</h3>
            <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${activeCard.balance > 0 ? "text-primary" : "text-emerald-500"}`}>
              {activeCard.balance > 0 ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  Active Dues Pending
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xs">check_circle</span>
                  Fully Settled
                </>
              )}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Payment Target</span>
            <p className="text-base font-bold text-white mt-1">
              {activeCard.balance > 0 ? activeCard.dueDate : "No Payment Pending"}
            </p>
            <p className="text-xs text-on-surface-variant font-semibold">
              {activeCard.balance > 0 ? `${activeCard.daysText} Remaining` : "Dues settled for this statement cycle"}
            </p>
          </div>

          <div className="flex items-center md:justify-end gap-3">
            {activeCard.balance > 0 ? (
              <>
                <button
                  onClick={() => handlePayFull(activeCard.id, activeCard.balance)}
                  className="px-5 py-2.5 bg-primary text-on-primary text-xs font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/10"
                >
                  Pay Full (₹{activeCard.balance.toLocaleString()})
                </button>
                <button
                  onClick={() => handlePayFull(activeCard.id, Math.round(activeCard.balance * 0.05))}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-on-surface text-xs font-bold rounded-xl transition-all"
                >
                  Pay Min (5%)
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Statement Fully Paid
              </div>
            )}
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
                <p className="text-on-surface-variant text-[11px]">Dynamic routing strategies</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2 p-3 bg-white/5 rounded-xl border border-white/5 items-start">
                <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">auto_awesome</span>
                <div className="text-[11px] text-on-surface-variant leading-relaxed">
                  {activeCard.id === "hdfc" && (
                    <p>
                      You are viewing <strong className="text-white">HDFC Regalia Gold</strong>. It earns <strong className="text-primary">2x points</strong> globally. We recommend booking flights and travel with this card to activate key travel multipliers.
                    </p>
                  )}
                  {activeCard.id === "amex" && (
                    <p>
                      You are viewing <strong className="text-white">AMEX Platinum</strong>. Grocery and supermarkets earn a massive <strong className="text-primary">5x multiplier</strong> here. Swapping from HDFC to AMEX for grocery bills is highly optimized.
                    </p>
                  )}
                  {activeCard.id === "emerald" && (
                    <p>
                      You are viewing <strong className="text-white">FinSphere Emerald Elite</strong>. It routes local utility payments with a flat <strong className="text-primary">5% cash back</strong>. Route your water/gas bills here.
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => alert("FinSphere AI Optimization Strategy:\n- Grocery transactions: swap HDFC Regalia for AMEX (earns 5x points, equivalent to 5% return).\n- Flights & luxury travel: continue using HDFC Regalia (earns 4x multiplier + Lounge vouchers).\n- Local utility bills: route via FinSphere Emerald card to secure direct 5% cash back statement credits.")}
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
