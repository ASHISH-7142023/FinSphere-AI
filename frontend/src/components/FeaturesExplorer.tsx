"use client";

import React, { useState } from "react";

export default function FeaturesExplorer() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <header className="py-16 text-center px-4 relative overflow-hidden glass-card rounded-[32px] border border-white/5 bg-surface/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/10 blur-[120px] rounded-full -z-10"></div>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-primary/20 text-[10px] font-bold tracking-widest text-primary uppercase mb-6">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          Precision Engineering
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight text-white">
          Engineered for Infinite <span className="text-primary">Growth.</span>
        </h1>
        <p className="text-on-surface-variant max-w-2xl mx-auto text-base mb-8 leading-relaxed">
          Sophisticated tools integrated into a singular glass interface, designed for speed and clarity. Explore the neural engine powering your financial future.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="bg-primary text-on-primary px-6 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 text-xs">
            <span>Get Started</span>
            <span className="material-symbols-outlined text-sm">trending_flat</span>
          </button>
          <button className="glass-card px-6 py-3.5 rounded-xl font-bold hover:bg-white/5 transition-all flex items-center gap-2 text-xs text-white">
            <span>View Live Performance</span>
            <span className="material-symbols-outlined text-primary text-sm">insights</span>
          </button>
        </div>
      </header>

      {/* Capabilities Grid */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Next-Gen Capability Hub</h2>
            <p className="text-on-surface-variant text-sm mt-1">Our neural network adapts to your spending habits and market conditions in real-time.</p>
          </div>
          <div className="flex p-1 bg-surface-container rounded-xl self-end">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "grid" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                viewMode === "list" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              List View
            </button>
          </div>
        </div>

        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {/* Feature 1: AI Wealth Advisor */}
          <div className="glass-card p-6 rounded-3xl hover:border-primary/30 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Wealth Advisor</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed mb-6">
                24/7 neural advisory system that monitors global market shifts and rebalances your portfolio in milliseconds.
              </p>
            </div>
            <ul className="space-y-2 mt-auto">
              <li className="flex items-center gap-2 text-xs text-on-surface font-medium">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Predictive Risk Modeling
              </li>
              <li className="flex items-center gap-2 text-xs text-on-surface font-medium">
                <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                Tax-Loss Harvesting AI
              </li>
            </ul>
          </div>

          {/* Feature 2: Global Investment Hub */}
          <div className="glass-card p-6 rounded-3xl hover:border-primary/30 transition-all group overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">public</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Global Investment Hub</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed mb-6">
                Direct access to 50+ global exchanges. Trade stocks, mutual funds, and digital assets from a single obsidian terminal.
              </p>
            </div>
            <div className="h-20 bg-gradient-to-tr from-primary/5 to-primary/20 rounded-2xl relative overflow-hidden mt-auto">
              <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "repeating-linear-gradient(45deg, #00c896 0, #00c896 1px, transparent 0, transparent 50%)", backgroundSize: "8px 8px" }}></div>
            </div>
          </div>

          {/* Feature 3: Automated Budgeting */}
          <div className="glass-card p-6 rounded-3xl hover:border-primary/30 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Automated Budgeting</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed mb-6">
                Self-learning algorithms categorize your spending and optimize savings goals without manual input.
              </p>
            </div>
            <div className="space-y-2 mt-auto pt-4">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                <span>Savings Goal Progress</span>
                <span className="text-primary">75%</span>
              </div>
              <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary w-3/4 rounded-full shadow-lg shadow-primary/20"></div>
              </div>
            </div>
          </div>

          {/* Feature 4: Credit Score Simulator */}
          <div className="glass-card p-6 rounded-3xl hover:border-primary/30 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">query_stats</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Credit Score Simulator</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed mb-6">
                Model financial decisions before they happen. See exactly how a new investment or loan will impact your score.
              </p>
            </div>
            <div className="flex justify-center mt-auto">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" fill="none" r="34" stroke="rgba(255,255,255,0.05)" strokeWidth="6"></circle>
                  <circle cx="40" cy="40" fill="none" r="34" stroke="#00c896" strokeDasharray="213" strokeDashoffset="50" strokeLinecap="round" strokeWidth="6"></circle>
                </svg>
                <span className="absolute text-base font-extrabold text-on-surface">824</span>
              </div>
            </div>
          </div>

          {/* Feature 5: Multi-Bank Integration */}
          <div className="glass-card p-6 rounded-3xl hover:border-primary/30 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multi-Bank Integration</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed mb-6">
                Seamlessly aggregate all institutional accounts via high-security encrypted bridges. Unified visibility for complex wealth.
              </p>
            </div>
            <div className="flex -space-x-2 mt-auto pt-4">
              <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-[9px] font-bold text-white">BK1</div>
              <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-[9px] font-bold text-white">BK2</div>
              <div className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center text-[9px] font-bold text-white">BK3</div>
              <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-surface flex items-center justify-center text-[10px] font-bold text-primary">+</div>
            </div>
          </div>

          {/* Feature 6: Elite Rewards & Perks */}
          <div className="glass-card p-6 rounded-3xl hover:border-primary/30 transition-all group flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Elite Rewards & Perks</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed mb-6">
                Exclusive concierge services, airport lounge access, and high-yield reward points tailored to premium lifestyles.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-600/10 border border-yellow-600/20 text-[9px] font-bold text-yellow-500 italic mt-auto tracking-wider uppercase">
              Gold Tier Status Unlocked
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="glass-card p-12 rounded-[32px] text-center relative overflow-hidden border border-white/5">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-[100px] rounded-full"></div>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Ready to Transcend Traditional Finance?</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all text-xs w-full sm:w-auto">
            Open Premium Account
          </button>
          <button className="px-8 py-3.5 border border-white/10 rounded-xl font-bold hover:bg-white/5 transition-all text-xs text-white w-full sm:w-auto">
            Talk to a Partner
          </button>
        </div>
      </section>
    </div>
  );
}
