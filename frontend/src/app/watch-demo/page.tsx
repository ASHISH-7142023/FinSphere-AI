"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ThreeJsHeroVisual from "@/components/ThreeJsHeroVisual";

export default function WatchDemoPage() {
  const router = useRouter();
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
    <div className="min-h-screen bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary overflow-x-hidden relative flex flex-col">
      {/* 3D Background */}
      <div className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none">
        <ThreeJsHeroVisual />
      </div>

      {/* Top Header Navigation */}
      <header className="w-full sticky top-0 z-50 bg-[#0e1511]/80 backdrop-blur-xl border-b border-white/10 flex justify-between items-center px-6 md:px-12 h-16">
        <div className="flex items-center">
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer active:scale-95 transition-all flex items-center gap-2 group text-on-surface-variant hover:text-primary animate-pulse"
          >
            <span className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            <span className="text-xs font-bold uppercase tracking-wider">Back to Home</span>
          </button>
        </div>
        <div className="font-heading text-lg font-extrabold text-primary tracking-tight">
          FinSphere AI
        </div>
        <div className="flex items-center gap-4 text-on-surface-variant">
          <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">
            notifications
          </span>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20 bg-white/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-primary">person</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 p-6 md:p-12 z-10 max-w-7xl mx-auto w-full">
        {/* Main Video Card */}
        <div className="w-full lg:flex-1 aspect-video glass-panel rounded-3xl overflow-hidden shadow-2xl video-container group relative border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          {/* Video Poster/Thumbnail */}
          <div className="absolute inset-0 z-0">
            <div
              className={`w-full h-full bg-cover bg-center transition-all duration-700 ${
                isPlaying ? "opacity-20 scale-102" : "opacity-60 scale-100"
              }`}
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBNxBZP3Uu6EXmv59EKPGiKbJj9KUo3iRRyUel2FmLRXsQJcHgOaJl0CrTrtv8Ly6fYek28mvW59edcZJ2feYiKzp5Ix6XCkGHnrRNecUB-2LbkTWapeMTiRp1VatdaSy_MSmcTJg0585qMVvJCY6g9d8EaJRx6YOddXWg80tBvhJIVBMm_BMLJgdIh9PdLUByN4i08nNhHGXdmElV0P53RO-28E2PmtNrIYvQQ8QW0gjrM0R06kJwb0WKdLaXixfGDX-TOI5sgbggM')",
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1511] via-transparent to-transparent opacity-60"></div>
          </div>

          {/* Play/Pause Overlay (Initial State) */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center z-20 cursor-pointer group/play"
              onClick={() => setIsPlaying(true)}
            >
              <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center shadow-[0_0_15px_rgba(66,229,176,0.3)] group-hover/play:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined text-primary text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
              </div>
              <h2 className="mt-4 font-heading text-lg font-bold text-white tracking-wide">
                FinSphere AI: The Demo
              </h2>
              <p className="text-on-surface-variant text-xs mt-1">
                Press play to witness the future of wealth management
              </p>
            </div>
          )}

          {/* Subtitles Overlay */}
          {isPlaying && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 text-center w-full max-w-xl px-4 pointer-events-none">
              <p className="text-xs md:text-sm text-white/90 bg-background/60 backdrop-blur-md px-4 py-2 rounded-xl inline-block border border-white/5 leading-relaxed shadow-lg">
                {subtitle}
              </p>
            </div>
          )}

          {/* Video Controls Bar */}
          <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0e1511]/90 to-transparent transition-all duration-300 transform z-30 ${
            isPlaying ? "opacity-0 hover:opacity-100 translate-y-0" : "opacity-100"
          }`}>
            {/* Timeline Progress Bar */}
            <div className="relative h-1.5 w-full bg-white/10 rounded-full mb-4 cursor-pointer group/progress">
              <div
                className="absolute top-0 left-0 h-full bg-primary rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full shadow-lg scale-0 group-hover/progress:scale-100 transition-transform"></div>
              </div>
              {/* Timeline Key Markers */}
              <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border border-primary animate-pulse"></div>
              <div className="absolute left-[45%] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border border-primary animate-pulse"></div>
              <div className="absolute left-[70%] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white border border-primary animate-pulse"></div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-white">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-primary transition-colors flex items-center"
                >
                  <span className="material-symbols-outlined text-2xl">
                    {isPlaying ? "pause" : "play_arrow"}
                  </span>
                </button>
                <span className="text-xs text-white/60">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                {/* Volume Slider */}
                <div className="flex items-center gap-2 ml-2">
                  <span className="material-symbols-outlined text-xs text-white/60">
                    {volume === 0 ? "volume_off" : volume < 50 ? "volume_down" : "volume_up"}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 px-2.5 py-0.5 bg-primary/10 border border-primary/20 rounded-md text-[9px] font-bold text-primary tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  HD 4K
                </div>
                <span className="material-symbols-outlined text-white hover:text-primary cursor-pointer transition-colors text-xl">
                  fullscreen
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info & Schedule Card */}
        <div className="w-full lg:w-80 glass-card rounded-3xl p-6 border border-white/10 bg-white/[0.02] backdrop-blur-xl flex flex-col gap-4 relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-[40px] rounded-full"></div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">smart_toy</span>
            <h3 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
              AI Real-time Insights
            </h3>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-2">
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">
              Active Processing
            </p>
            <p className="text-xs text-white/80 leading-relaxed">
              Analyzing portfolio risk vectors in real-time demo stream...
            </p>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-primary animate-pulse"></div>
            </div>
          </div>

          <button
            onClick={() => setShowScheduleModal(true)}
            className="w-full btn-emerald-gradient py-3 rounded-xl text-background font-bold text-xs hover:shadow-lg transition-all"
          >
            Schedule Personal Demo
          </button>

          <div className="border-t border-white/5 pt-4 mt-2 flex justify-between items-center text-xs">
            <div>
              <p className="text-on-surface-variant text-[9px] uppercase tracking-wider">
                Live Viewers
              </p>
              <div className="flex items-center gap-1 text-white font-bold mt-0.5">
                <span className="material-symbols-outlined text-xs text-primary">group</span>
                <span>1,284</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-on-surface-variant text-[9px] uppercase tracking-wider">
                Experience
              </p>
              <p className="text-primary font-bold mt-0.5">Elite Tier Precision</p>
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Personal Demo Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0e1511]/80 backdrop-blur-md">
          <div className="glass-card w-full max-w-sm p-6 rounded-3xl border border-white/10 bg-[#0e1511] relative shadow-2xl">
            <button
              onClick={() => setShowScheduleModal(false)}
              className="absolute right-4 top-4 text-on-surface-variant hover:text-white"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h4 className="font-heading text-lg font-bold text-white mb-2">Schedule Personal Demo</h4>
            <p className="text-xs text-on-surface-variant mb-4">
              Select a date and time for a 1-on-1 walkthrough of the FinSphere AI platform.
            </p>
            {scheduleSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 bg-primary/20 border border-primary/40 rounded-full flex items-center justify-center mx-auto text-primary animate-bounce">
                  <span className="material-symbols-outlined">check</span>
                </div>
                <p className="text-xs font-bold text-white">Demo Scheduled Successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase">
                    Select Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    required
                    className="w-full input-glass px-3 py-2 rounded-xl text-white text-xs bg-white/[0.03] border border-white/10 focus:border-primary outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full btn-emerald-gradient py-2.5 rounded-xl text-background font-bold text-xs"
                >
                  Confirm Schedule
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
