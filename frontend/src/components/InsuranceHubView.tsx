"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Policy {
  id: string;
  title: string;
  provider: string;
  premium: number;
  policyNo: string;
  renewalDate: string;
  deductible: number;
  type: "Health" | "Life" | "Motor";
  status: "Active" | "Pending" | "Lapsed";
  bgUrl: string;
}

export default function InsuranceHubView() {
  const [session] = useState(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("finsphere.session");
      if (raw) return JSON.parse(raw);
    }
    return null;
  });

  const income = session?.user?.monthlyIncome || 150000;

  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: "1",
      title: "Global Elite Health Plan",
      provider: "BlueShield Prestige",
      premium: Math.round(income * 0.00826), // e.g. 1240 for 150000 salary
      policyNo: "FS-HL-88291",
      renewalDate: "2026-10-14",
      deductible: Math.round(income * 0.0033), // e.g. 500 for 150000 salary
      type: "Health",
      status: "Active",
      bgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDO2FaJfvGpOekFmomir5p4x0E5ckM30273TKxvOZ0dR-h_ckiZ3iLPjMa0gHu-efQJrkqp--G3KxSyD38ZNVJDF2StNkq38yGDnOgU2Ib0Qqr5Otqk6jWaTaZYF8ChVVgQoB73vsVhB2ija4ejZoV3MWoXrX-JoToEdf-G4rd0BsQIjL-SQWAYPHxIF2VqXvASjs8qEF_so1ccYyeNp-K0muIqsoDeOliTWBhlllpQ9ogbxhY7cge8Ul7JZcxOsjIoJyyLFEnYBbYP",
    },
    {
      id: "2",
      title: "Prestige Term Life Shield",
      provider: "MetLife Prime",
      premium: Math.round(income * 0.00413), // e.g. 620 for 150000 salary
      policyNo: "FS-LF-77289",
      renewalDate: "2026-11-20",
      deductible: 0,
      type: "Life",
      status: "Active",
      bgUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMGKPRlA81g8p6kohS8NN6F1_cJV5X0AxOZNlPmLIes8e95BnDQ96VkMNBoEokIkatMf2uH8O9YqZ6Lz5lnS7oRQYqXwUcFGDiKz7kAMUekvekRRpzNvdO8PLygj2RtmvL87iweib7dyAKZGNtRXpp7o7OLqXzb-772hLiqge-dkG6g6xXoqi7VDgkMR89E3kfnLi5EyhTr_4iVzf_2IeSh5mbRA88u4_5GIP_jHCcvJsV_p5lm0CJT7AYmmjxAvNKn26ZVoaw3v5N",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"all" | "Health" | "Life" | "Motor">("all");
  const [calculatorState, setCalculatorState] = useState({
    type: "Health" as "Health" | "Life" | "Motor",
    coverAmount: Math.round(income * 33.33), // e.g. 5000000 (50L) for 150000 salary
    age: 28,
    smoker: false,
  });

  const [showClaimModal, setShowClaimModal] = useState<Policy | null>(null);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [calculatedPremium, setCalculatedPremium] = useState<number | null>(null);

  const filteredPolicies = activeTab === "all" ? policies : policies.filter((p) => p.type === activeTab);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClaimSuccess(true);
    setTimeout(() => {
      setClaimSuccess(false);
      setShowClaimModal(null);
    }, 2000);
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    let base = 0;
    if (calculatorState.type === "Health") {
      base = (calculatorState.coverAmount * 0.002) + (calculatorState.age * 150);
    } else if (calculatorState.type === "Life") {
      base = (calculatorState.coverAmount * 0.0005) + (calculatorState.age * 80);
    } else {
      base = (calculatorState.coverAmount * 0.01) + 2000;
    }
    if (calculatorState.smoker) base *= 1.35;
    setCalculatedPremium(Math.round(base / 12));
  };

  const handleRenew = (id: string) => {
    setPolicies((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextYear = new Date(p.renewalDate);
          nextYear.setFullYear(nextYear.getFullYear() + 1);
          return { ...p, renewalDate: nextYear.toISOString().split("T")[0] || "" };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div>
        <h2 className="font-display-lg text-4xl font-extrabold tracking-tight">Coverage &amp; Insurance Hub</h2>
        <p className="text-on-surface-variant text-base">Your unified coverage asset portfolio, monitored for smart premium optimization.</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Side: Advisor & Calculator */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* AI Advisor widget */}
          <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full"></div>
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              <h4 className="font-bold text-sm text-primary uppercase tracking-wider">AI Coverage Check</h4>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 ai-pulse text-xs leading-relaxed text-on-surface-variant">
                Your Health premium index is <span className="text-primary font-bold">12% higher</span> than similar active profiles. Aegis Blue Shield has a matching coverage plan saving ₹8,400/year.
              </div>
              <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl text-xs border border-white/5">
                <span>Coverage Health Rating</span>
                <span className="text-primary font-bold">94 / 100</span>
              </div>
            </div>
          </div>

          {/* Premium Estimator */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-white/10">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">calculate</span>
              Premium Calculator
            </h4>
            
            <form onSubmit={handleCalculate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-on-surface-variant font-semibold">Coverage Type</label>
                <select
                  value={calculatorState.type}
                  onChange={(e) => setCalculatorState((prev) => ({ ...prev, type: e.target.value as any }))}
                  className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                >
                  <option value="Health">Health Insurance</option>
                  <option value="Life">Term Life Shield</option>
                  <option value="Motor">Motor Insurance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-on-surface-variant font-semibold">Sum Assured (₹)</label>
                <select
                  value={calculatorState.coverAmount}
                  onChange={(e) => setCalculatorState((prev) => ({ ...prev, coverAmount: Number(e.target.value) }))}
                  className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                >
                  <option value={1000000}>₹10,000,000 (10 Lakh)</option>
                  <option value={5000000}>₹5,000,000 (50 Lakh)</option>
                  <option value={10000000}>₹10,000,000 (1 Crore)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-on-surface-variant font-semibold">Age (Years)</label>
                  <input
                    type="number"
                    value={calculatorState.age}
                    onChange={(e) => setCalculatorState((prev) => ({ ...prev, age: Number(e.target.value) }))}
                    className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    checked={calculatorState.smoker}
                    onChange={(e) => setCalculatorState((prev) => ({ ...prev, smoker: e.target.checked }))}
                    className="rounded bg-white/5 border-white/10 text-primary focus:ring-primary focus:ring-offset-0"
                    id="smoker"
                  />
                  <label htmlFor="smoker" className="text-on-surface-variant font-semibold select-none cursor-pointer">Smoker</label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-primary text-background font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all"
              >
                Estimate Premium
              </button>
            </form>

            {calculatedPremium !== null && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-white/5 rounded-xl border border-white/5 text-center text-xs"
              >
                <p className="text-on-surface-variant">Estimated Premium (Monthly)</p>
                <p className="text-xl font-bold text-primary mt-1">₹{calculatedPremium.toLocaleString()}/mo</p>
              </motion.div>
            )}
          </div>

        </div>

        {/* Right Side: Policy Listing */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="flex gap-2 border-b border-white/5 pb-2">
            {["all", "Health", "Life", "Motor"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${
                  activeTab === tab
                    ? "bg-primary text-background border-primary"
                    : "bg-white/5 text-on-surface-variant border-transparent hover:text-white"
                }`}
              >
                {tab === "all" ? "All Policies" : tab}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredPolicies.map((p) => (
              <div key={p.id} className="glass-card rounded-3xl overflow-hidden border border-white/5 hover:border-primary/20 transition-all flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 min-h-[160px] relative">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${p.bgUrl}')` }}
                  ></div>
                  <span className="absolute top-4 left-4 bg-primary text-background px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {p.status}
                  </span>
                </div>
                <div className="w-full md:w-2/3 p-5 flex flex-col justify-between space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-base text-white">{p.title}</h4>
                      <p className="text-xs text-on-surface-variant mt-0.5">Provider: {p.provider}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-primary">₹{(p.premium * 80).toLocaleString()}<span className="text-[10px] text-on-surface-variant font-medium">/mo</span></p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-2 border-y border-white/5 py-3 text-xs">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Policy Number</p>
                      <p className="font-bold text-white font-mono mt-0.5">{p.policyNo}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Renewal Date</p>
                      <p className="font-bold text-white mt-0.5">{p.renewalDate}</p>
                    </div>
                    <div className="hidden md:block">
                      <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Deductible</p>
                      <p className="font-bold text-white mt-0.5">₹{(p.deductible * 80).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowClaimModal(p)}
                      className="flex-1 py-2 rounded-xl bg-white/5 text-xs text-white hover:bg-white/10 font-bold border border-white/10"
                    >
                      File Claim
                    </button>
                    <button
                      onClick={() => handleRenew(p.id)}
                      className="flex-1 py-2 btn-emerald-gradient rounded-xl font-bold text-xs text-background"
                    >
                      Quick Renew
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* File Claim Dialog Modal */}
      {showClaimModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setShowClaimModal(null)} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-md p-6 rounded-3xl z-10 relative space-y-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-white text-base">File Claim Claim Request</h3>
              <button onClick={() => setShowClaimModal(null)} className="text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {claimSuccess ? (
              <div className="text-center py-6 space-y-3">
                <span className="material-symbols-outlined text-4xl text-primary animate-bounce">check_circle</span>
                <p className="text-xs font-semibold text-white">Claim Request Submitted Successfully!</p>
                <p className="text-[10px] text-on-surface-variant">Reference ID: CLM-{Math.floor(Math.random() * 899999 + 100000)}</p>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-on-surface-variant font-semibold">Claim Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50,000"
                    className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-on-surface-variant font-semibold">Claim Description / Reason</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details about the accident or treatment..."
                    className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowClaimModal(null)}
                    className="flex-1 py-2.5 bg-white/5 rounded-xl font-semibold hover:bg-white/10 text-on-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 btn-emerald-gradient rounded-xl font-bold text-xs"
                  >
                    Submit Claim
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}

    </div>
  );
}
