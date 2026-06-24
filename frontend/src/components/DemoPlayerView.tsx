"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function DemoPlayerView() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(72); // 1:12 in seconds
  const [volume, setVolume] = useState(75);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleSuccess, setScheduleSuccess] = useState(false);
  const [subtitle, setSubtitle] = useState(
    '"Our Predictive AI identifies yield opportunities before they hit the public ticker..."'
  );

  const duration = 225; // 3:45 in seconds

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          
          // Dynamic subtitle changes based on time milestones
          if (next > 45 && next <= 90) {
            setSubtitle('"Analyzing tax harvesting opportunities can save up to ₹8,200 annually."');
          } else if (next > 90 && next <= 150) {
            setSubtitle('"Rebalancing your assets mitigates risk against high-frequency volatility."');
          } else if (next > 150) {
            setSubtitle('"FinSphere AI: Empowering your wealth creation journey in real-time."');
          } else {
            setSubtitle('"Our Predictive AI identifies yield opportunities before they hit the public ticker..."');
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setScheduleSuccess(true);
    setTimeout(() => {
      setScheduleSuccess(false);
      setShowScheduleModal(false);
      setScheduleDate("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display-lg text-3xl font-extrabold tracking-tight">FinSphere Product Demo</h2>
          <p className="text-on-surface-variant text-sm mt-0.5">Explore the core features of the AI platform in action.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 relative">
        
        {/* Main Interactive Video Card */}
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-surface border border-white/10 video-container group">
            
            {/* Background/Thumbnail */}
            <div className="absolute inset-0 z-0">
              <div
                className={`w-full h-full bg-cover bg-center transition-all duration-700 ${
                  isPlaying ? "opacity-30 scale-102" : "opacity-70 scale-100"
                }`}
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNxBZP3Uu6EXmv59EKPGiKbJj9KUo3iRRyUel2FmLRXsQJcHgOaJl0CrTrtv8Ly6fYek28mvW59edcZJ2feYiKzp5Ix6XCkGHnrRNecUB-2LbkTWapeMTiRp1VatdaSy_MSmcTJg0585qMVvJCY6g9d8EaJRx6YOddXWg80tBvhJIVBMm_BMLJgdIh9PdLUByN4i08nNhHGXdmElV0P53RO-28E2PmtNrIYvQQ8QW0gjrM0R06kJwb0WKdLaXixfGDX-TOI5sgbggM')",
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1511] via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Play Overlay (Initial state when paused) */}
            {!isPlaying && (
              <div
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex flex-col items-center justify-center z-20 cursor-pointer group/play"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center shadow-[0_0_15px_rgba(66,229,176,0.3)] group-hover/play:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-primary text-4xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                </div>
                <h3 className="mt-4 font-headline-md text-lg text-white font-bold tracking-wide">EliteWealth AI Walkthrough</h3>
                <p className="text-on-surface-variant text-xs mt-1">Click to launch simulated player experience</p>
              </div>
            )}

            {/* Simulated Captions Overlay */}
            {isPlaying && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 text-center w-full max-w-lg px-4">
                <p className="font-body-md text-xs text-white/90 bg-background/55 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/5 inline-block">
                  {subtitle}
                </p>
              </div>
            )}

            {/* Video Controls (Visible on Hover / Active when playing) */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background/95 to-transparent transition-all duration-300 transform opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-30">
              
              {/* Progress timeline */}
              <div className="relative h-1.5 w-full bg-white/10 rounded-full mb-4 cursor-pointer">
                <div
                  className="absolute top-0 left-0 h-full bg-primary rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full border border-white shadow-md"></div>
                </div>
                
                {/* Hotspot Markers */}
                <div className="absolute left-[25%] top-1/2 -translate-y-1/2 group/marker cursor-pointer">
                  <div className="w-2.5 h-2.5 bg-white rounded-full border border-primary animate-pulse"></div>
                  <span className="hidden group-hover/marker:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-surface-container border border-primary/20 rounded-lg text-[9px] text-primary whitespace-nowrap">
                    0:45 - Tax Optimizer
                  </span>
                </div>

                <div className="absolute left-[65%] top-1/2 -translate-y-1/2 group/marker cursor-pointer">
                  <div className="w-2.5 h-2.5 bg-white rounded-full border border-primary animate-pulse"></div>
                  <span className="hidden group-hover/marker:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-surface-container border border-primary/20 rounded-lg text-[9px] text-primary whitespace-nowrap">
                    2:05 - Rebalance Engine
                  </span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-primary transition-colors flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {isPlaying ? "pause" : "play_arrow"}
                    </span>
                  </button>
                  <span className="text-on-surface-variant">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  <div className="flex items-center gap-1.5 ml-2">
                    <span className="material-symbols-outlined text-white text-sm">volume_up</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 px-2.5 py-0.5 bg-primary/10 border border-primary/20 rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-[8px] font-bold text-primary tracking-widest uppercase">HD 4K</span>
                  </div>
                  <span className="material-symbols-outlined text-white cursor-pointer hover:text-primary transition-colors text-[18px]">settings</span>
                  <span className="material-symbols-outlined text-white cursor-pointer hover:text-primary transition-colors text-[18px]">fullscreen</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Right side: Real-time insights and call-to-action */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          
          {/* Active stats */}
          <div className="glass-card p-6 rounded-2xl relative overflow-hidden space-y-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              <h4 className="font-bold text-sm text-white">Live AI Processing</h4>
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs space-y-3">
              <p className="text-on-surface-variant">Simulating live analysis tracks...</p>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary shimmer transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-primary font-mono">{Math.round((currentTime / duration) * 100)}% analyzed</p>
            </div>

            <button
              onClick={() => setShowScheduleModal(true)}
              className="w-full py-2.5 bg-primary text-background font-bold text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all"
            >
              Schedule Personal Demo
            </button>
          </div>

          {/* Viewer info */}
          <div className="glass-card p-6 rounded-2xl flex justify-between items-center text-xs">
            <div>
              <p className="text-on-surface-variant font-semibold">Active Viewers</p>
              <div className="flex items-center gap-1.5 mt-1 text-white font-bold text-sm">
                <span className="material-symbols-outlined text-primary text-base">group</span>
                <span>1,284 members</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant font-semibold">Release Version</p>
              <p className="text-primary font-bold mt-1">v4.2.1 Stable</p>
            </div>
          </div>

        </div>

      </div>

      {/* Schedule personal demo modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div onClick={() => setShowScheduleModal(false)} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card w-full max-w-sm p-6 rounded-3xl z-10 relative space-y-4"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-white text-base">Schedule Personal Demo</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {scheduleSuccess ? (
              <div className="text-center py-6 space-y-3">
                <span className="material-symbols-outlined text-4xl text-primary animate-bounce">verified</span>
                <p className="text-xs font-semibold text-white">Demo Scheduled Successfully!</p>
                <p className="text-[10px] text-on-surface-variant">We sent an invitation link to your email.</p>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-on-surface-variant font-semibold">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 py-2.5 bg-white/5 rounded-xl font-semibold hover:bg-white/10 text-on-surface"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 btn-emerald-gradient rounded-xl font-bold text-xs"
                  >
                    Confirm Schedule
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
