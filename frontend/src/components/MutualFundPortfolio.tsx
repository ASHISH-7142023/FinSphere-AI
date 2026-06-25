"use client";

import React, { useState } from "react";

export default function MutualFundPortfolio() {
  const [isRebalanced, setIsRebalanced] = useState(false);
  const [techWeight, setTechWeight] = useState(42);

  const handleRebalance = () => {
    setIsRebalanced(true);
    setTechWeight(35);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
        <div>
          <span className="font-label-sm text-primary text-xs uppercase tracking-widest font-semibold">Portfolio Overview</span>
          <h2 className="font-display-lg text-4xl font-extrabold tracking-tight text-white mt-1">Mutual Fund Portfolio</h2>
          <p className="text-on-surface-variant text-base mt-1">Track mutual fund assets, portfolio health, and receive smart AI rebalancing recommendations.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-card px-6 py-3 rounded-2xl flex flex-col justify-center">
            <span className="font-label-sm text-on-surface-variant text-[11px] uppercase tracking-wider font-semibold">Portfolio Value</span>
            <span className="font-headline-lg text-2xl font-bold text-on-surface mt-0.5">$482,904.50</span>
          </div>
          <div className="glass-card px-6 py-3 rounded-2xl flex flex-col justify-center border border-primary/20">
            <span className="font-label-sm text-primary text-[11px] uppercase tracking-wider font-semibold">Current XIRR</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-headline-lg text-2xl font-bold text-primary">24.8%</span>
              <span className="material-symbols-outlined text-primary text-sm font-bold animate-bounce">trending_up</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Health Score */}
        <div className="col-span-12 lg:col-span-4 glass-card p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-headline-md text-xl font-bold text-on-surface">Health Score</h3>
              <span className="material-symbols-outlined text-primary text-2xl">verified_user</span>
            </div>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="80" cy="80" fill="transparent" r="70" stroke="rgba(255,255,255,0.03)" strokeWidth="12"></circle>
                  <circle
                    className="text-primary glow-accent animate-pulse"
                    cx="80"
                    cy="80"
                    fill="transparent"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    strokeDasharray="440"
                    strokeDashoffset={isRebalanced ? "18" : "44"}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display-lg text-4xl font-extrabold text-on-surface">{isRebalanced ? "96" : "92"}</span>
                  <span className="font-label-sm text-[10px] text-primary uppercase font-bold tracking-widest mt-1">Excellent</span>
                </div>
              </div>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant text-center mt-4 px-2">
              Your portfolio is well-diversified across large-cap and aggressive growth funds. Risk exposure is optimal.
            </p>
          </div>
        </div>

        {/* AI Rebalance */}
        <div className="col-span-12 lg:col-span-8 glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-primary/5 via-transparent to-transparent"></div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
              </div>
              <h3 className="font-headline-md text-xl font-bold text-on-surface">AI Rebalance Advisor</h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
              {isRebalanced ? (
                <span className="text-primary font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  Rebalance executed successfully! Your sector allocation is now perfectly aligned with target weights.
                </span>
              ) : (
                <span>
                  FinSphere AI has detected a drift in your sector allocation. Rebalancing now could potentially increase your annualized returns by{" "}
                  <strong className="text-primary font-bold">2.4%</strong>.
                </span>
              )}
            </p>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-on-surface-variant">Current Tech Weight</span>
                  <span className={isRebalanced ? "text-primary font-bold" : "text-on-surface"}>{techWeight}%</span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${techWeight}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-on-surface-variant">Recommended Tech Target</span>
                  <span className="text-primary">35%</span>
                </div>
                <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-primary/20">
                  <div className="bg-primary/40 h-full" style={{ width: "35%" }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center md:items-end border-t border-white/5 pt-6 mt-6">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <div className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Action Recommended</div>
              <div className={`font-headline-md text-lg font-extrabold ${isRebalanced ? "text-on-surface-variant line-through" : "text-primary"}`}>
                Shift $24,500.00
              </div>
              <div className="font-label-sm text-xs text-on-surface-variant mt-0.5">From Growth to Debt Funds</div>
            </div>
            <button
              onClick={handleRebalance}
              disabled={isRebalanced}
              className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all group text-xs ${
                isRebalanced
                  ? "bg-white/5 text-on-surface-variant/40 border border-white/5 cursor-not-allowed"
                  : "bg-primary text-on-primary hover:shadow-lg hover:shadow-primary/20 active:scale-95"
              }`}
            >
              <span>{isRebalanced ? "Rebalanced" : "Execute AI Recommendation"}</span>
              {!isRebalanced && (
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="glass-card rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline-md text-lg font-bold text-on-surface">Top Performing Funds</h3>
          <button className="text-primary font-label-md text-xs hover:underline font-semibold">View All Holdings</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-on-surface-variant border-b border-white/5 text-xs font-semibold">
                <th className="pb-3">Fund Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Invested Value</th>
                <th className="pb-3">Current Value</th>
                <th className="pb-3">Returns (1Y)</th>
                <th className="pb-3 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="group border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors cursor-pointer">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-primary border border-white/5 text-xs">V</div>
                    <div>
                      <p className="font-bold text-on-surface">Vanguard S&P 500 Index</p>
                      <p className="text-[11px] text-on-surface-variant">Growth • Large Cap</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-on-surface-variant">Equity</td>
                <td className="py-4 text-on-surface">$120,000</td>
                <td className="py-4 text-on-surface">$148,200</td>
                <td className="py-4 text-primary font-bold">+23.5%</td>
                <td className="py-4 text-right">
                  <div className="inline-block w-24 h-6 opacity-60 group-hover:opacity-100 transition-opacity">
                    <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0 25 Q 10 5, 20 20 T 40 10 T 60 25 T 80 5 T 100 15" fill="none" stroke="#00c896" strokeWidth="2.5"></path>
                    </svg>
                  </div>
                </td>
              </tr>
              <tr className="group border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors cursor-pointer">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-secondary border border-white/5 text-xs">F</div>
                    <div>
                      <p className="font-bold text-on-surface">Fidelity Blue Chip Growth</p>
                      <p className="text-[11px] text-on-surface-variant">Aggressive • Large Cap</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-on-surface-variant">Equity</td>
                <td className="py-4 text-on-surface">$85,000</td>
                <td className="py-4 text-on-surface">$112,400</td>
                <td className="py-4 text-primary font-bold">+32.2%</td>
                <td className="py-4 text-right">
                  <div className="inline-block w-24 h-6 opacity-60 group-hover:opacity-100 transition-opacity">
                    <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0 28 L 20 15 L 40 22 L 60 5 L 80 12 L 100 2" fill="none" stroke="#00c896" strokeWidth="2.5"></path>
                    </svg>
                  </div>
                </td>
              </tr>
              <tr className="group border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors cursor-pointer">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center font-bold text-on-surface-variant border border-white/5 text-xs">P</div>
                    <div>
                      <p className="font-bold text-on-surface">PIMCO Income Fund</p>
                      <p className="text-[11px] text-on-surface-variant">Conservative • Debt</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-on-surface-variant">Fixed Income</td>
                <td className="py-4 text-on-surface">$50,000</td>
                <td className="py-4 text-on-surface">$54,100</td>
                <td className="py-4 text-on-surface-variant font-bold">+8.2%</td>
                <td className="py-4 text-right">
                  <div className="inline-block w-24 h-6 opacity-60 group-hover:opacity-100 transition-opacity">
                    <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                      <path d="M0 20 L 100 15" fill="none" stroke="#bbcac1" strokeWidth="2.5"></path>
                    </svg>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Discovery Cards */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <h3 className="font-headline-md text-lg font-bold text-on-surface">Discover High-Yield Opportunities</h3>
          <span className="px-2.5 py-0.5 bg-primary/10 text-primary font-label-sm text-[10px] rounded-full border border-primary/20 font-bold uppercase tracking-wider">AI Curated</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Fund Card 1 */}
          <div className="glass-card p-6 rounded-3xl hover:-translate-y-1.5 transition-all flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-surface-container-high rounded-xl text-primary">
                  <span className="material-symbols-outlined">eco</span>
                </div>
                <div className="text-right">
                  <div className="font-label-sm text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Potential YTM</div>
                  <div className="font-headline-md text-xl font-bold text-primary mt-0.5">18.4%</div>
                </div>
              </div>
              <h4 className="font-headline-md text-base font-bold text-on-surface mb-2">Green Energy Index</h4>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                A thematic fund focused on hydrogen fuel cells and battery storage leaders in EMEA markets.
              </p>
            </div>
            <div className="mt-6">
              <div className="flex gap-2 mb-4">
                <span className="px-2.5 py-0.5 bg-white/5 rounded-lg text-[10px] text-on-surface-variant font-medium">High Risk</span>
                <span className="px-2.5 py-0.5 bg-white/5 rounded-lg text-[10px] text-on-surface-variant font-medium">Thematic</span>
              </div>
              <button className="w-full py-2.5 bg-white/5 hover:bg-primary hover:text-on-primary border border-white/10 hover:border-primary rounded-xl font-bold transition-all text-xs">
                Learn More
              </button>
            </div>
          </div>

          {/* Fund Card 2 */}
          <div className="glass-card p-6 rounded-3xl hover:-translate-y-1.5 transition-all flex flex-col justify-between h-full border border-primary/10 shadow-lg shadow-primary/5">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-surface-container-high rounded-xl text-primary">
                  <span className="material-symbols-outlined">memory</span>
                </div>
                <div className="text-right">
                  <div className="font-label-sm text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Potential YTM</div>
                  <div className="font-headline-md text-xl font-bold text-primary mt-0.5">22.1%</div>
                </div>
              </div>
              <h4 className="font-headline-md text-base font-bold text-on-surface mb-2">NextGen AI Tech</h4>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Exposure to early-stage generative AI infrastructure and semiconductor supply chains.
              </p>
            </div>
            <div className="mt-6">
              <div className="flex gap-2 mb-4">
                <span className="px-2.5 py-0.5 bg-white/5 rounded-lg text-[10px] text-on-surface-variant font-medium">Aggressive</span>
                <span className="px-2.5 py-0.5 bg-white/5 rounded-lg text-[10px] text-on-surface-variant font-medium">Tech</span>
              </div>
              <button className="w-full py-2.5 bg-primary text-on-primary hover:brightness-110 rounded-xl font-bold transition-all text-xs shadow-md shadow-primary/20">
                Learn More
              </button>
            </div>
          </div>

          {/* Fund Card 3 */}
          <div className="glass-card p-6 rounded-3xl hover:-translate-y-1.5 transition-all flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-surface-container-high rounded-xl text-primary">
                  <span className="material-symbols-outlined">apartment</span>
                </div>
                <div className="text-right">
                  <div className="font-label-sm text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">Potential YTM</div>
                  <div className="font-headline-md text-xl font-bold text-primary mt-0.5">12.5%</div>
                </div>
              </div>
              <h4 className="font-headline-md text-base font-bold text-on-surface mb-2">Urban REIT Advantage</h4>
              <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
                Stable monthly dividends from premium commercial real estate in high-growth tier-1 cities.
              </p>
            </div>
            <div className="mt-6">
              <div className="flex gap-2 mb-4">
                <span className="px-2.5 py-0.5 bg-white/5 rounded-lg text-[10px] text-on-surface-variant font-medium">Low Risk</span>
                <span className="px-2.5 py-0.5 bg-white/5 rounded-lg text-[10px] text-on-surface-variant font-medium">Income</span>
              </div>
              <button className="w-full py-2.5 bg-white/5 hover:bg-primary hover:text-on-primary border border-white/10 hover:border-primary rounded-xl font-bold transition-all text-xs">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
