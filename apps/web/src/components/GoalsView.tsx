"use client";

import React from "react";
import { currency } from "@/lib/utils";
import type { Goal } from "@finsphere/shared";

interface GoalsViewProps {
  goals: Goal[];
  onOpenAddModal: () => void;
}

export default function GoalsView({ goals, onOpenAddModal }: GoalsViewProps) {
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);

  return (
    <div className="space-y-6">
      {/* View Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2">
        <div>
          <h2 className="font-display-lg text-4xl emerald-gradient-text tracking-tight font-extrabold">Savings Goals</h2>
          <p className="text-on-surface-variant text-base mt-2 max-w-lg">
            AI-driven wealth acceleration. Your targets, optimized by high-frequency roundups and smart pooling.
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar self-end">
          <div className="flex-shrink-0 glass-card px-5 py-3 rounded-2xl flex flex-col min-w-[140px]">
            <span className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">Total Saved</span>
            <span className="font-headline-md text-xl font-extrabold text-primary mt-1">{currency(totalSaved)}</span>
          </div>
          <div className="flex-shrink-0 glass-card px-5 py-3 rounded-2xl flex flex-col min-w-[120px]">
            <span className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">Active Goals</span>
            <span className="font-headline-md text-xl font-extrabold text-on-surface mt-1">{goals.length}</span>
          </div>
          <button
            onClick={onOpenAddModal}
            className="flex-shrink-0 bg-primary/10 hover:bg-primary/20 border border-primary/30 px-5 py-3 rounded-2xl flex flex-col justify-center items-center min-w-[130px] group transition-all"
          >
            <span className="material-symbols-outlined text-primary text-xl group-hover:scale-110 transition-transform">
              add_circle
            </span>
            <span className="text-primary font-bold text-xs mt-1">New Goal</span>
          </button>
        </div>
      </header>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Primary Hero Goal */}
        <div className="md:col-span-8 glass-card rounded-3xl p-6 md:p-8 conic-glow relative overflow-hidden group">
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative z-10">
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                  <span
                    className="material-symbols-outlined text-primary text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    electric_car
                  </span>
                </div>
                <div>
                  <h3 className="font-headline-md text-lg font-bold text-white">Tesla Model S Plaid</h3>
                  <p className="text-on-surface-variant text-xs">High-Performance Asset</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end text-xs">
                  <span className="text-on-surface-variant font-semibold">Progress</span>
                  <span className="text-primary font-bold text-sm">74%</span>
                </div>
                <div className="h-3.5 w-full bg-white/5 rounded-full p-0.5 border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full relative shadow-[0_0_15px_rgba(66,229,176,0.3)] transition-all"
                    style={{ width: "74%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs pt-1">
                  <span className="text-on-surface-variant font-semibold">₹88,800.00 saved</span>
                  <span className="text-on-surface font-semibold">₹1,20,000.00 target</span>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/3 grid grid-cols-1 gap-4">
              <div className="bg-surface-container-high/60 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-1.5 mb-1 text-xs">
                  <span className="material-symbols-outlined text-primary text-base">schedule</span>
                  <span className="text-on-surface-variant uppercase font-semibold">Time Horizon</span>
                </div>
                <p className="font-headline-md text-lg font-bold text-white">142 Days</p>
                <p className="text-on-surface-variant text-[10px] mt-0.5 font-medium">On track for Oct 2024</p>
              </div>
              <div className="bg-surface-container-high/60 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-1.5 mb-1 text-xs">
                  <span className="material-symbols-outlined text-primary text-base">bolt</span>
                  <span className="text-on-surface-variant uppercase font-semibold">AI Roundups</span>
                </div>
                <p className="font-headline-md text-lg font-bold emerald-gradient-text">+₹4,210.88</p>
                <p className="text-on-surface-variant text-[10px] mt-0.5 font-medium">Smart round-ups this quarter</p>
              </div>
            </div>
          </div>
        </div>

        {/* Collaborative Pools */}
        <div className="md:col-span-4 glass-card rounded-3xl p-6 flex flex-col justify-between border-primary/20 border-dashed border-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline-md text-base font-bold text-white">Active Pool</h3>
            <span className="px-3 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Collaborative
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-surface-container-highest rounded-xl flex items-center justify-center border border-white/10">
                <span
                  className="material-symbols-outlined text-on-surface text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  flight
                </span>
              </div>
              <div>
                <h4 className="font-label-md text-xs font-semibold text-on-surface">Europe 2025 Tour</h4>
                <p className="text-on-surface-variant text-[10px] mt-0.5">4 contributors</p>
              </div>
            </div>

            <div className="flex -space-x-2.5 items-center">
              <img
                className="w-8 h-8 rounded-full border-2 border-surface-container object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW_nQIbXonIgFzCCha9OQXIFEosN9lrVsf2lWzyth83-f4GdogpUA4ThGizsxKltiQQi29RqDq1n4p_HSV9-IJsH7ARnSZ2SCjwCIm9EhrjW_k2R9phl_pUgcHq5Dsiva0RhQ0OB3vw0lddkaGOS_elPbl4ZsTvqN4SIP86_jT3GIQP5JaJXLB2C4qohY1YYudjqaKPUz6B8bEQNSxBNbxtWO7dmeTj6Rnrrf9uurcey2Ll-C1HOXBiRlwjbLWlcr9keDw-A-AcsZ4"
                alt="user"
              />
              <img
                className="w-8 h-8 rounded-full border-2 border-surface-container object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm28xvoYwSEMBeJE_Cn0yEEYNcCOUUdMTFPYBqdBncJjbJwuPH6jSkF1zXEB_6WdEczUo78hT6g7Zg0YtHsLIAlbRQNCY8U7hmt2brbgWexKbXV9umJLnVeFxNsIVhJOZlkAV5HW34jOHFNwoqkuuzQTdLE1pwCh2lsdOqP-HxAEzlu3w1I7GmLqCtHKzixMihDjZnHIlALE1g4aJbRPixI8Xe7d5wLypSEzz6A3Z-BlA7zC0jYvBQDeLStkJkjxONBhydunFlbIvR"
                alt="user"
              />
              <div className="w-8 h-8 rounded-full border-2 border-surface-container bg-surface-container-highest flex items-center justify-center text-[10px] text-on-surface-variant font-bold">
                +2
              </div>
              <span className="text-on-surface-variant text-[10px] font-semibold ml-4">+₹8,500 this week</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-on-surface-variant">
                <span>Pool Progress</span>
                <span className="text-primary">49%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full animate-progress" style={{ width: "49.6%" }}></div>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 py-2 border border-white/10 rounded-xl text-xs font-bold text-on-surface-variant hover:text-primary hover:border-primary/50 transition-colors flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-sm">payments</span>
            Contribute to Pool
          </button>
        </div>

        {/* Dynamic & Secondary Goals List */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((g) => {
            const ratio = Math.min(100, (g.currentAmount / g.targetAmount) * 100);
            return (
              <div key={g.id} className="glass-card rounded-2xl p-5 group hover:scale-[1.02] duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 bg-tertiary/10 rounded-xl border border-tertiary/20">
                    <span className="material-symbols-outlined text-tertiary text-lg">security</span>
                  </div>
                  <button className="p-1 hover:bg-white/5 rounded">
                    <span className="material-symbols-outlined text-on-surface-variant">more_horiz</span>
                  </button>
                </div>
                <h4 className="font-headline-md text-base font-bold mb-1 text-white">{g.title}</h4>
                <p className="text-on-surface-variant text-xs mb-4">Target Deadline: {g.targetDate}</p>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-tertiary rounded-full shadow-[0_0_8px_rgba(255,188,162,0.3)]"
                      style={{ width: `${ratio}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-bold text-on-surface-variant">
                    <span className="text-on-surface">{Math.round(ratio)}% Complete</span>
                    <span>{currency(g.currentAmount)} Saved</span>
                  </div>
                </div>
              </div>
            );
          })}
          {goals.length === 0 && (
            <div className="col-span-3 py-10 text-center text-on-surface-variant text-sm bg-white/5 rounded-xl border border-white/5">
              No additional goals configured. Click "New Goal" to add your targets.
            </div>
          )}
        </div>

        {/* Smart AI Optimization widget */}
        <div className="md:col-span-12 glass-card rounded-3xl p-6 bg-gradient-to-r from-primary/5 to-transparent flex flex-col md:flex-row items-center gap-6 border border-white/5">
          <div className="flex-shrink-0 w-16 h-16 rounded-full border border-primary/30 flex items-center justify-center relative">
            <div className="absolute inset-0 animate-pulse bg-primary/10 rounded-full"></div>
            <span
              className="material-symbols-outlined text-3xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              psychology
            </span>
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-headline-md text-base font-bold text-primary mb-1">AI Optimization Action Recommended</h4>
            <p className="text-on-surface-variant text-xs leading-relaxed">
              Our algorithm detects a ₹4,200/mo surplus in your dining and entertainment budget. Redirecting these funds
              to your primary goal could reduce your target deadline by 18 days.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-5 py-2.5 bg-primary text-background font-bold text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all">
              Accept Optimization
            </button>
            <button className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-on-surface font-semibold text-xs rounded-xl transition-all">
              Review Impact
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
