"use client";

import React, { useState } from "react";

export default function SettingsView({ session, onUpdateUser }: { session: any; onUpdateUser?: (updatedUser: any) => void }) {
  const [name, setName] = useState(session?.user?.name || "Alex Sterling");
  const [email, setEmail] = useState(session?.user?.email || "alex@sterling.com");
  const [currency, setCurrency] = useState("INR");
  const [theme, setTheme] = useState("Emerald");
  const [twoFactor, setTwoFactor] = useState(true);
  const [autoInvest, setAutoInvest] = useState(25000);
  const [apiKey, setApiKey] = useState("fs_live_9921_ax_8832a8f90c1e");
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    if (onUpdateUser && session) {
      onUpdateUser({
        ...session.user,
        name,
        email,
      });
    }
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="font-label-sm text-primary text-xs uppercase tracking-widest font-semibold">User Preferences</span>
        <h2 className="font-display-lg text-4xl font-extrabold tracking-tight text-white mt-1">System Settings</h2>
        <p className="text-on-surface-variant text-base mt-1">Manage your account profile, financial rules, API integrations, and styling theme options.</p>
      </div>

      {saveSuccess && (
        <div className="glass-card border border-primary/30 p-4 rounded-2xl flex items-center gap-3 text-primary text-sm font-bold animate-pulse">
          <span className="material-symbols-outlined">check_circle</span>
          <span>Settings saved successfully! Simulated profile updated.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card */}
        <div className="col-span-12 lg:col-span-6 glass-card p-6 rounded-3xl space-y-6 border border-white/5">
          <h3 className="font-headline-md text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">person</span>
            Profile Settings
          </h3>
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-on-surface-variant font-semibold">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-on-surface-variant font-semibold">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-on-surface-variant font-semibold">Simulated User ID</label>
              <input
                type="text"
                disabled
                value={session?.user?.id || "N/A"}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-on-surface-variant cursor-not-allowed font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-background font-bold rounded-xl hover:brightness-110 active:scale-95 transition-all w-full md:w-auto"
            >
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Preferences and Aesthetics */}
        <div className="col-span-12 lg:col-span-6 glass-card p-6 rounded-3xl space-y-6 border border-white/5">
          <h3 className="font-headline-md text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">palette</span>
            System Preferences
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <div>
                <p className="font-bold text-white">System Currency</p>
                <p className="text-[10px] text-on-surface-variant">Base monetary symbol used across ledgers.</p>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-[#0e1511] border border-white/10 rounded-xl px-3 py-1.5 text-on-surface outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <div>
                <p className="font-bold text-white">Glassmorphism Accent Theme</p>
                <p className="text-[10px] text-on-surface-variant">Primary highlight color customization.</p>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="bg-[#0e1511] border border-white/10 rounded-xl px-3 py-1.5 text-on-surface outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Emerald">Emerald (Classic)</option>
                <option value="Indigo">Indigo (Modern)</option>
                <option value="Amber">Amber (Warning)</option>
                <option value="Cyberpunk">Cyberpunk (Neon)</option>
              </select>
            </div>

            <div className="flex justify-between items-center py-2">
              <div>
                <p className="font-bold text-white">Auto-Rebalance Monthly Limit</p>
                <p className="text-[10px] text-on-surface-variant">Max SIP/Mutual Fund automated sweep caps.</p>
              </div>
              <input
                type="number"
                value={autoInvest}
                onChange={(e) => setAutoInvest(Number(e.target.value))}
                className="w-28 bg-[#0e1511] border border-white/10 rounded-xl px-3 py-1.5 text-right text-on-surface outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>
          </div>
        </div>

        {/* Security & API Developer integration */}
        <div className="col-span-12 glass-card p-6 rounded-3xl space-y-6 border border-white/5">
          <h3 className="font-headline-md text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">terminal</span>
            Security &amp; Developer Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div>
                  <p className="font-bold text-white">Two-Factor Authentication</p>
                  <p className="text-[10px] text-on-surface-variant">Require OTP verification on login requests.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTwoFactor(!twoFactor)}
                  className={`w-12 h-6 rounded-full relative p-0.5 border border-white/10 transition-colors ${twoFactor ? "bg-primary" : "bg-white/5"}`}
                >
                  <div className={`w-4.5 h-4.5 bg-[#0e1511] rounded-full transition-transform duration-300 ${twoFactor ? "translate-x-6" : "translate-x-0"}`}></div>
                </button>
              </div>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl leading-relaxed text-on-surface-variant text-[11px]">
                <strong className="text-primary">Dev Sandbox:</strong> The platform is presently operating inside the sandbox test environment. Local SQLite caching keeps account balances active.
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-on-surface-variant font-semibold">Developer API Key</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="flex-1 bg-[#0e1511] border border-white/10 rounded-xl px-4 py-2.5 text-on-surface font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-primary font-bold transition-all flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-base">{copied ? "done" : "content_copy"}</span>
                  </button>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newKey = "fs_live_" + Math.floor(1000 + Math.random() * 9000) + "_ax_" + Math.random().toString(36).substring(2, 14);
                  setApiKey(newKey);
                  alert("New Developer API Key generated successfully! Update this key in your remote terminal headers.");
                }}
                className="w-full py-2.5 border border-primary/20 hover:bg-primary/10 text-primary font-bold rounded-xl transition-all"
              >
                Regenerate API Credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
