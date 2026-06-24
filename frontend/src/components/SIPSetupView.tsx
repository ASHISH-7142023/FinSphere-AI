"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { currency } from "@/lib/utils";

interface Fund {
  id: string;
  name: string;
  category: string;
  risk: string;
  returns: string;
  selected: boolean;
  logo: string;
}

export default function SIPSetupView() {
  const [funds, setFunds] = useState<Fund[]>([
    {
      id: "1",
      name: "FinSphere Bluechip Growth Fund",
      category: "Equity",
      risk: "Very High Risk",
      returns: "18.4% p.a.",
      selected: true,
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAq133TIML9RiccYohLlxMY28sqWW4HA1Jb6zdRJaNvY8-31QPLFEJoMkA7t4SKAsoy9tPRwrV2vmxG6wtHSVqeUdXMotL56hJQJaoUfECcOr0A4XeB1oeuYQ5vfoKivFZXsFAoJXnJM_ZNvWyBaUWMW_0GRtoAS7PSpan9pZr6-5MmRMqTxsQcBTDSuuN9skkeng31koZ4JCZKvSeui04q6ECmu9j3orTMBGq5uguD57GlKJ8WEKZ9yegzzpF5IUISAs_f4L4rvWmL",
    },
    {
      id: "2",
      name: "Techno-Focus Direct Plan",
      category: "Equity",
      risk: "Sectoral / Technology",
      returns: "21.2% p.a.",
      selected: false,
      logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCflWazHKfj6F2P0l0Ai5FeNxKFuE0-gsfsaqL5SNt0oCy7Z9cOqnKnUbesNBZzmqj1SSoY1Q5wACeyMRmI_C0gFl3viRJGHnPXVTC_XMtHCVeTjaKI1EEjOgPiVMw5rY2B0FBC5aF2ZZ88J22Z4EXEdjwIejloKQdyxkaRj-YTopHH4V-DQHGeNmJY_tt14BxeVqriCfck3uLwdTLOyxIK7zU5CqwPdLY2oq4yRYVh-NAhl_gKmLGJBEE_h5ISxognS5GnDr5vx_ik",
    },
  ]);

  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [sipDate, setSipDate] = useState("05");
  const [years, setYears] = useState(10);
  const [expectedReturn, setExpectedReturn] = useState(15);
  const [isSetupSuccess, setIsSetupSuccess] = useState(false);

  const activeFund = funds.find((f) => f.selected) || funds[0]!;

  // Calculate SIP compound returns: M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
  const monthlyRate = expectedReturn / 12 / 100;
  const totalMonths = years * 12;
  const investedAmount = monthlyAmount * totalMonths;
  const finalValue = Math.round(
    monthlyAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
  );
  const estimatedReturns = Math.max(0, finalValue - investedAmount);

  const handleSelectFund = (id: string) => {
    setFunds((prev) =>
      prev.map((f) => ({
        ...f,
        selected: f.id === id,
      }))
    );
  };

  const handleQuickAdd = (amt: number) => {
    setMonthlyAmount((prev) => prev + amt);
  };

  const handleCreateSIP = () => {
    setIsSetupSuccess(true);
  };

  const handleReset = () => {
    setIsSetupSuccess(false);
    setMonthlyAmount(5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="font-display-lg text-4xl font-extrabold tracking-tight">AI wealth portfolio Builder</h2>
        <p className="text-on-surface-variant text-base">Setup high-performance automated mutual fund investments (SIP) with compound modeling.</p>
      </div>

      {isSetupSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 rounded-3xl border border-primary/30 max-w-xl mx-auto text-center space-y-6 bg-gradient-to-b from-primary/5 to-transparent"
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto animate-bounce">
            <span className="material-symbols-outlined text-primary text-3xl font-bold">verified</span>
          </div>
          <div>
            <h3 className="font-headline-md text-2xl font-bold text-white">SIP Setup Complete!</h3>
            <p className="text-on-surface-variant text-sm mt-1">Your auto-debit mandate is scheduled with your linked bank account.</p>
          </div>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2 text-left max-w-md mx-auto text-xs">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Fund Name</span>
              <span className="text-white font-bold">{activeFund.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Monthly Installment</span>
              <span className="text-primary font-bold">{currency(monthlyAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Due Date</span>
              <span className="text-white font-bold">{sipDate}th of every month</span>
            </div>
          </div>

          <button onClick={handleReset} className="px-6 py-2.5 btn-emerald-gradient rounded-xl font-bold text-xs mx-auto">
            Setup Another SIP
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          
          {/* Left panel: Config Setup */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            {/* Step 1: Fund Selection */}
            <div className="glass-card p-6 rounded-3xl space-y-6 border border-white/10">
              <div className="flex justify-between items-center">
                <h3 className="font-headline-md text-lg font-bold">1. Select Mutual Fund</h3>
                <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Top Performance List
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {funds.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => handleSelectFund(f.id)}
                    className={`p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                      f.selected
                        ? "bg-primary-container/10 border-primary shadow-lg shadow-primary/10"
                        : "bg-white/5 border-white/5 hover:border-primary/30"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <img className="w-9 h-9 rounded-lg object-contain bg-white p-1" src={f.logo} alt={f.name} />
                      <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                        {f.returns} 3Y
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white">{f.name}</h4>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{f.category} • {f.risk}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Investment Inputs */}
            <div className="glass-card p-6 rounded-3xl space-y-6 border border-white/10">
              <h3 className="font-headline-md text-lg font-bold">2. Investment Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Monthly installment amount */}
                <div className="space-y-3">
                  <label className="text-xs text-on-surface-variant font-semibold">Monthly Investment Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-sm">₹</span>
                    <input
                      type="number"
                      value={monthlyAmount}
                      onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                      className="w-full bg-[#0e1511] border border-white/10 rounded-2xl pl-8 pr-4 py-3.5 text-base font-bold focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleQuickAdd(1000)} className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold hover:bg-primary/20 hover:text-primary transition-colors">+ ₹1,000</button>
                    <button onClick={() => handleQuickAdd(5000)} className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold hover:bg-primary/20 hover:text-primary transition-colors">+ ₹5,000</button>
                    <button onClick={() => handleQuickAdd(10000)} className="px-3 py-1.5 rounded-lg bg-white/5 text-[10px] font-bold hover:bg-primary/20 hover:text-primary transition-colors">+ ₹10,000</button>
                  </div>
                </div>

                {/* Date of SIP */}
                <div className="space-y-3">
                  <label className="text-xs text-on-surface-variant font-semibold">SIP Date</label>
                  <select
                    value={sipDate}
                    onChange={(e) => setSipDate(e.target.value)}
                    className="w-full bg-[#0e1511] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-on-surface focus:ring-1 focus:ring-primary"
                  >
                    <option value="01">01st of every month</option>
                    <option value="05">05th of every month</option>
                    <option value="10">10th of every month</option>
                    <option value="15">15th of every month</option>
                  </select>
                  <p className="text-[10px] text-on-surface-variant italic">Next installment will process on the {sipDate}th of next month</p>
                </div>

              </div>
            </div>

            {/* Step 3: Interactive Sliders */}
            <div className="glass-card p-6 rounded-3xl space-y-6 border border-white/10">
              <h3 className="font-headline-md text-lg font-bold">3. Returns Compound Simulator</h3>
              <div className="space-y-6">
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface-variant">Tenure / Time Horizon</span>
                    <span className="text-primary font-bold">{years} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface-variant">Expected Returns (p.a.)</span>
                    <span className="text-primary font-bold">{expectedReturn}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Right panel: Live Compound calculations & charts */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-6">
              <h4 className="font-bold text-sm text-white">AI Wealth Projection (Estimated)</h4>
              
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant">Invested Capital</span>
                    <span className="text-white font-bold">{currency(investedAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant">Estimated Returns</span>
                    <span className="text-primary font-bold">+{currency(estimatedReturns)}</span>
                  </div>
                  <div className="h-px bg-white/10"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant font-bold">Total Portfolio Value</span>
                    <span className="text-primary font-bold text-sm">{currency(finalValue)}</span>
                  </div>
                </div>
              </div>

              {/* visual representation bar chart */}
              <div className="space-y-2">
                <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Compound Growth Mix</p>
                <div className="w-full h-5 bg-white/5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-white/20 h-full"
                    style={{ width: `${(investedAmount / finalValue) * 100}%` }}
                    title="Invested"
                  ></div>
                  <div
                    className="bg-primary h-full shadow-[0_0_10px_rgba(66,229,176,0.4)]"
                    style={{ width: `${(estimatedReturns / finalValue) * 100}%` }}
                    title="Returns"
                  ></div>
                </div>
                <div className="flex justify-between text-[9px] text-on-surface-variant font-medium">
                  <span>Invested ({Math.round((investedAmount / finalValue) * 100)}%)</span>
                  <span>Gain ({Math.round((estimatedReturns / finalValue) * 100)}%)</span>
                </div>
              </div>

              <button
                onClick={handleCreateSIP}
                className="w-full py-3.5 btn-emerald-gradient rounded-xl font-bold text-xs hover:brightness-110 active:scale-95 transition-all"
              >
                Activate Automated SIP
              </button>
            </div>

            {/* Smart Advice */}
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary flex items-start gap-3">
              <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_awesome
              </span>
              <div className="text-xs">
                <p className="font-bold text-white">AI Broker Advice</p>
                <p className="text-on-surface-variant mt-1 leading-relaxed">
                  Stepping up your monthly SIP by just <span className="text-primary font-bold">₹1,000</span> next year would boost your projected wealth by <span className="text-primary font-bold">₹1.8L</span> due to long-term compounding cycles.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
