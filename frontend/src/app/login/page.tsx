"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, type Session } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const raw = localStorage.getItem("finsphere.session");
    if (raw) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const session = await apiRequest<Session>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem("finsphere.session", JSON.stringify(session));
      router.push("/");
      // Force refresh to reload the session context in the root layout/page
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e1511] text-[#dce4de] font-body antialiased relative overflow-x-hidden">
      
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/20 blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] opacity-40"></div>
      </div>

      {/* Main Container */}
      <main className="min-h-screen flex items-center justify-center lg:justify-start relative z-10">
        <div className="w-full h-screen flex flex-col lg:flex-row">
          
          {/* Left Side: Visual Experience (Hero) */}
          <div className="hidden lg:flex lg:w-3/5 xl:w-2/3 relative items-center justify-center p-12 overflow-hidden bg-black/20">
            {/* Cinematic Background Image */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0e1511] via-transparent to-[#0e1511]/50 z-10"></div>
              <img
                alt="FinSphere AI Visualization"
                className="w-full h-full object-cover opacity-60 scale-105"
                src="https://lh3.googleusercontent.com/aida/AP1WRLuPBQOZhrxeQuHszZxz3xOeDW5YQrcd3leFwkA0Ldok9gLv080h09WVJY2KiDsH2evUu8kh2QGAEru1hkMK3FD9B5PL9Y7k3gF2pxTWib5zs3lLF8BPMvbtejOWGWi71Lj32nWbN1ppcmmgXfzKoHS34ID8Cmit-vfvpO_jxaTN_5y9w7-tcJ5mvNYNqJ9uDDPeCuSzoPG-70MUMmuGa8slLvmRGOvE_B5NLPTSFPVmbGtjdQTNhgglSTjB"
              />
            </div>
            
            {/* Floating Branding Overlay */}
            <div className="relative z-20 max-w-2xl animate-pulse duration-[6000ms] space-y-6">
              <h1 className="font-heading text-5xl xl:text-6xl font-extrabold text-white leading-tight">
                Experience the <span className="text-primary">Future</span> of Finance.
              </h1>
              <p className="font-body text-lg text-on-surface-variant max-w-lg leading-relaxed">
                Precision-engineered AI insights for the modern investor. Secure, intelligent, and designed for growth.
              </p>
              
              <div className="pt-8 flex gap-6">
                <div className="glass-card p-5 rounded-xl flex items-center gap-4 border border-white/5 bg-white/[0.02] backdrop-blur-md">
                  <span className="material-symbols-outlined text-primary text-3xl font-bold">verified_user</span>
                  <div>
                    <p className="font-heading text-sm font-bold text-white">Military-Grade Security</p>
                    <p className="text-xs text-on-surface-variant">AES-256 Encrypted</p>
                  </div>
                </div>
                
                <div className="glass-card p-5 rounded-xl flex items-center gap-4 border border-white/5 bg-white/[0.02] backdrop-blur-md">
                  <span className="material-symbols-outlined text-primary text-3xl font-bold">speed</span>
                  <div>
                    <p className="font-heading text-sm font-bold text-white">Real-time Analysis</p>
                    <p className="text-xs text-on-surface-variant">Sub-ms Latency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="w-full lg:w-2/5 xl:w-1/3 flex items-center justify-center p-6 lg:p-12 z-30 bg-[#0e1511]">
            <div className="glass-card w-full max-w-md p-8 lg:p-10 rounded-3xl relative border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl">
              
              {/* Brand Anchor */}
              <div className="mb-8 text-center lg:text-left">
                <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start">
                  <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
                  </div>
                  <span className="font-heading text-lg font-extrabold text-primary tracking-tight">FinSphere AI | Login</span>
                </div>
                <h2 className="font-heading text-2xl font-bold text-white mt-4">Welcome Back</h2>
                <p className="text-on-surface-variant text-xs mt-1">Please enter your details to sign in.</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface-variant" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">mail</span>
                    <input
                      name="email"
                      id="email"
                      type="email"
                      className="input-glass w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm bg-white/[0.03] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="name@company.com"
                      defaultValue="demo@finsphere.ai"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-[#bbcac1]" htmlFor="password">Password</label>
                    <button
                      type="button"
                      onClick={() => router.push("/#forgot-password")}
                      className="text-[10px] text-primary hover:underline font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
                    <input
                      name="password"
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="input-glass w-full pl-11 pr-11 py-3 rounded-xl text-white text-sm bg-white/[0.03] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="••••••••"
                      defaultValue="Demo@12345"
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

                {/* Remember Me */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/10 bg-[#161d1a] text-primary focus:ring-primary focus:ring-offset-background"
                  />
                  <label htmlFor="remember" className="text-xs text-on-surface-variant cursor-pointer select-none">
                    Remember me for 30 days
                  </label>
                </div>

                {error && <p className="text-[10px] text-red-400 font-bold text-left">{error}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={busy}
                  className="btn-emerald-gradient w-full py-3.5 rounded-xl text-background font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  {busy ? (
                    <span>Verifying...</span>
                  ) : (
                    <>
                      <span>Log In</span>
                      <span className="material-symbols-outlined text-lg">login</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10"></div>
                <span className="text-[9px] text-outline font-bold uppercase tracking-widest">or continue with</span>
                <div className="h-px flex-1 bg-white/10"></div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-4">
                <button className="social-btn py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                  <svg className="w-4 h-4 fill-current text-on-surface-variant group-hover:text-white transition-colors" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-5.38z" fill="#EA4335"></path>
                  </svg>
                  <span className="text-xs text-on-surface-variant group-hover:text-white transition-colors">Google</span>
                </button>
                <button className="social-btn py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
                  <svg className="w-4 h-4 fill-current text-on-surface-variant group-hover:text-white transition-colors" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05 1.61-3.21 1.61-1.12 0-1.48-.68-2.83-.68-1.36 0-1.77.66-2.82.68-1.15.03-2.34-.74-3.35-1.74-2.07-2.02-2.64-5.14-1.57-6.81 1.06-1.65 2.76-2.58 4.31-2.58 1.15 0 1.94.41 2.84.41.87 0 1.54-.45 2.88-.45 1.25 0 2.41.56 3.15 1.48-3.08 1.61-2.58 5.6.51 6.89-.6 1.48-1.29 2.59-1.91 3.19zm-4.32-13.6c0-1.43.83-2.81 2.05-3.68-1.3-.08-2.48.74-3.23 1.64-1.12 1.34-.94 3.17.06 3.68.17.08.34.12.51.12.92 0 1.84-.71 2.61-1.76z"></path>
                  </svg>
                  <span className="text-xs text-on-surface-variant group-hover:text-white transition-colors">Apple</span>
                </button>
              </div>

              {/* Footer Call to Action */}
              <div className="mt-8 text-center">
                <p className="text-xs text-on-surface-variant">
                  Don't have an account?{" "}
                  <button onClick={() => router.push("/#register")} className="text-primary font-bold hover:underline">
                    Sign Up
                  </button>
                </p>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-[#2f3632] border border-white/10 px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-white">System: Stable</span>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
