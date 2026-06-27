"use client";

import React, { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";

interface CreditScoreSimulatorProps {
  token: string;
}

interface CustomEvent {
  id: string;
  name: string;
  impact: number;
}

interface HistoryLog {
  timestamp: string;
  action: string;
  score: number;
}

export default function CreditScoreSimulator({ token }: CreditScoreSimulatorProps) {
  // Base score
  const baseScore = 742;

  // Simulation Scenarios States
  const [debtActive, setDebtActive] = useState(true);
  const [debtAmount, setDebtAmount] = useState(5000);

  const [cardActive, setCardActive] = useState(false);
  const [cardType, setCardType] = useState<"gold" | "platinum" | "black">("platinum");

  const [mortgageActive, setMortgageActive] = useState(false);

  // AI Credit Repair Checklist States
  const [disputeResolved, setDisputeResolved] = useState(false);
  const [paymentDateShifted, setPaymentDateShifted] = useState(false);
  const [creditMixOptimized, setCreditMixOptimized] = useState(false);

  // Custom Events State
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
  const [newEventName, setNewEventName] = useState("");
  const [newEventImpact, setNewEventImpact] = useState(-10);
  const [showAddCustom, setShowAddCustom] = useState(false);

  // History log State
  const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([
    { timestamp: new Date().toLocaleTimeString(), action: "Simulator Initialized", score: 742 }
  ]);
  const [showHistory, setShowHistory] = useState(false);

  // Calculated simulated score
  const [simulatedScore, setSimulatedScore] = useState(742);
  const [loading, setLoading] = useState(false);

  // Calculate impacts
  const debtImpact = debtActive ? Math.floor(debtAmount / 120) : 0;
  
  const getCardImpact = (type: "gold" | "platinum" | "black") => {
    if (type === "gold") return -4;
    if (type === "platinum") return -8;
    return -15;
  };
  const cardImpact = cardActive ? getCardImpact(cardType) : 0;

  const mortgageImpact = mortgageActive ? -15 : 0;

  const repairDisputeImpact = disputeResolved ? 12 : 0;
  const repairPaymentImpact = paymentDateShifted ? 8 : 0;
  const repairMixImpact = creditMixOptimized ? 15 : 0;

  const customEventsImpact = customEvents.reduce((sum, e) => sum + e.impact, 0);

  // Total Score Calculation
  const totalProjectedScore = Math.max(300, Math.min(850, 
    baseScore + 
    debtImpact + 
    cardImpact + 
    mortgageImpact + 
    repairDisputeImpact + 
    repairPaymentImpact + 
    repairMixImpact + 
    customEventsImpact
  ));

  // Sync state changes with gauge and logs
  useEffect(() => {
    setSimulatedScore(totalProjectedScore);
  }, [totalProjectedScore]);

  // Log score updates to history
  const logAction = (actionName: string, finalScore: number) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setHistoryLogs((prev) => [
      { timestamp, action: actionName, score: finalScore },
      ...prev.slice(0, 19) // Keep last 20 logs
    ]);
  };

  const handleReset = () => {
    setDebtActive(false);
    setDebtAmount(5000);
    setCardActive(false);
    setCardType("platinum");
    setMortgageActive(false);
    setDisputeResolved(false);
    setPaymentDateShifted(false);
    setCreditMixOptimized(false);
    setCustomEvents([]);
    logAction("Simulator Reset to Defaults", 742);
  };

  const handleAddCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) return;
    const newEvent: CustomEvent = {
      id: Math.random().toString(36).substring(2, 9),
      name: newEventName,
      impact: Number(newEventImpact)
    };
    setCustomEvents((prev) => [...prev, newEvent]);
    const updatedScore = Math.max(300, Math.min(850, totalProjectedScore + newEvent.impact));
    logAction(`Added Scenario: "${newEvent.name}" (${newEvent.impact > 0 ? "+" : ""}${newEvent.impact} pts)`, updatedScore);
    setNewEventName("");
    setNewEventImpact(-10);
    setShowAddCustom(false);
  };

  const handleRemoveCustomEvent = (id: string, name: string, impact: number) => {
    setCustomEvents((prev) => prev.filter((e) => e.id !== id));
    const updatedScore = Math.max(300, Math.min(850, totalProjectedScore - impact));
    logAction(`Removed Scenario: "${name}"`, updatedScore);
  };

  // Sync simulated changes to backend / database
  const applySimulatedToProfile = async () => {
    setLoading(true);
    try {
      let simulatedUtil = 24;
      if (debtActive) {
        simulatedUtil = Math.max(2, 24 - Math.floor(debtAmount / 400));
      }
      if (paymentDateShifted) {
        simulatedUtil = Math.max(2, simulatedUtil - 8);
      }

      const simulatedPayHistory = paymentDateShifted ? Math.min(100, 98 + 1) : 98;
      const simulatedAge = creditMixOptimized ? 7 : 6;

      await apiRequest("/credit-profile/simulate", {
        method: "POST",
        body: JSON.stringify({
          utilization: simulatedUtil,
          paymentHistory: simulatedPayHistory,
          creditAge: simulatedAge
        })
      }, token);

      logAction("Saved simulated profile to database", totalProjectedScore);
      alert("Simulated credit profile successfully synced with Experian database!");
    } catch (err) {
      console.error(err);
      alert("Profile updated in local simulator mode.");
    } finally {
      setLoading(false);
    }
  };

  // Score Rating Helper
  const getRating = (score: number) => {
    if (score >= 800) return { label: "Exceptional", color: "text-primary" };
    if (score >= 740) return { label: "Very Good", color: "text-primary" };
    if (score >= 670) return { label: "Good", color: "text-primary-fixed-dim" };
    if (score >= 580) return { label: "Fair", color: "text-tertiary" };
    return { label: "Poor", color: "text-error" };
  };

  const rating = getRating(simulatedScore);

  // SVG Gauge calculations
  const minScore = 300;
  const maxScore = 850;
  const percentage = Math.max(0, Math.min(1, (simulatedScore - minScore) / (maxScore - minScore)));
  const pathLength = 125.66; // Length of semi-circle of R=40 (pi * R)
  const strokeDashoffset = pathLength - percentage * pathLength;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="font-display-lg text-4xl font-extrabold tracking-tight text-white">Credit Score Simulator</h2>
          <p className="text-on-surface-variant text-base mt-1">
            Project your financial future. Simulate key decisions and witness their real-time impact.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs border border-white/10 hover:bg-white/5 transition-all flex items-center gap-1.5 text-white"
          >
            <span className="material-symbols-outlined text-sm">history</span>
            {showHistory ? "Hide Log" : "History Log"}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-primary text-background hover:brightness-110 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Reset Simulator
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: GAUGE & AI REPAIR */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* FICO Gauge Card */}
          <div className="glass-card rounded-[2rem] p-6 flex flex-col items-center relative overflow-hidden">
            {/* Decorative diagonal neon lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="diagonalLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#42e5b0" stopOpacity="0" />
                  <stop offset="20%" stopColor="#42e5b0" stopOpacity="0.25" />
                  <stop offset="80%" stopColor="#42e5b0" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#42e5b0" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="30%" y1="-10%" x2="-10%" y2="70%" stroke="url(#diagonalLineGrad)" strokeWidth="1.2" />
              <line x1="110%" y1="30%" x2="70%" y2="110%" stroke="url(#diagonalLineGrad)" strokeWidth="1.2" />
            </svg>

            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/80 font-bold mb-6 text-center w-full">
              Current Projected Score
            </p>
            
            {/* Renders gauge */}
            <div className="relative w-72 h-36 overflow-hidden mb-2 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 50">
                <path
                  className="fill-none stroke-[#1e2521] stroke-[12] stroke-linecap-round"
                  d="M10,45 A40,40 0 0,1 90,45"
                ></path>
                <path
                  className="fill-none stroke-primary stroke-[12] stroke-linecap-round transition-all duration-700 ease-out"
                  d="M10,45 A40,40 0 0,1 90,45"
                  strokeDasharray="125.66"
                  strokeDashoffset={strokeDashoffset}
                ></path>
              </svg>
              <div className="absolute bottom-0 text-center flex flex-col items-center">
                <span className="font-display-lg text-5xl font-extrabold text-primary leading-none select-none tracking-tight">
                  {simulatedScore}
                </span>
                <p className="font-bold text-xs mt-1 text-primary tracking-wide">
                  {rating.label}
                </p>
              </div>
            </div>

            {/* Divider Line */}
            <div className="w-full h-px bg-white/5 my-5 z-10"></div>

            {/* Gauge Metrics footer */}
            <div className="grid grid-cols-3 w-full gap-2 text-xs font-semibold z-10">
              <div className="text-left">
                <p className="text-[9px] text-on-surface-variant/70 uppercase font-bold tracking-wider mb-1">Potential</p>
                <p className="text-sm font-extrabold text-primary">
                  {totalProjectedScore - 742 >= 0 ? "+" : ""}
                  {totalProjectedScore - 742} pts
                </p>
              </div>
              <div className="text-center">
                <p className="text-[9px] text-on-surface-variant/70 uppercase font-bold tracking-wider mb-1">Confidence</p>
                <p className="text-sm font-extrabold text-white">99.4%</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-on-surface-variant/70 uppercase font-bold tracking-wider mb-1">Peer Rank</p>
                <p className="text-sm font-extrabold text-white">Top 12%</p>
              </div>
            </div>
          </div>

          {/* AI Credit Repair Card */}
          <div className="glass-card rounded-[2rem] p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-6 glow-pulse pb-3">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                smart_toy
              </span>
              <h3 className="font-headline-md text-base font-bold text-white">AI Credit Repair</h3>
            </div>
            
            <ul className="space-y-4 flex-1">
              {/* Checklist 1 */}
              <li className="flex gap-3 items-start">
                <button 
                  type="button"
                  onClick={() => {
                    const nextState = !disputeResolved;
                    setDisputeResolved(nextState);
                    logAction(nextState ? "Toggled AI Action: Dispute Inaccurate Limit" : "Removed AI Action: Dispute Inaccurate Limit", totalProjectedScore + (nextState ? 12 : -12));
                  }}
                  className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-all ${
                    disputeResolved 
                      ? "bg-primary border-primary text-background" 
                      : "border-white/20 hover:border-primary/50 text-transparent"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </button>
                <div>
                  <p className="text-xs font-bold text-white">Dispute Inaccurate Limit</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    We detected a limit discrepancy on Chase card. Disputing adds <span className="text-primary font-semibold">+12pts</span>.
                  </p>
                </div>
              </li>

              {/* Checklist 2 */}
              <li className="flex gap-3 items-start">
                <button 
                  type="button"
                  onClick={() => {
                    const nextState = !paymentDateShifted;
                    setPaymentDateShifted(nextState);
                    logAction(nextState ? "Toggled AI Action: Shift Payment Date" : "Removed AI Action: Shift Payment Date", totalProjectedScore + (nextState ? 8 : -8));
                  }}
                  className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-all ${
                    paymentDateShifted 
                      ? "bg-primary border-primary text-background" 
                      : "border-white/20 hover:border-primary/50 text-transparent"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </button>
                <div>
                  <p className="text-xs font-bold text-white">Optimization: Payment Date</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Shift payment date to the 4th to reduce reported utilization. Adds <span className="text-primary font-semibold">+8pts</span>.
                  </p>
                </div>
              </li>

              {/* Checklist 3 */}
              <li className="flex gap-3 items-start">
                <button 
                  type="button"
                  onClick={() => {
                    const nextState = !creditMixOptimized;
                    setCreditMixOptimized(nextState);
                    logAction(nextState ? "Toggled AI Action: Strategic Credit Mix" : "Removed AI Action: Strategic Credit Mix", totalProjectedScore + (nextState ? 15 : -15));
                  }}
                  className={`w-5 h-5 rounded border flex items-center justify-center mt-0.5 transition-all ${
                    creditMixOptimized 
                      ? "bg-primary border-primary text-background" 
                      : "border-white/20 hover:border-primary/50 text-transparent"
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px] font-bold">check</span>
                </button>
                <div>
                  <p className="text-xs font-bold text-white">Strategic Credit Mix</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    Opening a vault-secured savings certificate adds <span className="text-primary font-semibold">+15pts</span> in 3 months.
                  </p>
                </div>
              </li>
            </ul>

            <button 
              onClick={applySimulatedToProfile}
              disabled={loading}
              className="mt-6 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-xs text-white disabled:opacity-50 hover:border-primary/30"
            >
              {loading ? "Syncing..." : "Execute Recovery Plan"}
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: SCENARIOS & HISTORY LOG */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          
          {/* History log Overlay */}
          {showHistory && (
            <div className="glass-card rounded-[2rem] p-6 border-primary/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-headline-md text-base font-bold text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span>
                  Simulation Activity Log
                </h3>
                <button onClick={() => setShowHistory(false)} className="text-on-surface-variant hover:text-white">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-2.5 custom-scrollbar pr-2 text-xs">
                {historyLogs.map((log, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-on-surface-variant font-mono">{log.timestamp}</span>
                      <span className="text-white font-medium">{log.action}</span>
                    </div>
                    <span className="font-mono text-primary font-bold">{log.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Simulation Scenarios Grid */}
          <div className="glass-card rounded-[2rem] p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-lg font-bold text-white">Simulation Scenarios</h3>
              <span className="text-xs text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full font-semibold">
                { (debtActive ? 1 : 0) + (cardActive ? 1 : 0) + (mortgageActive ? 1 : 0) + customEvents.length } Active Scenarios
              </span>
            </div>

            <div className="space-y-6">
              {/* Scenario 1: Pay Off Major Debt */}
              <div className={`group relative overflow-hidden bg-surface-container-low/40 rounded-2xl p-5 border transition-all ${
                debtActive ? "border-primary/45 shadow-[0_0_15px_rgba(66,229,176,0.05)]" : "border-white/5"
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => {
                        const nextState = !debtActive;
                        setDebtActive(nextState);
                        logAction(nextState ? `Simulated Debt Payoff: ₹${debtAmount.toLocaleString()}` : "Deactivated Debt Payoff Scenario", totalProjectedScore + (nextState ? debtImpact : -debtImpact));
                      }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        debtActive ? "bg-primary/20 text-primary" : "bg-white/5 text-on-surface-variant hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        account_balance
                      </span>
                    </button>
                    <div>
                      <h4 className="font-semibold text-sm text-white">Pay Off Major Debt</h4>
                      <p className="text-on-surface-variant text-xs mt-0.5">Simulate paying off revolving balance dues.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-extrabold text-sm ${debtActive ? "text-primary" : "text-on-surface-variant"}`}>
                      +{debtImpact} pts
                    </p>
                    <p className="text-[9px] uppercase font-bold text-on-surface-variant">Predicted Impact</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="500"
                    value={debtAmount}
                    disabled={!debtActive}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setDebtAmount(val);
                    }}
                    onMouseUp={() => {
                      logAction(`Adjusted Simulated Debt Payoff: ₹${debtAmount.toLocaleString()}`, totalProjectedScore);
                    }}
                    onTouchEnd={() => {
                      logAction(`Adjusted Simulated Debt Payoff: ₹${debtAmount.toLocaleString()}`, totalProjectedScore);
                    }}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant uppercase font-semibold">
                    <span>₹500</span>
                    <span className={debtActive ? "text-primary font-bold" : "text-on-surface-variant"}>
                      ₹{debtAmount.toLocaleString()}
                    </span>
                    <span>₹10,000</span>
                  </div>
                </div>
              </div>

              {/* Scenario 2: New Credit Line */}
              <div className={`group relative overflow-hidden bg-surface-container-low/40 rounded-2xl p-5 border transition-all ${
                cardActive ? "border-primary/45 shadow-[0_0_15px_rgba(66,229,176,0.05)]" : "border-white/5"
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => {
                        const nextState = !cardActive;
                        setCardActive(nextState);
                        logAction(nextState ? `Simulated Card Application: ${cardType.toUpperCase()} Card` : "Deactivated Card Scenario", totalProjectedScore + (nextState ? cardImpact : -cardImpact));
                      }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        cardActive ? "bg-primary/20 text-primary" : "bg-white/5 text-on-surface-variant hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        credit_card
                      </span>
                    </button>
                    <div>
                      <h4 className="font-semibold text-sm text-white">Apply for New Credit Card</h4>
                      <p className="text-on-surface-variant text-xs mt-0.5">Simulate card inquiry &amp; new line impact.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-extrabold text-sm ${cardActive ? "text-error" : "text-on-surface-variant"}`}>
                      {cardImpact} pts
                    </p>
                    <p className="text-[9px] uppercase font-bold text-on-surface-variant">Hard Inquiry Impact</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  {(["gold", "platinum", "black"] as const).map((type) => {
                    const isSelected = cardType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        disabled={!cardActive}
                        onClick={() => {
                          setCardType(type);
                          logAction(`Simulated Card Change: ${type.toUpperCase()}`, totalProjectedScore + (getCardImpact(type) - cardImpact));
                        }}
                        className={`flex-1 py-2 text-xs rounded-xl border font-bold capitalize transition-all ${
                          !cardActive
                            ? "border-white/5 text-on-surface-variant bg-white/[0.01] cursor-not-allowed"
                            : isSelected
                            ? "border-primary text-primary bg-primary/10 shadow-[0_0_10px_rgba(66,229,176,0.1)]"
                            : "border-white/10 text-white hover:bg-white/5"
                        }`}
                      >
                        {type === "black" ? "Elite Black" : `${type} Card`} ({getCardImpact(type)} pts)
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scenario 3: Mortgage Pre-Approval */}
              <div className={`group relative overflow-hidden bg-surface-container-low/40 rounded-2xl p-5 border transition-all ${
                mortgageActive ? "border-primary/45 shadow-[0_0_15px_rgba(66,229,176,0.05)]" : "border-white/5"
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <button 
                      type="button"
                      onClick={() => {
                        const nextState = !mortgageActive;
                        setMortgageActive(nextState);
                        logAction(nextState ? "Simulated Mortgage Pre-Approval Application" : "Deactivated Mortgage Scenario", totalProjectedScore + (nextState ? mortgageImpact : -mortgageImpact));
                      }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        mortgageActive ? "bg-primary/20 text-primary" : "bg-white/5 text-on-surface-variant hover:text-white"
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                        home
                      </span>
                    </button>
                    <div>
                      <h4 className="font-semibold text-sm text-white">Mortgage Application</h4>
                      <p className="text-on-surface-variant text-xs mt-0.5">Impact of a ₹45L mortgage hard inquiry.</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-extrabold text-sm ${mortgageActive ? "text-error" : "text-on-surface-variant"}`}>
                      {mortgageImpact} pts
                    </p>
                    <p className="text-[9px] uppercase font-bold text-on-surface-variant">Initial 6-mo Impact</p>
                  </div>
                </div>

                {mortgageActive && (
                  <div className="grid grid-cols-2 gap-4 mt-4 animate-float text-xs">
                    <div className="p-3 rounded-xl bg-surface-container-high border border-white/5 flex flex-col">
                      <span className="text-[10px] uppercase text-on-surface-variant font-medium">Interest Savings</span>
                      <span className="text-base font-bold text-primary">-₹12,400/yr</span>
                    </div>
                    <div className="p-3 rounded-xl bg-surface-container-high border border-white/5 flex flex-col">
                      <span className="text-[10px] uppercase text-on-surface-variant font-medium">Score Recovery</span>
                      <span className="text-base font-bold text-white">9 Months</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Render Custom Events */}
              {customEvents.map((e) => (
                <div key={e.id} className="group relative overflow-hidden bg-surface-container-low/20 rounded-2xl p-5 border border-primary/20 flex justify-between items-center transition-all">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">track_changes</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-white">{e.name}</h4>
                      <p className="text-on-surface-variant text-xs mt-0.5">Custom simulation event.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`font-extrabold text-sm ${e.impact > 0 ? "text-primary" : "text-error"}`}>
                        {e.impact > 0 ? "+" : ""}{e.impact} pts
                      </p>
                      <p className="text-[9px] uppercase font-bold text-on-surface-variant">Custom Impact</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomEvent(e.id, e.name, e.impact)}
                      className="text-on-surface-variant hover:text-error transition-colors p-2 hover:bg-white/5 rounded-lg"
                      title="Remove event"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Custom Simulation Event Panel */}
              {!showAddCustom ? (
                <button 
                  type="button"
                  onClick={() => setShowAddCustom(true)}
                  className="w-full py-6 rounded-2xl border-2 border-dashed border-white/10 hover:border-primary/30 hover:bg-primary/5 flex flex-col items-center justify-center gap-2 transition-all group"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-white text-base">add</span>
                  </div>
                  <p className="text-xs font-semibold text-on-surface-variant">Add Custom Simulation Event</p>
                </button>
              ) : (
                <form onSubmit={handleAddCustomEvent} className="bg-surface-container rounded-2xl p-5 border border-white/10 space-y-4">
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h4 className="font-bold text-xs text-white">Add Custom Simulation Scenario</h4>
                    <button type="button" onClick={() => setShowAddCustom(false)} className="text-on-surface-variant hover:text-white">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-on-surface-variant font-bold uppercase">Scenario Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Apply for Auto Loan"
                        required
                        value={newEventName}
                        onChange={(e) => setNewEventName(e.target.value)}
                        className="w-full bg-surface-container-low border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] text-on-surface-variant font-bold uppercase">Estimated Point Impact</label>
                      <select
                        value={newEventImpact}
                        onChange={(e) => setNewEventImpact(Number(e.target.value))}
                        className="w-full bg-surface-container-low border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                      >
                        <option value={15}>+15 pts (Raise Credit Limit)</option>
                        <option value={5}>+5 pts (Good payment record)</option>
                        <option value={-5}>-5 pts (Auto loan hard inquiry)</option>
                        <option value={-15}>-15 pts (Store card inquiry)</option>
                        <option value={-30}>-30 pts (Close oldest credit card)</option>
                        <option value={-60}>-60 pts (30-day Late payment)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setShowAddCustom(false)}
                      className="px-3.5 py-2 border border-white/10 rounded-lg hover:bg-white/5 text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-primary text-background font-bold rounded-lg hover:brightness-110"
                    >
                      Add Scenario
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER EXPLANATIVE SECTION: How AI Predicts Score */}
      <section className="mt-6">
        <div className="glass-card rounded-[2rem] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[16rem]">
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <span className="text-primary font-bold text-xs tracking-widest uppercase mb-2">Neural Insights</span>
              <h3 className="font-headline-lg text-xl sm:text-2xl font-bold mb-3">How AI Predicts Your Score</h3>
              <p className="text-on-surface-variant text-xs leading-relaxed mb-4">
                Our deep-learning models analyze over 5,000 data points across your payment history, credit utilization ratios, credit history length, and hard inquiries. Using compatible Experian and FICO model variables, it projects real-time changes to a 99.4% precision rate.
              </p>
              <div className="flex gap-4 text-xs font-semibold text-white">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-base">verified</span>
                  <span>FICO® Compatible</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-base">shield_lock</span>
                  <span>Bank-Grade Privacy</span>
                </div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-primary/10 to-transparent flex items-center justify-center p-6">
              <div className="relative z-10 glass-card p-5 rounded-2xl border-primary/20 shadow-2xl shadow-primary/10 max-w-xs text-xs">
                <div className="flex gap-3 items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-sm">analytics</span>
                  </div>
                  <h4 className="font-bold text-white">Optimization Active</h4>
                </div>
                <p className="text-on-surface-variant italic mb-3">
                  "Current simulations suggest you are {totalProjectedScore >= 800 ? "already in the highest tier." : "only a few optimizations away from an Exceptional tier. Try enabling the AI Credit Repair checklist."}"
                </p>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(percentage * 100).toFixed(0)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
