"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface Process {
  id: string;
  name: string;
  status: "ONGOING" | "QUEUED" | "92%";
  active: boolean;
}

export default function AIEngine() {
  const [efficiency, setEfficiency] = useState(99.8);
  const [latency, setLatency] = useState(14);
  const [synapseLoad, setSynapseLoad] = useState(42);
  const [harvesterSaving, setHarvesterSaving] = useState(4120);
  const [forecastRange, setForecastRange] = useState<5 | 10>(5);

  const forecastData5 = [
    { year: 2024, height: "40%", fillHeight: "50%" },
    { year: 2025, height: "55%", fillHeight: "60%" },
    { year: 2026, height: "70%", fillHeight: "70%" },
    { year: 2027, height: "85%", fillHeight: "80%" },
    { year: 2028, height: "98%", fillHeight: "100%" },
  ];

  const forecastData10 = [
    { year: 2024, height: "35%", fillHeight: "45%" },
    { year: 2025, height: "42%", fillHeight: "50%" },
    { year: 2026, height: "49%", fillHeight: "55%" },
    { year: 2027, height: "56%", fillHeight: "60%" },
    { year: 2028, height: "63%", fillHeight: "65%" },
    { year: 2029, height: "70%", fillHeight: "70%" },
    { year: 2030, height: "77%", fillHeight: "75%" },
    { year: 2031, height: "84%", fillHeight: "80%" },
    { year: 2032, height: "91%", fillHeight: "85%" },
    { year: 2033, height: "98%", fillHeight: "95%" },
  ];

  const currentForecast = forecastRange === 5 ? forecastData5 : forecastData10;

  const [processes] = useState<Process[]>([
    { id: "1", name: "Scraping SEC Filings", status: "ONGOING", active: true },
    { id: "2", name: "Rebalancing Crypto Portfolio", status: "92%", active: true },
    { id: "3", name: "Macro Trend Analysis", status: "QUEUED", active: false },
  ]);

  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[02:44:01] SEC scraper: Node #12 connected. Fetching Q3 balance sheets...",
    "[02:44:15] Crypto rebalancer: Tranche 3/4 execution matching Uniswap pools...",
    "[02:44:30] Harvest engine: Tax brackets recalculated. Current savings: +₹3,40,000",
    "[02:44:48] Synapse supervisor: Resource distribution optimized. Latency at 14ms.",
    "[02:45:02] Model validator: Weights validated successfully. Drift score: 0.002",
  ]);

  const handleInitializeCore = () => {
    // Simulate re-calibrating parameters
    setEfficiency(99.9);
    setLatency(11);
    setSynapseLoad(48);
    setHarvesterSaving(prev => prev + 180);
    setLogs(prev => [
      `[${new Date().toLocaleTimeString()}] CORE INITIALIZATION RUNNING: Recalibrating vectors...`,
      ...prev
    ]);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section: The Neural Pulse */}
      <section className="relative overflow-hidden rounded-3xl h-[400px] border border-white/5 bg-black/60 shadow-2xl flex flex-col justify-center px-8 md:px-12 text-white">
        {/* Background Glow */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-primary/30 via-transparent to-transparent pointer-events-none -z-10"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Dynamic WebGL/SVG Neural Grid overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 800 400" preserveAspectRatio="none">
            <g className="stroke-primary/40">
              <line x1="100" y1="100" x2="300" y2="200" strokeWidth="0.5" />
              <line x1="300" y1="200" x2="500" y2="100" strokeWidth="0.5" />
              <line x1="500" y1="100" x2="700" y2="200" strokeWidth="0.5" />
              <line x1="100" y1="300" x2="300" y2="200" strokeWidth="0.5" />
              <line x1="300" y1="200" x2="500" y2="300" strokeWidth="0.5" />
              <line x1="500" y1="300" x2="700" y2="200" strokeWidth="0.5" />
            </g>
            <g fill="#00C896">
              <circle cx="100" cy="100" r="3" className="animate-pulse" />
              <circle cx="300" cy="200" r="4" className="animate-ping" style={{ animationDuration: "3s" }} />
              <circle cx="500" cy="100" r="3" className="animate-pulse" />
              <circle cx="700" cy="200" r="4" className="animate-pulse" />
              <circle cx="100" cy="300" r="3" className="animate-pulse" />
              <circle cx="500" cy="300" r="3" className="animate-pulse" />
            </g>
          </svg>
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-md px-3.5 py-1 rounded-full border border-primary/20 w-fit">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-primary">Live Neural Processing</span>
          </div>
          <h2 className="font-display-lg text-3xl md:text-5xl font-extrabold leading-tight text-white">The Neural Pulse</h2>
          <p className="font-body-lg text-sm md:text-base text-on-surface-variant leading-relaxed">
            Our proprietary AI is currently analyzing 4.2M global market vectors to optimize your liquidity and tax exposure in real-time.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <button
              onClick={handleInitializeCore}
              className="bg-primary text-background font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-all shadow-md shadow-primary/10 text-xs cursor-pointer active:scale-95"
            >
              Initialize Core
            </button>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-white/10 transition-all text-xs cursor-pointer"
            >
              {showLogs ? "Hide System Logs" : "View System Logs"}
            </button>
          </div>
        </div>
      </section>

      {/* Logs Window overlay */}
      {showLogs && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl border border-white/10 font-mono text-xs text-primary bg-black/80 space-y-2 max-h-48 overflow-y-auto"
        >
          <div className="flex justify-between items-center pb-2 border-b border-white/5 mb-3 text-on-surface-variant font-bold">
            <span>AI COMMAND SYSTEM ACTIVITY LOGS</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          </div>
          {logs.map((log, index) => (
            <p key={index} className="leading-relaxed">{log}</p>
          ))}
        </motion.div>
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Column 1: Analytics & Forecasting (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Real-time Analytics */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-surface-container-low/40">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-lg font-bold text-white">Real-time Analytics</h3>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold border border-primary/20 tracking-wider">LIVE FEED</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="flex flex-col gap-1">
                <span className="text-on-surface-variant font-medium text-xs">Fraud Detection</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold text-white">Active</span>
                  <span className="material-symbols-outlined text-primary text-lg">verified_user</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-full shadow-[0_0_10px_#00c896]"></div>
                </div>
                <p className="text-[9px] text-on-surface-variant mt-1.5 uppercase tracking-wide">Scanning 142 gateways</p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-on-surface-variant font-medium text-xs">Tax-Loss Harvesting</span>
                <div className="flex items-center gap-2 mt-1 text-primary">
                  <span className="text-xl font-bold font-mono">+${harvesterSaving.toLocaleString()}</span>
                  <span className="material-symbols-outlined text-lg">auto_graph</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[72%] shadow-[0_0_10px_#00c896]"></div>
                </div>
                <p className="text-[9px] text-on-surface-variant mt-1.5 uppercase tracking-wide">Optimized for Q4</p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-on-surface-variant font-medium text-xs">Risk Assessment</span>
                <div className="flex items-center gap-2 mt-1 text-white">
                  <span className="text-xl font-bold">Optimal</span>
                  <span className="material-symbols-outlined text-secondary text-lg">security</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 mt-3 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[88%] shadow-[0_0_10px_#00c896]"></div>
                </div>
                <p className="text-[9px] text-on-surface-variant mt-1.5 uppercase tracking-wide">Market volatility: Low</p>
              </div>

            </div>
          </div>

          {/* Predictive Forecasting */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-surface-container-low/40">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h3 className="font-headline-sm text-lg font-bold text-white">Predictive Forecasting</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Wealth projection based on current spending velocity</p>
              </div>
              <select
                value={forecastRange}
                onChange={(e) => setForecastRange(Number(e.target.value) as 5 | 10)}
                className="bg-surface-container border border-white/10 rounded-xl text-xs px-3 py-1.5 text-on-surface outline-none cursor-pointer focus:ring-1 focus:ring-primary/45"
              >
                <option value={5}>Next 5 Years</option>
                <option value={10}>Next 10 Years</option>
              </select>
            </div>

            <div className="h-64 relative flex items-end justify-between gap-3 px-4 pt-6">
              {/* Projection Line (SVG Overlay) */}
              <svg className="absolute inset-0 w-full h-[80%] pointer-events-none z-10" preserveAspectRatio="none">
                <motion.path
                  key={forecastRange}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  d={forecastRange === 5 ? "M 50 160 Q 250 115 500 70 T 950 20" : "M 25 180 Q 250 135 500 90 T 975 25"}
                  fill="none"
                  stroke="#00C896"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
              </svg>

              {currentForecast.map((bar) => (
                <div
                  key={bar.year}
                  style={{ height: bar.height }}
                  className="w-full bg-primary/5 rounded-t-xl relative group border-t border-x border-white/5 flex flex-col justify-end transition-all duration-500"
                >
                  <div
                    style={{ height: bar.fillHeight }}
                    className="absolute inset-x-0 bottom-0 bg-primary/20 rounded-t-xl group-hover:bg-primary/40 transition-all duration-300"
                  ></div>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-on-surface-variant">
                    {bar.year}
                  </span>
                </div>
              ))}

            </div>
          </div>

          {/* Core AI Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="glass-card p-5 rounded-2xl border border-white/5 bg-surface-container-low/40 hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 cursor-pointer group">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-background transition-all">
                <span className="material-symbols-outlined text-lg">account_balance</span>
              </div>
              <h4 className="text-sm font-bold mb-2 text-white">Autonomous Budgeting</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">AI automatically redirects surplus cash to high-yield vehicles.</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/5 bg-surface-container-low/40 hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 cursor-pointer group">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-background transition-all">
                <span className="material-symbols-outlined text-lg">trending_up</span>
              </div>
              <h4 className="text-sm font-bold mb-2 text-white">Algorithmic Trading</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">Daily insights based on micro-pattern institutional signals.</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/5 bg-surface-container-low/40 hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 cursor-pointer group">
              <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-background transition-all">
                <span className="material-symbols-outlined text-lg">assignment_turned_in</span>
              </div>
              <h4 className="text-sm font-bold mb-2 text-white">Personalized Audit</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">Automated financial health checkups generated every 24h.</p>
            </div>

          </div>

        </div>

        {/* Column 2: Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Compute Health */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-surface-container-low/40">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">memory</span>
              <h3 className="font-headline-sm text-base font-bold text-white">Compute Health</h3>
            </div>

            <div className="space-y-5">
              
              <div>
                <div className="flex justify-between text-xs mb-2 font-medium">
                  <span className="text-on-surface-variant">Model Efficiency</span>
                  <span className="text-primary font-bold">{efficiency}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[99.8%] shadow-[0_0_10px_rgba(0,200,150,0.5)]" style={{ width: `${efficiency}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2 font-medium">
                  <span className="text-primary font-bold">Latency</span>
                  <span className="text-primary font-bold">{latency}ms</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(100 - latency * 3)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-2 font-medium">
                  <span className="text-on-surface-variant">Neural Synapse Load</span>
                  <span className="text-secondary font-bold">{synapseLoad}%</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary" style={{ width: `${synapseLoad}%` }}></div>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-white/5 space-y-3 font-mono text-[10px] text-on-surface-variant">
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-widest text-[9px]">Uptime</span>
                <span className="text-white">365d 14h 22m</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-widest text-[9px]">Last Update</span>
                <span className="text-white">2 mins ago</span>
              </div>
            </div>
          </div>

          {/* AI Suggestion Card */}
          <div className="glass-card p-6 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden flex flex-col justify-between h-56 shadow-[0_0_20px_rgba(0,200,150,0.05)]">
            <div className="absolute -right-4 -top-4 opacity-5">
              <span className="material-symbols-outlined text-[100px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-primary mb-2.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-base">lightbulb</span>
                Smart Insight
              </h4>
              <p className="text-xs leading-relaxed text-on-surface-variant">
                "Based on current market volatility, transferring ₹2,00,000 to your Emerald Growth fund today could yield an additional 1.2% by EOM."
              </p>
            </div>

            <button
              onClick={() => {
                setHarvesterSaving(prev => prev + 240);
                setLogs(prev => [
                  `[${new Date().toLocaleTimeString()}] Insight executed: Transferring ₹2,00,000 to Emerald Growth... Done.`,
                  ...prev
                ]);
                alert("Tactical reallocation shift executed successfully!");
              }}
              className="w-full py-2.5 bg-primary text-background rounded-xl font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-primary/10 cursor-pointer"
            >
              Execute Shift
            </button>
          </div>

          {/* Active Processes List */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 bg-surface-container-low/40">
            <h4 className="text-[10px] font-bold text-primary mb-4 tracking-wider uppercase">Active Processes</h4>
            <div className="space-y-4">
              {processes.map((proc) => (
                <div key={proc.id} className="flex items-center gap-3">
                  <div className={`h-2.5 w-2.5 rounded-full ${proc.active ? "bg-primary animate-pulse shadow-[0_0_8px_#00c896]" : "bg-white/10"}`}></div>
                  <span className={`text-xs ${proc.active ? "text-on-surface font-medium" : "text-on-surface-variant"}`}>{proc.name}</span>
                  <span className="ml-auto text-[9px] font-bold text-on-surface-variant tracking-wide uppercase">{proc.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
