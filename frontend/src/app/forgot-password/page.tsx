"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    // Simulate sending OTP
    setTimeout(() => {
      setBusy(false);
      setSuccess(true);
      setTimeout(() => {
        router.push("/verify-otp");
      }, 1000);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#0e1511] text-[#dce4de] font-body antialiased relative overflow-x-hidden flex items-center justify-center">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/20 blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] opacity-40"></div>
      </div>

      <main className="w-full max-w-md p-6 z-10 relative">
        <div className="glass-card p-8 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl space-y-6">
          <div className="text-center">
            <div className="flex items-center gap-2 mb-2 justify-center">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
              </div>
              <span className="font-heading text-lg font-extrabold text-primary tracking-tight">FinSphere AI</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-white mt-4">Forgot Password?</h2>
            <p className="text-on-surface-variant text-xs mt-1">Enter your email and we'll send you a password reset OTP.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">mail</span>
                <input
                  name="email"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm bg-white/[0.03] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-emerald-gradient w-full py-3.5 rounded-xl text-background font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              {busy ? (
                <span>Sending...</span>
              ) : success ? (
                <span>OTP Sent Successfully!</span>
              ) : (
                <>
                  <span>Send Reset OTP</span>
                  <span className="material-symbols-outlined text-lg">send</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-xs text-on-surface-variant">
              Remembered your password?{" "}
              <button onClick={() => router.push("/login")} className="text-primary font-bold hover:underline">
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
