"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest, type Session } from "@/lib/api";

function LoginCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const signupParam = searchParams.get("signup") === "true";
  
  const [isRegister, setIsRegister] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [oauthSimulation, setOauthSimulation] = useState<"google" | "apple" | null>(null);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [selectedOAuthEmail, setSelectedOAuthEmail] = useState("");

  useEffect(() => {
    if (signupParam) {
      setIsRegister(true);
    }
  }, [signupParam]);

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
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const monthlyIncome = String(Number(formData.get("monthlyIncome")));

    try {
      const session = await apiRequest<Session>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, monthlyIncome }),
      });
      localStorage.setItem("finsphere.session", JSON.stringify(session));
      router.push("/");
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  const handleOAuthLogin = (provider: "google" | "apple") => {
    setOauthSimulation(provider);
    setOauthLoading(false);
    setError("");
  };

  const handleOAuthComplete = async (provider: "google" | "apple", name: string, email: string) => {
    setOauthLoading(true);
    setError("");
    setSelectedOAuthEmail(email);

    // Simulate realistic OAuth validation handshake
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const password = "OAuthVerified@123";
    const monthlyIncome = "150000";

    try {
      let session;
      try {
        session = await apiRequest<Session>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
      } catch {
        session = await apiRequest<Session>("/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password, monthlyIncome }),
        });
      }

      localStorage.setItem("finsphere.session", JSON.stringify(session));
      router.push("/");
      setTimeout(() => {
        window.location.href = "/";
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : `${provider} authentication failed`);
      setOauthSimulation(null);
    } finally {
      setOauthLoading(false);
    }
  };

  return (
    <div className="glass-card w-full max-w-md p-8 lg:p-10 rounded-3xl relative border border-white/10 bg-white/[0.02] backdrop-blur-xl shadow-2xl">
      
      {/* Renders Login Form */}
      {!isRegister ? (
        <>
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
                  onClick={() => router.push("/forgot-password")}
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
            <button type="button" onClick={() => handleOAuthLogin("google")} className="social-btn py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
              <svg className="w-4 h-4 fill-current text-on-surface-variant group-hover:text-white transition-colors" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-5.38z" fill="#EA4335"></path>
              </svg>
              <span className="text-xs text-on-surface-variant group-hover:text-white transition-colors">Google</span>
            </button>
            <button type="button" onClick={() => handleOAuthLogin("apple")} className="social-btn py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
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
              <button onClick={() => setIsRegister(true)} className="text-primary font-bold hover:underline">
                Sign Up
              </button>
            </p>
          </div>
        </>
      ) : (
        <>
          {/* Brand Anchor */}
          <div className="mb-8 text-center lg:text-left">
            <div className="flex items-center gap-2 mb-2 justify-center lg:justify-start">
              <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
              </div>
              <span className="font-heading text-lg font-extrabold text-primary tracking-tight">FinSphere AI | Register</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-white mt-4">Create Account</h2>
            <p className="text-on-surface-variant text-xs mt-1">Join the elite tier of institutional investors.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            
            {/* Full Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="name">Full Name</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">person</span>
                <input
                  name="name"
                  id="name"
                  type="text"
                  className="input-glass w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm bg-white/[0.03] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Alex Sterling"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="reg-email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">mail</span>
                <input
                  name="email"
                  id="reg-email"
                  type="email"
                  className="input-glass w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm bg-white/[0.03] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="reg-password">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
                <input
                  name="password"
                  id="reg-password"
                  type="password"
                  className="input-glass w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm bg-white/[0.03] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Income Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant" htmlFor="reg-income">Monthly Income (₹)</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">payments</span>
                <input
                  name="monthlyIncome"
                  id="reg-income"
                  type="number"
                  className="input-glass w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm bg-white/[0.03] border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="150000"
                  required
                />
              </div>
            </div>

            {error && <p className="text-[10px] text-red-400 font-bold text-left">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={busy}
              className="btn-emerald-gradient w-full py-3.5 rounded-xl text-background font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
            >
              {busy ? (
                <span>Registering...</span>
              ) : (
                <>
                  <span>Register</span>
                  <span className="material-symbols-outlined text-lg">how_to_reg</span>
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

          {/* Social Register */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => handleOAuthLogin("google")} className="social-btn py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
              <svg className="w-4 h-4 fill-current text-on-surface-variant group-hover:text-white transition-colors" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-5.38z" fill="#EA4335"></path>
              </svg>
              <span className="text-xs text-on-surface-variant group-hover:text-white transition-colors">Google</span>
            </button>
            <button type="button" onClick={() => handleOAuthLogin("apple")} className="social-btn py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group">
              <svg className="w-4 h-4 fill-current text-on-surface-variant group-hover:text-white transition-colors" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05 1.61-3.21 1.61-1.12 0-1.48-.68-2.83-.68-1.36 0-1.77.66-2.82.68-1.15.03-2.34-.74-3.35-1.74-2.07-2.02-2.64-5.14-1.57-6.81 1.06-1.65 2.76-2.58 4.31-2.58 1.15 0 1.94.41 2.84.41.87 0 1.54-.45 2.88-.45 1.25 0 2.41.56 3.15 1.48-3.08 1.61-2.58 5.6.51 6.89-.6 1.48-1.29 2.59-1.91 3.19zm-4.32-13.6c0-1.43.83-2.81 2.05-3.68-1.3-.08-2.48.74-3.23 1.64-1.12 1.34-.94 3.17.06 3.68.17.08.34.12.51.12.92 0 1.84-.71 2.61-1.76z"></path>
              </svg>
              <span className="text-xs text-on-surface-variant group-hover:text-white transition-colors">Apple</span>
            </button>
          </div>

          {/* Footer Call to Action */}
          <div className="mt-8 text-center">
            <p className="text-xs text-on-surface-variant">
              Already have an account?{" "}
              <button onClick={() => setIsRegister(false)} className="text-primary font-bold hover:underline">
                Log In
              </button>
            </p>
          </div>
        </>
      )}

      {/* Floating Badge */}
      <div className="absolute -top-4 -right-4 bg-[#2f3632] border border-white/10 px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-white">System: Stable</span>
      </div>

      {/* Google Sign-in Simulation Overlay */}
      {oauthSimulation === "google" && (
        <div className="absolute inset-0 bg-[#1f2023] z-50 rounded-3xl p-8 flex flex-col justify-between text-white font-sans">
          {oauthLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-[#e8eaed]">Signing in with Google...</p>
              <p className="text-xs text-[#9aa0a6]">{selectedOAuthEmail}</p>
            </div>
          ) : (
            <>
              <div>
                {/* Google Logo */}
                <div className="flex justify-center mb-5">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-5.38z" fill="#EA4335"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-normal text-center text-[#e8eaed]">Choose an account</h3>
                <p className="text-xs text-center text-[#9aa0a6] mt-1.5">to continue to <span className="font-semibold text-primary">FinSphere AI</span></p>

                {/* Account Chooser List */}
                <div className="mt-8 space-y-1">
                  
                  {/* Account 1 */}
                  <button
                    type="button"
                    onClick={() => handleOAuthComplete("google", "Alex Sterling", "alex.sterling@gmail.com")}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors border-b border-[#3c4043]/40 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1a73e8] flex items-center justify-center font-bold text-sm text-white">
                      A
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#e8eaed]">Alex Sterling</p>
                      <p className="text-[10px] text-[#9aa0a6]">alex.sterling@gmail.com</p>
                    </div>
                  </button>

                  {/* Account 2 */}
                  <button
                    type="button"
                    onClick={() => handleOAuthComplete("google", "Demo User", "demo@finsphere.ai")}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors border-b border-[#3c4043]/40 last:border-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#12b5cb] flex items-center justify-center font-bold text-sm text-white">
                      D
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#e8eaed]">Demo User</p>
                      <p className="text-[10px] text-[#9aa0a6]">demo@finsphere.ai</p>
                    </div>
                  </button>

                  {/* Use another account */}
                  <button
                    type="button"
                    onClick={() => handleOAuthComplete("google", "Google User", "google.user@finsphere.ai")}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#3c4043] flex items-center justify-center font-bold text-sm text-white">
                      <span className="material-symbols-outlined text-base">person_add</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#e8eaed]">Use another account</p>
                    </div>
                  </button>

                </div>
              </div>

              {/* Consent Footer */}
              <div className="space-y-4">
                <p className="text-[10px] text-[#9aa0a6] leading-relaxed">
                  To continue, Google will share your name, email address, language preference, and profile picture with FinSphere AI.
                </p>
                <button
                  type="button"
                  onClick={() => setOauthSimulation(null)}
                  className="w-full py-2.5 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-xs font-semibold text-[#9aa0a6] hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Apple Sign-in Simulation Overlay */}
      {oauthSimulation === "apple" && (
        <div className="absolute inset-0 bg-[#000000] z-50 rounded-3xl p-8 flex flex-col justify-between text-white font-sans">
          {oauthLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-[#e8eaed]">Connecting to Apple...</p>
              <p className="text-xs text-[#9aa0a6]">Using FaceID / Apple ID keychains</p>
            </div>
          ) : (
            <>
              <div>
                {/* Apple Logo */}
                <div className="flex justify-center mb-5 text-white">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05 1.61-3.21 1.61-1.12 0-1.48-.68-2.83-.68-1.36 0-1.77.66-2.82.68-1.15.03-2.34-.74-3.35-1.74-2.07-2.02-2.64-5.14-1.57-6.81 1.06-1.65 2.76-2.58 4.31-2.58 1.15 0 1.94.41 2.84.41.87 0 1.54-.45 2.88-.45 1.25 0 2.41.56 3.15 1.48-3.08 1.61-2.58 5.6.51 6.89-.6 1.48-1.29 2.59-1.91 3.19zm-4.32-13.6c0-1.43.83-2.81 2.05-3.68-1.3-.08-2.48.74-3.23 1.64-1.12 1.34-.94 3.17.06 3.68.17.08.34.12.51.12.92 0 1.84-.71 2.61-1.76z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-center text-white tracking-tight">Sign in with Apple</h3>
                <p className="text-xs text-center text-[#86868b] mt-1">Use your Apple ID to sign in to FinSphere AI.</p>

                {/* Form fields */}
                <div className="mt-8 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#86868b] tracking-wider">Apple ID</label>
                    <input
                      type="text"
                      className="w-full bg-[#1c1c1e] border border-[#3a3a3c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0a84ff]"
                      defaultValue="apple.user@icloud.com"
                      readOnly
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[#86868b] tracking-wider">Password</label>
                    <input
                      type="password"
                      className="w-full bg-[#1c1c1e] border border-[#3a3a3c] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0a84ff]"
                      defaultValue="••••••••••••"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleOAuthComplete("apple", "Apple Investor", "apple.user@finsphere.ai")}
                  className="w-full py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                >
                  <span>Continue</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOauthSimulation(null)}
                  className="w-full py-2.5 rounded-xl border border-[#3a3a3c] hover:bg-[#1c1c1e] transition-colors text-xs font-semibold text-[#86868b] hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const raw = localStorage.getItem("finsphere.session");
    if (raw) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0e1511] text-[#dce4de] font-body antialiased relative overflow-x-hidden">
      
      {/* Background Orbs & Ambient Photo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-[#0e1511]/80 backdrop-blur-[1px] z-10"></div>
        <img
          alt="FinSphere Ambient Background"
          className="w-full h-full object-cover opacity-20 scale-105"
          src="/screen.png"
        />
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-primary/20 blur-[100px] opacity-40 z-20"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-secondary/10 blur-[100px] opacity-40 z-20"></div>
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
                src="/screen.png"
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

          {/* Right Side: Login Form with Suspense Wrapper */}
          <div className="w-full lg:w-2/5 xl:w-1/3 flex items-center justify-center p-6 lg:p-12 z-30 bg-[#0e1511]">
            <Suspense fallback={<div className="text-primary text-sm font-bold">Initializing...</div>}>
              <LoginCardContent />
            </Suspense>
          </div>

        </div>
      </main>
    </div>
  );
}
