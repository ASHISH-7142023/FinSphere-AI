"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(sessionStorage.getItem("reset_email") || "");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    setBusy(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ message: "Request failed" }));
        throw new Error(body.message ?? "Request failed");
      }
      setSuccess(true);
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("reset_email");
      }
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err: any) {
      setError(err.message ?? "Failed to reset password. Please try again.");
    } finally {
      setBusy(false);
    }
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
            <h2 className="font-heading text-2xl font-bold text-white mt-4">Reset Password</h2>
            <p className="text-on-surface-variant text-xs mt-1">Please enter your new password to regain access to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-xs text-red-400 font-bold text-left">{error}</p>}
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="password">New Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
                <input
                  name="password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass w-full pl-11 pr-11 py-3 rounded-xl text-white text-sm bg-white/[0.03] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">{showPassword ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="confirmPassword">Confirm New Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock_reset</span>
                <input
                  name="confirmPassword"
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-glass w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm bg-white/[0.03] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="••••••••"
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
                <span>Resetting...</span>
              ) : success ? (
                <span>Password Reset Successfully!</span>
              ) : (
                <>
                  <span>Reset Password</span>
                  <span className="material-symbols-outlined text-lg">verified</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
