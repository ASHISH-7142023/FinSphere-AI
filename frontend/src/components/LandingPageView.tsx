"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Session } from "@/lib/api";
import { apiRequest } from "@/lib/api";
import ThreeJsHeroVisual from "./ThreeJsHeroVisual";
import FeaturesExplorer from "./FeaturesExplorer";
import PricingView from "./PricingView";
import AIEngine from "./AIEngine";

export default function LandingPageView({ onSession }: { onSession: (session: Session) => void }) {
  const router = useRouter();
  const [authModal, setAuthModal] = useState<"login" | "register" | "forgot" | "verify" | "reset" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "ai-engine", "pricing"];
      const scrollPos = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // OTP inputs state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    if (authModal === "verify") {
      setTimer(45);
      const interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [authModal]);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      onSession(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  };


  const handleForgotSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthModal("verify");
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthModal("reset");
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password reset successfully! Please log in.");
    setAuthModal("login");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary selection:text-on-primary overflow-x-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[150px] -z-10"></div>

      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/40 backdrop-blur-xl border-b border-white/10 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-container rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
          </div>
          <span className="font-headline-md text-lg font-extrabold text-primary tracking-tight">FinSphere AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold">
          <a className={activeSection === "home" ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"} href="#home">Home</a>
          <a className={activeSection === "features" ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"} href="#features">Features</a>
          <a className={activeSection === "ai-engine" ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"} href="#ai-engine">AI Engine</a>
          <a className={activeSection === "pricing" ? "text-primary border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors"} href="#pricing">Pricing</a>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/login")}
            className="px-4 py-1.5 rounded-lg bg-primary text-background text-xs font-bold hover:brightness-110 transition-all shadow-md shadow-primary/10"
          >
            Log In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          <div className="z-10 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="font-label-sm text-xs text-primary font-bold tracking-wider uppercase">Next-Gen Wealth Intelligence</span>
            </div>
            <h1 className="font-display-lg text-5xl md:text-6xl font-extrabold tracking-tight leading-none text-white">
              Your Wealth,<br /><span className="emerald-gradient-text italic font-bold">Evolved by AI.</span>
            </h1>
            <p className="font-body-lg text-base md:text-lg text-on-surface-variant max-w-xl mx-auto lg:mx-0 leading-relaxed">
              The only financial super-app that thinks as fast as you do. Track, invest, and grow with precision using institutional-grade algorithms.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <button 
                onClick={() => router.push("/login?signup=true")}
                className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-container text-background px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                Get Started
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
              <button 
                onClick={() => router.push("/watch-demo")}
                className="glass-card hover:bg-white/10 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
                Watch Demo
              </button>
            </div>
          </div>

          {/* WebGL Hero Scene container */}
          <div className="relative z-10 h-[350px] lg:h-[500px] flex items-center justify-center border border-white/5 bg-white/[0.01] rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-surface-container/50 px-3 py-1.5 rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] text-primary uppercase font-bold tracking-wider">Neural WebGL Engine</span>
            </div>
            <ThreeJsHeroVisual />
          </div>

        </div>
      </section>

      {/* Social Proof Marquee Ticker */}
      <div className="py-12 bg-surface-container-low border-y border-white/5 overflow-hidden">
        <div className="flex gap-24 items-center animate-ticker whitespace-nowrap">
          <div className="flex gap-24 items-center text-on-surface-variant font-extrabold text-sm opacity-40 uppercase tracking-widest">
            <span>Orion Capital</span>
            <span>Zenith Trust</span>
            <span>Lumina Banc</span>
            <span>Valor Partners</span>
            <span>Equinox Global</span>
            <span>Vertex Asset</span>
          </div>
          <div className="flex gap-24 items-center text-on-surface-variant font-extrabold text-sm opacity-40 uppercase tracking-widest">
            <span>Orion Capital</span>
            <span>Zenith Trust</span>
            <span>Lumina Banc</span>
            <span>Valor Partners</span>
            <span>Equinox Global</span>
            <span>Vertex Asset</span>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        <FeaturesExplorer />
      </section>

      {/* AI Engine Section */}
      <section id="ai-engine" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center space-y-4">
          <span className="font-label-sm text-primary text-xs uppercase tracking-widest font-semibold">Real-Time Intelligence</span>
          <h2 className="font-display-lg text-3xl md:text-4xl font-extrabold text-white">Neural AI Engine</h2>
          <p className="text-on-surface-variant text-sm max-w-2xl mx-auto">
            Interact with our institutional-grade AI core to run calculations, simulate tax implications, and optimize strategies instantly.
          </p>
        </div>
        <div className="glass-card rounded-[2rem] border border-white/10 p-6 md:p-8 bg-surface-container/30 relative overflow-hidden max-w-6xl mx-auto shadow-2xl flex flex-col">
          <AIEngine />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto space-y-16">
        <PricingView />
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-surface-container-lowest text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-md space-y-3 text-center md:text-left">
            <span className="font-headline-md text-lg font-extrabold text-primary block">FinSphere AI</span>
            <p className="text-on-surface-variant leading-relaxed">
              Redefining the financial ecosystem through intelligence and transparency. Join the elite tier of investors today.
            </p>
          </div>
          <div className="flex gap-4">
            <a className="p-2.5 rounded-full glass-card hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center" href="https://github.com/ASHISH-7142023/FinSphere-AI" target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-base">public</span></a>
            <a className="p-2.5 rounded-full glass-card hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center" href="mailto:support@finsphere.ai"><span className="material-symbols-outlined text-base">alternate_email</span></a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant">
          <p>© 2026 FinSphere AI. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="hover:text-on-surface cursor-pointer" onClick={(e) => { e.preventDefault(); alert("Privacy Policy: All FinSphere AI sessions, simulated accounts, and database integrations are processed client-side. No sensitive credentials or credit score parameters are permanently stored or shared."); }}>Privacy Policy</a>
            <a className="hover:text-on-surface cursor-pointer" onClick={(e) => { e.preventDefault(); alert("Terms of Service: This sandbox platform simulates artificial intelligence credit modeling and asset trading for demo purposes. Users assume full responsibility for inputting mock parameters."); }}>Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* High-Fidelity Authentication Modals Overlay Container */}
      <AnimatePresence>
        {authModal !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAuthModal(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-0"
            />

            {/* Modal Card content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel w-full max-w-md overflow-hidden rounded-[2rem] p-8 md:p-10 z-10 relative conic-border bg-surface-container/60 border border-white/10"
            >
              {/* Close Button */}
              <button 
                onClick={() => setAuthModal(null)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>

              {/* Secure encrypted badge */}
              <div className="flex items-center gap-1.5 bg-surface-container-high/60 px-3.5 py-1.5 rounded-full border border-white/5 w-fit mx-auto mb-6">
                <span className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-primary">AES-256 SECURED CONNECTION</span>
              </div>

              {/* Login form */}
              {authModal === "login" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-headline-md text-2xl font-bold text-white">Welcome Back</h2>
                    <p className="text-on-surface-variant text-xs mt-1">Please enter your credentials to log in.</p>
                  </div>
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-on-surface-variant" htmlFor="email">Email Address</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">mail</span>
                        <input
                          name="email"
                          id="email"
                          type="email"
                          className="input-glass w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm"
                          placeholder="demo@finsphere.ai"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-on-surface-variant" htmlFor="password">Password</label>
                        <button 
                          type="button"
                          onClick={() => setAuthModal("forgot")}
                          className="text-[10px] text-primary hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
                        <input
                          name="password"
                          id="password"
                          type="password"
                          className="input-glass w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                    {error && <p className="text-[10px] text-error font-bold text-left">{error}</p>}
                    <button
                      type="submit"
                      disabled={busy}
                      className="btn-emerald-gradient w-full py-3.5 rounded-xl text-background font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      {busy ? "Signing in..." : <>Log In <span className="material-symbols-outlined text-lg">login</span></>}
                    </button>
                  </form>
                  <p className="text-xs text-on-surface-variant text-center">
                    Don't have an account?{" "}
                    <button onClick={() => router.push("/login?signup=true")} className="text-primary font-bold hover:underline">Sign Up</button>
                  </p>
                </div>
              )}



              {/* Forgot Password modal form */}
              {authModal === "forgot" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-headline-md text-2xl font-bold text-white">Reset Password</h2>
                    <p className="text-on-surface-variant text-xs mt-1">Enter your registered email to receive a recovery code.</p>
                  </div>
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-on-surface-variant" htmlFor="recovery-email">Email Address</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">mail</span>
                        <input
                          name="email"
                          id="recovery-email"
                          type="email"
                          className="input-glass w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm"
                          placeholder="alex@example.com"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn-emerald-gradient w-full py-3.5 rounded-xl text-background font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      Send Verification Code
                      <span className="material-symbols-outlined text-lg">send</span>
                    </button>
                  </form>
                  <button 
                    onClick={() => setAuthModal("login")}
                    className="text-xs text-primary font-bold hover:underline block mx-auto text-center"
                  >
                    Back to Log In
                  </button>
                </div>
              )}

              {/* Verify OTP digits */}
              {authModal === "verify" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-headline-md text-2xl font-bold text-white">Verify Identity</h2>
                    <p className="text-on-surface-variant text-xs mt-1">Enter the 6-digit code sent to your email.</p>
                  </div>
                  <form onSubmit={handleVerifySubmit} className="space-y-6">
                    <div className="flex justify-between gap-2.5">
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d?$/.test(val)) {
                              const nextOtp = [...otp];
                              nextOtp[idx] = val;
                              setOtp(nextOtp);
                              if (val && idx < 5) {
                                document.getElementById(`otp-${idx + 1}`)?.focus();
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Backspace" && !otp[idx] && idx > 0) {
                              document.getElementById(`otp-${idx - 1}`)?.focus();
                            }
                          }}
                          className="w-12 h-16 bg-surface-container-lowest border-2 border-white/10 rounded-xl text-center text-primary font-bold text-xl focus:border-primary focus:ring-0 transition-all"
                        />
                      ))}
                    </div>
                    <div className="text-center text-xs space-y-2">
                      <p className="text-on-surface-variant">
                        Resend OTP in <span className="text-primary font-bold">{`00:${timer < 10 ? `0${timer}` : timer}`}</span>
                      </p>
                      <button 
                        type="button" 
                        disabled={timer > 0}
                        onClick={() => {
                          setTimer(45);
                          setOtp(["", "", "", "", "", ""]);
                        }}
                        className={`text-primary font-bold hover:underline ${timer > 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        Resend Code
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="btn-emerald-gradient w-full py-3.5 rounded-xl text-background font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      Verify & Proceed
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Reset Password form */}
              {authModal === "reset" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="font-headline-md text-2xl font-bold text-white">Choose New Password</h2>
                    <p className="text-on-surface-variant text-xs mt-1">Please type your secure new password.</p>
                  </div>
                  <form onSubmit={handleResetSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-on-surface-variant" htmlFor="new-pw">New Password</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">lock</span>
                        <input
                          name="password"
                          id="new-pw"
                          type="password"
                          className="input-glass w-full pl-11 pr-4 py-3 rounded-xl text-white text-sm"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn-emerald-gradient w-full py-3.5 rounded-xl text-background font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      Reset Password
                      <span className="material-symbols-outlined text-lg">lock_reset</span>
                    </button>
                  </form>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
