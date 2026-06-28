"use client";

import React, { useState, useEffect } from "react";

interface PricingViewProps {
  currentTier?: "free" | "pro" | "elite";
  onTierChange?: (tier: "free" | "pro" | "elite") => void;
}

export default function PricingView({ currentTier: propTier, onTierChange }: PricingViewProps = {}) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [localTier, setLocalTier] = useState<"free" | "pro" | "elite">("pro");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("finsphere.selectedPlan") as "free" | "pro" | "elite";
      if (saved) setLocalTier(saved);
    }
  }, []);

  const activeTier = propTier ?? localTier;

  const handleUpgrade = (tier: "free" | "pro" | "elite") => {
    if (onTierChange) {
      onTierChange(tier);
    } else {
      setLocalTier(tier);
      localStorage.setItem("finsphere.selectedPlan", tier);
    }
    setSuccessMsg(`Successfully simulated upgrade to the ${tier.toUpperCase()} tier!`);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto py-6">
        <span className="font-label-sm text-primary text-xs uppercase tracking-widest font-semibold">Subscription Plans</span>
        <h2 className="font-display-lg text-4xl md:text-5xl font-extrabold tracking-tight text-white mt-1">Precision Wealth Tiers</h2>
        <p className="text-on-surface-variant text-base">
          Choose a plan that matches your financial ambition. From basic tracking to dedicated artificial intelligence and private advisory.
        </p>

        {/* Monthly vs Yearly Toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span className={`text-xs font-semibold ${billingPeriod === "monthly" ? "text-primary" : "text-on-surface-variant"}`}>Monthly</span>
          <button
            onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
            className="w-12 h-6 bg-surface-container rounded-full relative p-0.5 border border-white/10 transition-colors"
          >
            <div
              className={`w-4.5 h-4.5 bg-primary rounded-full transition-transform duration-300 ${
                billingPeriod === "yearly" ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </button>
          <span className={`text-xs font-semibold flex items-center gap-1 ${billingPeriod === "yearly" ? "text-primary" : "text-on-surface-variant"}`}>
            Yearly <span className="bg-primary/10 text-primary border border-primary/20 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase">Save 20%</span>
          </span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="glass-card border border-primary/30 p-4 rounded-2xl flex items-center gap-3 text-primary text-sm font-bold tracking-wide animate-pulse">
          <span className="material-symbols-outlined">verified</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch pt-4">
        {/* Core Plan */}
        <div className="glass-card rounded-3xl p-8 flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Core</h3>
              <p className="text-on-surface-variant text-xs mt-1">Entry-level insights and tracking</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">Free</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Basic expense tracking
              </li>
              <li className="flex items-center gap-3 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Manual budgeting (1 category)
              </li>
              <li className="flex items-center gap-3 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Standard email security
              </li>
              <li className="flex items-center gap-3 text-xs text-on-surface-variant/40">
                <span className="material-symbols-outlined text-sm">cancel</span>
                AI Advisory Integration
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleUpgrade("free")}
            className={`w-full py-3 rounded-xl border font-bold text-xs transition-all ${
              activeTier === "free"
                ? "bg-white/5 border-primary text-primary cursor-default"
                : "border-outline hover:bg-white/5 text-white"
            }`}
          >
            {activeTier === "free" ? "Active Plan" : "Get Started"}
          </button>
        </div>

        {/* Elite Plan (Featured / Active-Glow) */}
        <div className="glass-card rounded-3xl p-8 flex flex-col justify-between border border-primary/45 relative shadow-xl shadow-primary/5 bg-surface-container-high/40 transform lg:-translate-y-2">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
            Best Value
          </div>
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-primary">Elite</h3>
              <p className="text-on-surface-variant text-xs mt-1">High-net-worth tier & advisory</p>
            </div>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">
                ₹{billingPeriod === "monthly" ? "1,499" : "1,199"}
              </span>
              <span className="text-on-surface-variant text-xs">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-xs text-white">
                <span className="material-symbols-outlined text-primary text-sm font-bold">check_circle</span>
                <strong>1-on-1 Dedicated Advisor</strong>
              </li>
              <li className="flex items-center gap-3 text-xs text-white">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Unlimited automated AI portfolios
              </li>
              <li className="flex items-center gap-3 text-xs text-white">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                5% Unlimited Credit Cashback
              </li>
              <li className="flex items-center gap-3 text-xs text-white">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Global Airport Lounge access
              </li>
              <li className="flex items-center gap-3 text-xs text-white">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Advanced Tax-Loss Harvesting AI
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleUpgrade("elite")}
            className={`w-full py-3 rounded-xl font-bold text-xs transition-all shadow-md ${
              activeTier === "elite"
                ? "bg-white/5 border border-primary text-primary cursor-default"
                : "bg-primary text-on-primary hover:brightness-110 shadow-primary/20"
            }`}
          >
            {activeTier === "elite" ? "Active Plan" : "Upgrade to Elite"}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="glass-card rounded-3xl p-8 flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Pro</h3>
              <p className="text-on-surface-variant text-xs mt-1">Power users, modelers & traders</p>
            </div>
            <div className="mb-8 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">
                ₹{billingPeriod === "monthly" ? "499" : "399"}
              </span>
              <span className="text-on-surface-variant text-xs">/mo</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-xs text-white">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                <strong>Advanced Analytics Core</strong>
              </li>
              <li className="flex items-center gap-3 text-xs text-white">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Automated budget monitoring
              </li>
              <li className="flex items-center gap-3 text-xs text-white">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Multi-bank secure account sync
              </li>
              <li className="flex items-center gap-3 text-xs text-on-surface-variant/40">
                <span className="material-symbols-outlined text-sm">cancel</span>
                Dedicated Wealth Manager
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleUpgrade("pro")}
            className={`w-full py-3 rounded-xl border font-bold text-xs transition-all ${
              activeTier === "pro"
                ? "bg-white/5 border-primary text-primary cursor-default"
                : "border-outline hover:bg-white/5 text-white"
            }`}
          >
            {activeTier === "pro" ? "Active Plan" : "Upgrade to Pro"}
          </button>
        </div>
      </div>

      {/* Detailed Comparison Table */}
      <div className="space-y-6 pt-12">
        <h2 className="text-2xl font-bold text-center text-white">Detailed Plan Comparison</h2>
        <div className="glass-card rounded-3xl p-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-xs font-semibold text-on-surface-variant">
                  <th className="py-4 px-4">Feature Details</th>
                  <th className="py-4 px-4 text-center">Core</th>
                  <th className="py-4 px-4 text-center">Pro</th>
                  <th className="py-4 px-4 text-center text-primary">Elite</th>
                </tr>
              </thead>
              <tbody className="text-sm text-on-surface divide-y divide-white/5">
                <tr>
                  <td className="py-4 px-4 font-semibold">AI Insights & Advice</td>
                  <td className="py-4 px-4 text-center text-on-surface-variant/40">—</td>
                  <td className="py-4 px-4 text-center text-primary font-bold">✓</td>
                  <td className="py-4 px-4 text-center text-primary font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Real-time Portfolios</td>
                  <td className="py-4 px-4 text-center text-on-surface-variant/40">—</td>
                  <td className="py-4 px-4 text-center text-on-surface-variant">Up to 3</td>
                  <td className="py-4 px-4 text-center text-primary font-bold">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Interactive Simulator</td>
                  <td className="py-4 px-4 text-center text-on-surface-variant/40">—</td>
                  <td className="py-4 px-4 text-center text-primary font-bold">✓</td>
                  <td className="py-4 px-4 text-center text-primary font-bold">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-semibold">Dedicated Human Support</td>
                  <td className="py-4 px-4 text-center text-on-surface-variant/40">—</td>
                  <td className="py-4 px-4 text-center text-on-surface-variant/40">—</td>
                  <td className="py-4 px-4 text-center text-primary font-bold">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-12">
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed">
            Have specific business requirements or customized capital deployments? Our private banking team is available for custom setups.
          </p>
          <div onClick={() => alert("Personal Support: Feel free to schedule a direct consult call with our HNW specialist at support@finsphere.ai.")} className="glass-card p-6 rounded-2xl flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">support_agent</span>
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Need personal assistance?</h4>
              <p className="text-xs text-on-surface-variant">Speak to a specialist today.</p>
            </div>
          </div>
        </div>
        <div className="lg:col-span-7 space-y-3">
          <FAQItem question="Can I upgrade or downgrade my plan at any time?">
            Yes, upgrades take effect immediately. Downgrades or cancellations apply at the end of the current active billing cycle.
          </FAQItem>
          <FAQItem question="How does the 5% unlimited cash back operate?">
            Eligible transactions charged to your obsidian card generate direct statement credits on verified transaction categories.
          </FAQItem>
          <FAQItem question="Is my banking sync protocol safe?">
            Absolutely. We utilize bank-grade encryption tunnels with complete read-only credential hashing. We never write, modify or execute transactions.
          </FAQItem>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, children }: { question: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className="glass-card p-5 rounded-2xl cursor-pointer hover:border-primary/30 transition-all select-none"
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold text-sm text-white hover:text-primary transition-colors">{question}</span>
        <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </div>
      <div
        className="transition-all duration-300 overflow-hidden text-xs text-on-surface-variant leading-relaxed mt-2"
        style={{ maxHeight: isOpen ? "150px" : "0px", opacity: isOpen ? 1 : 0 }}
      >
        <p className="pt-2 border-t border-white/5">{children}</p>
      </div>
    </div>
  );
}
