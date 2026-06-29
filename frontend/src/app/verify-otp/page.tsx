"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmail(sessionStorage.getItem("reset_email") || "");
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (val: string, index: number) => {
    if (/[^0-9]/.test(val)) return;
    const nextOtp = [...otp];
    nextOtp[index] = val;
    setOtp(nextOtp);

    // Focus next input
    if (val !== "" && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("http://localhost:4000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join("") })
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({ message: "Request failed" }));
        throw new Error(body.message ?? "Request failed");
      }
      setSuccess(true);
      setTimeout(() => {
        router.push("/reset-password");
      }, 1000);
    } catch (err: any) {
      setError(err.message ?? "Invalid OTP code. Please check sent_emails.log.");
    } finally {
      setBusy(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) return;
    setTimer(45);
    setError("");
    try {
      await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
    } catch (err) {
      console.error("Failed to resend OTP:", err);
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
            <div className="flex items-center gap-3 mb-2 justify-center">
              <img src="/aplogfi.png" alt="FinSphere AI Logo" className="w-10 h-10 object-contain rounded-xl" />
              <span className="font-heading text-lg font-extrabold text-primary tracking-tight">FinSphere AI</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-white mt-4">Verify Identity</h2>
            <p className="text-on-surface-variant text-xs mt-1">We have sent a 6-digit OTP code to your registered email address.</p>
          </div>

          <form onSubmit={handleVerifySubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs text-center font-medium">
                {error}
              </div>
            )}
            <div className="flex justify-between gap-2.5">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => { inputsRef.current[index] = el; }}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-12 h-12 text-center rounded-xl bg-white/[0.03] border border-white/10 text-white font-bold font-heading text-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  required
                />
              ))}
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-on-surface-variant">Didn't receive the code?</span>
              {timer > 0 ? (
                <span className="text-primary font-bold">Resend in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-primary font-bold hover:underline"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-emerald-gradient w-full py-3.5 rounded-xl text-background font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              {busy ? (
                <span>Verifying...</span>
              ) : success ? (
                <span>OTP Verified!</span>
              ) : (
                <>
                  <span>Verify & Proceed</span>
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <button onClick={() => router.push("/login")} className="text-xs text-on-surface-variant hover:text-white transition-colors underline">
              Back to Sign In
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
