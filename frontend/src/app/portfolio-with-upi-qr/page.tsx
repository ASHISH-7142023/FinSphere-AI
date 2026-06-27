"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Budget, DashboardSummary, Expense, Goal, Investment } from "@/shared";
import { EXPENSE_CATEGORIES, INVESTMENT_TYPES } from "@/shared";
import { apiRequest, type Session } from "@/lib/api";
import { currency } from "@/lib/utils";

import AIAdvisorView from "@/components/AIAdvisorView";
import UtilitiesHubView from "@/components/UtilitiesHubView";
import MerchantKhataView from "@/components/MerchantKhataView";
import RewardsOffersView from "@/components/RewardsOffersView";
import SIPSetupView from "@/components/SIPSetupView";
import InsuranceHubView from "@/components/InsuranceHubView";
import DemoPlayerView from "@/components/DemoPlayerView";
import LandingPageView from "@/components/LandingPageView";
import ExpensesView from "@/components/ExpensesView";
import BudgetsView from "@/components/BudgetsView";
import GoalsView from "@/components/GoalsView";
import InvestmentsView from "@/components/InvestmentsView";
import CreditView from "@/components/CreditView";
import ReportsView from "@/components/ReportsView";
import MutualFundPortfolio from "@/components/MutualFundPortfolio";
import FeaturesExplorer from "@/components/FeaturesExplorer";
import PricingView from "@/components/PricingView";
import CreditCardBillCenter from "@/components/CreditCardBillCenter";
import SettingsView from "@/components/SettingsView";

type View =
  | "dashboard"
  | "expenses"
  | "budgets"
  | "goals"
  | "investments"
  | "mutual-funds"
  | "credit"
  | "reports"
  | "ai-advisor"
  | "utilities"
  | "credit-card-center"
  | "merchant-khata"
  | "rewards"
  | "sip-setup"
  | "insurance"
  | "features"
  | "pricing"
  | "demo"
  | "settings";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "ai-advisor", label: "AI Advisor Chat", icon: "smart_toy" },
  { id: "utilities", label: "Utilities Hub", icon: "account_balance_wallet" },
  { id: "credit-card-center", label: "Credit Card Bills", icon: "credit_card" },
  { id: "expenses", label: "Expenses", icon: "payments" },
  { id: "budgets", label: "Budget Planner", icon: "savings" },
  { id: "goals", label: "Goals", icon: "target" },
  { id: "investments", label: "Investments", icon: "trending_up" },
  { id: "mutual-funds", label: "Mutual Funds", icon: "finance_mode" },
  { id: "sip-setup", label: "SIP Setup", icon: "toll" },
  { id: "credit", label: "Credit Engine", icon: "credit_score" },
  { id: "features", label: "Features Explorer", icon: "explore" },
  { id: "pricing", label: "Premium Tiers", icon: "workspace_premium" },
  { id: "insurance", label: "Insurance Hub", icon: "shield" },
  { id: "merchant-khata", label: "Merchant Khata", icon: "receipt_long" },
  { id: "rewards", label: "Rewards & Offers", icon: "military_tech" },
  { id: "reports", label: "Reports", icon: "bar_chart_4_bars" },
  { id: "settings", label: "Settings", icon: "settings" }
] as const;


export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [view, setView] = useState<View>("dashboard");
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [alerts, setAlerts] = useState<Array<{ category: string; overBy: number }>>([]);
  const [report, setReport] = useState<{ totalIncome: number; totalExpenses: number; categoryAnalysis: Array<{ category: string; amount: number; count: number }> } | null>(null);
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState("");

  
  // Modal states for creating/editing resources
  const [activeModal, setActiveModal] = useState<"expense" | "budget" | "goal" | "investment" | null>(null);
  const [utilityTab, setUtilityTab] = useState<"mobile" | "electricity" | "water" | "dth" | "gas" | "fastag" | "upi-qr">("mobile");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [sidebarWidth, setSidebarWidth] = useState(256);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(200, Math.min(450, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);


  useEffect(() => {
    const checkSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem("finsphere.session");
    if (raw) setSession(JSON.parse(raw) as Session);
  }, []);

  useEffect(() => {
    if (session) void refreshAll(session.token);
  }, [session]);

  async function refreshAll(token = session?.token) {
    if (!token) return;
    setLoading(true);
    try {
      const [summaryRes, expensesRes, budgetsRes, goalsRes, investmentsRes, reportRes] = await Promise.all([
        apiRequest<DashboardSummary>("/dashboard/summary", {}, token),
        apiRequest<{ expenses: Expense[] }>("/expenses", {}, token),
        apiRequest<{ budgets: Budget[]; alerts: Array<{ category: string; overBy: number }> }>("/budgets", {}, token),
        apiRequest<{ goals: Goal[] }>("/goals", {}, token),
        apiRequest<{ investments: Investment[] }>("/investments", {}, token),
        apiRequest<{ totalIncome: number; totalExpenses: number; categoryAnalysis: Array<{ category: string; amount: number; count: number }> }>("/reports/monthly", {}, token)
      ]);
      setSummary(summaryRes);
      setExpenses(expensesRes.expenses);
      setBudgets(budgetsRes.budgets);
      setAlerts(budgetsRes.alerts);
      setGoals(goalsRes.goals);
      setInvestments(investmentsRes.investments);
      setReport(reportRes);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load FinSphere data");
    } finally {
      setLoading(false);
    }
  }

  if (!session) {
    return (
      <LandingPageView
        onSession={(next) => {
          localStorage.setItem("finsphere.session", JSON.stringify(next));
          setSession(next);
        }}
      />
    );
  }

  const handleCreateExpense = async (data: Record<string, any>) => {
    await apiRequest("/expenses", {
      method: "POST",
      body: JSON.stringify({
        amount: Number(data.amount),
        category: data.category,
        description: data.description,
        date: data.date
      })
    }, session.token);
    await refreshAll();
  };

  const handleCreateBudget = async (data: Record<string, any>) => {
    await apiRequest("/budgets", {
      method: "POST",
      body: JSON.stringify({
        category: data.category,
        limitAmount: Number(data.limitAmount),
        month: data.month
      })
    }, session.token);
    await refreshAll();
  };

  const handleCreateGoal = async (data: Record<string, any>) => {
    await apiRequest("/goals", {
      method: "POST",
      body: JSON.stringify({
        title: data.title,
        targetAmount: Number(data.targetAmount),
        currentAmount: Number(data.currentAmount),
        targetDate: data.targetDate
      })
    }, session.token);
    await refreshAll();
  };

  const handleCreateInvestment = async (data: Record<string, any>) => {
    await apiRequest("/investments", {
      method: "POST",
      body: JSON.stringify({
        assetType: data.assetType,
        name: data.name,
        investedAmount: Number(data.investedAmount),
        currentValue: Number(data.currentValue)
      })
    }, session.token);
    await refreshAll();
  };

  const scale = sidebarWidth / 256;
  const buttonStyle = {
    padding: `${Math.max(6, Math.min(18, 12 * scale))}px ${Math.max(8, Math.min(24, 16 * scale))}px`,
    fontSize: `${Math.max(10, Math.min(18, 12 * scale))}px`,
    gap: `${Math.max(6, Math.min(16, 12 * scale))}px`,
  };
  const iconStyle = {
    fontSize: `${Math.max(16, Math.min(28, 20 * scale))}px`,
  };
  const titleStyle = {
    fontSize: `${(sidebarWidth - 56) / 7.0}px`,
  };
  const subtitleStyle = {
    fontSize: `${Math.max(10, Math.min(18, 11 * scale))}px`,
  };

  return (
    <main className="min-h-screen bg-background text-on-background selection:bg-primary/30">
      
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="glow-orb top-[-10%] left-[-5%] bg-primary"></div>
        <div className="glow-orb bottom-[-10%] right-[-5%] bg-secondary-container"></div>
      </div>

      {/* Side Navigation Bar */}
      <aside 
        style={{ width: `${sidebarWidth}px` }}
        className="hidden lg:flex flex-col h-screen fixed left-0 top-0 overflow-y-auto p-6 border-r border-white/10 bg-surface/40 backdrop-blur-xl z-[60] sidebar-scrollbar select-none"
      >
        <div className="mb-10 px-2" style={{ marginBottom: `${Math.max(16, Math.min(48, 40 * scale))}px` }}>
          <div className="flex flex-col">
            <span style={titleStyle} className="font-extrabold font-heading text-primary tracking-tight leading-none transition-all whitespace-nowrap">FinSphere AI |</span>
            <span style={titleStyle} className="font-extrabold font-heading text-primary tracking-tight leading-none transition-all whitespace-nowrap">Dashboard</span>
            <span style={titleStyle} className="font-extrabold font-heading text-primary tracking-tight leading-none transition-all whitespace-nowrap">Overview</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span style={subtitleStyle} className="font-semibold uppercase tracking-widest text-on-surface-variant">Elite Tier</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                style={buttonStyle}
                className={`flex w-full items-center rounded-xl text-left transition-all ${
                  isActive
                    ? "bg-primary-container text-on-primary-container font-bold shadow-lg shadow-primary/10 scale-[0.98]"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0", ...iconStyle }}>
                  {item.icon}
                </span>
                <span className="font-semibold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
          {session.user.upiQr && (
            <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 glass-card">
              <p className="text-primary font-bold text-[10px] uppercase tracking-wider mb-3">Personal UPI &amp; QR</p>
              <div className="flex flex-col items-center gap-3">
                <div className="w-[120px] h-[120px] bg-white p-2 rounded-xl border border-primary/20 flex items-center justify-center">
                  <img alt="Personal UPI QR Code" className="w-full h-full object-contain rounded-lg" src={session.user.upiQr} />
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 w-full justify-between overflow-hidden">
                  <span className="text-[10px] text-on-surface-variant truncate select-all">{session.user.upiId}</span>
                  <button
                    onClick={() => {
                      if (session.user.upiId) {
                        navigator.clipboard.writeText(session.user.upiId);
                        alert("UPI ID copied to clipboard!");
                      }
                    }}
                    className="text-primary hover:text-primary-container transition-colors flex items-center justify-center"
                    title="Copy UPI VPA"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="glass-card rounded-2xl p-4">
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Upgrade for AI Tax Loss Harvesting</p>
            <button className="w-full bg-primary text-on-primary font-bold py-2 px-4 rounded-lg text-label-md hover:brightness-110 transition-all">
              Upgrade to Pro
            </button>
          </div>
          <div className="flex items-center justify-between px-2 gap-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <img
                className="w-10 h-10 rounded-full border border-primary/30 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDANrDSLSqhksq2wFTC8UUBGOja8l9SMFRs6AuQQqbBww3YAb9OdV9rrom0LXD1S8O6Gvdq1sR3XYuVaLwO57bs7JGyeF6Wr5EmB5Y8CFCKLtxt8-81C31q3yRJF3d3xl7Z-jh4KS2ZGKx6Bte6cffYNbev3hTX3bU_vYtkj0eYmX639ovs6itTHUX8wPId022TnPb5xhVBC68Ro7ruC9ERZeS5Bon2Tx5nmWHf-Ts3SCwO5cdzEfBeHKSoOAxEKRglzvdB0I7SDW-G"
                alt="Profile Avatar"
              />
              <div className="overflow-hidden">
                <p className="font-label-md text-label-md text-on-surface truncate font-semibold">{session.user.name}</p>
                <p className="text-[10px] text-on-surface-variant truncate">ID: #{session.user.id}</p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("finsphere.session");
                setSession(null);
              }}
              title="Logout"
              className="text-on-surface-variant hover:text-error transition-colors p-1.5 hover:bg-white/5 rounded-lg flex items-center justify-center"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Resizing Drag Handle Overlay over Scrollbar */}
      <div
        onMouseDown={startResizing}
        style={{ left: `${sidebarWidth - 5}px` }}
        className="hidden lg:block fixed top-0 bottom-0 w-2.5 cursor-col-resize hover:bg-[#42e5b0]/20 active:bg-[#42e5b0]/40 transition-colors z-[100]"
        title="Drag scrollbar to resize sidebar"
      />

      {/* Mobile Drawer Navigation Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#0e1511] border-r border-white/10 p-6 z-[80] overflow-y-auto flex flex-col sidebar-scrollbar"
            >
              <div className="flex justify-between items-center mb-8 px-2">
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold font-heading text-primary tracking-tight leading-tight">FinSphere AI</span>
                  <span className="text-xs text-on-surface-variant uppercase tracking-widest mt-1">Elite Tier</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-on-surface-variant hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              <nav className="flex-1 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = view === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setView(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all text-xs font-semibold ${
                        isActive
                          ? "bg-primary-container text-on-primary-container font-bold shadow-lg shadow-primary/10"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    className="w-9 h-9 rounded-full border border-primary/30 object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDANrDSLSqhksq2wFTC8UUBGOja8l9SMFRs6AuQQqbBww3YAb9OdV9rrom0LXD1S8O6Gvdq1sR3XYuVaLwO57bs7JGyeF6Wr5EmB5Y8CFCKLtxt8-81C31q3yRJF3d3xl7Z-jh4KS2ZGKx6Bte6cffYNbev3hTX3bU_vYtkj0eYmX639ovs6itTHUX8wPId022TnPb5xhVBC68Ro7ruC9ERZeS5Bon2Tx5nmWHf-Ts3SCwO5cdzEfBeHKSoOAxEKRglzvdB0I7SDW-G"
                    alt="Profile Avatar"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs text-on-surface truncate font-semibold">{session.user.name}</p>
                    <p className="text-[9px] text-on-surface-variant truncate">ID: #{session.user.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("finsphere.session");
                    setSession(null);
                  }}
                  title="Logout"
                  className="text-on-surface-variant hover:text-error transition-colors p-1.5 hover:bg-white/5 rounded-lg flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Container */}
      <section style={{ marginLeft: isDesktop ? `${sidebarWidth}px` : "0px" }} className="min-h-screen relative z-10 flex flex-col transition-none">
        
        {/* TopNavBar */}
        <header style={{ left: isDesktop ? `${sidebarWidth}px` : "0px" }} className="fixed top-0 right-0 z-50 flex justify-between items-center px-6 h-16 bg-surface/40 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/25 transition-none">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden hover:text-primary transition-colors flex items-center justify-center p-1.5 hover:bg-white/5 rounded-lg mr-2">
              <span className="material-symbols-outlined text-2xl text-on-surface-variant">menu</span>
            </button>
            <div className="relative w-full max-w-md hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const q = searchQuery.toLowerCase().trim();
                    if (!q) return;
                    if (q.includes("credit") || q.includes("score")) {
                      setView("credit");
                    } else if (q.includes("invest") || q.includes("stock") || q.includes("asset")) {
                      setView("investments");
                    } else if (q.includes("mutual")) {
                      setView("mutual-funds");
                    } else if (q.includes("sip")) {
                      setView("sip-setup");
                    } else if (q.includes("chat") || q.includes("advisor") || q.includes("ai")) {
                      setView("ai-advisor");
                    } else if (q.includes("bill") || q.includes("utility") || q.includes("pay")) {
                      setView("utilities");
                    } else if (q.includes("budget")) {
                      setView("budgets");
                    } else if (q.includes("expense") || q.includes("spend") || q.includes("transaction")) {
                      setView("expenses");
                    } else if (q.includes("goal") || q.includes("save")) {
                      setView("goals");
                    } else if (q.includes("report") || q.includes("chart")) {
                      setView("reports");
                    } else if (q.includes("insurance")) {
                      setView("insurance");
                    } else if (q.includes("khata") || q.includes("merchant")) {
                      setView("merchant-khata");
                    } else if (q.includes("reward") || q.includes("offer")) {
                      setView("rewards");
                    } else if (q.includes("demo")) {
                      setView("demo");
                    } else if (q.includes("setting") || q.includes("config") || q.includes("preference")) {
                      setView("settings");
                    } else {
                      alert(`Search results for "${searchQuery}": No direct feature match. Try searching 'credit', 'budget', 'advisor', 'utilities', 'mutual funds', or 'settings'.`);
                    }
                    setSearchQuery("");
                  }
                }}
                className="w-full bg-surface-container-low border border-outline-variant rounded-full py-1.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/50"
                placeholder="Search features (e.g. credit, advisor, bills)..."
                type="text"
              />
            </div>
            <span className="lg:hidden font-headline-md text-headline-md font-bold text-primary">FS AI</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 text-on-surface-variant">
              <button className="hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              </button>
              <button className="hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </button>
            </div>
            <div className="w-px h-6 bg-white/10 mx-2 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="font-label-sm text-label-sm text-on-surface font-semibold">Balance Verified</p>
                <p className="text-[10px] text-primary">Level 9 Trader</p>
              </div>
              <img
                className="w-8 h-8 rounded-full border border-primary/20 object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVI8nxjFxE2iDtGjxxFTmCV0pJnLVgfzB3BxKnh1Q1miH_JIFBqYxAT7G5AF2NyqbHGkOXHp8zNeNBjFpq9QXCTxB9WRQSYB6y-cNtwV721JDEMH3R-rESaIyR8WOQ0AO1WIUEz1NyDDwbmjrLbmjoHqs8hw90KQgt56U0uT-_dLdcP-9K-5tf9T9kYTEiqVNIfPhKSd7jk1FtAljQz2UTriL-UiOA7d4RcCWqDNDPzd1XBHAKIlcMU_XJ_xZLcPYcex7jNvdzgCVq"
                alt="Status Badge"
              />
              <button
                onClick={() => {
                  localStorage.removeItem("finsphere.session");
                  setSession(null);
                }}
                className="lg:hidden text-on-surface-variant hover:text-error transition-colors p-1"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile View Toggle Bar */}
        <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-3 mt-16 lg:hidden no-scrollbar bg-surface-container-low/80 backdrop-blur-md sticky top-16 z-40">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border border-white/10 ${
                view === item.id
                  ? "bg-primary text-background border-primary"
                  : "bg-white/5 text-on-surface-variant"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Canvas Body */}
        <section className="flex-1 pt-6 pb-20 lg:pt-20 px-4 md:px-8 max-w-7xl w-full mx-auto space-y-8 overflow-y-auto">


          {view === "dashboard" && (
            <DashboardView
              summary={summary}
              expenses={expenses}
              onAddExpense={() => setActiveModal("expense")}
              onInvestNow={() => setActiveModal("investment")}
              onGoalProgress={() => setView("goals")}
              onNavigate={setView}
              onNavigateToUtility={(tab) => {
                setUtilityTab(tab);
                setView("utilities");
              }}
            />
          )}

          {view === "expenses" && (
            <ExpensesView
              expenses={expenses}
              summary={summary}
              onOpenAddModal={() => setActiveModal("expense")}
            />
          )}

          {view === "budgets" && (
            <BudgetsView
              budgets={budgets}
              expenses={expenses}
              alerts={alerts}
              onOpenAddModal={() => setActiveModal("budget")}
              onApplyOptimization={async () => {
                // Mock applying optimal budget limits
                if (budgets.length > 0) {
                  const targetBudget = budgets[0];
                  if (!targetBudget) return;
                  await apiRequest(`/budgets`, {
                    method: "POST",
                    body: JSON.stringify({
                      category: targetBudget.category,
                      limitAmount: Math.max(1000, targetBudget.limitAmount - 2000),
                      month: targetBudget.month
                    })
                  }, session.token);
                  await refreshAll();
                }
              }}
            />
          )}

          {view === "goals" && (
            <GoalsView
              goals={goals}
              onOpenAddModal={() => setActiveModal("goal")}
            />
          )}

          {view === "investments" && (
            <InvestmentsView
              investments={investments}
              onOpenAddModal={() => setActiveModal("investment")}
            />
          )}

          {view === "credit" && (
            <CreditView token={session.token} />
          )}

          {view === "reports" && (
            <ReportsView
              report={report}
              summary={summary}
            />
          )}

          {view === "ai-advisor" && (
            <AIAdvisorView />
          )}

          {view === "utilities" && (
            <UtilitiesHubView initialTab={utilityTab} key={utilityTab} user={session?.user} />
          )}

          {view === "credit-card-center" && (
            <CreditCardBillCenter />
          )}

          {view === "mutual-funds" && (
            <MutualFundPortfolio />
          )}

          {view === "features" && (
            <FeaturesExplorer />
          )}

          {view === "pricing" && (
            <PricingView />
          )}

          {view === "merchant-khata" && (
            <MerchantKhataView />
          )}

          {view === "rewards" && (
            <RewardsOffersView />
          )}

          {view === "sip-setup" && (
            <SIPSetupView />
          )}

          {view === "insurance" && (
            <InsuranceHubView />
          )}

          {view === "demo" && (
            <DemoPlayerView />
          )}

          {view === "settings" && (
            <SettingsView
              session={session}
              onUpdateUser={(updatedUser) => {
                setSession((prev) => prev ? { ...prev, user: updatedUser } : null);
              }}
            />
          )}
        </section>

        {/* Mobile FAB */}
        <button
          onClick={() => setActiveModal("expense")}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-background rounded-full shadow-2xl flex items-center justify-center z-[70] hover:scale-110 active:scale-95 transition-all lg:hidden"
        >
          <span className="material-symbols-outlined text-2xl font-bold">add</span>
        </button>
      </section>

      {/* Modals Container */}
      <AnimatePresence>
        {activeModal === "expense" && (
          <ModalTemplate title="Add Expense" onClose={() => setActiveModal(null)}>
            <ModalForm onSubmit={handleCreateExpense} onClose={() => setActiveModal(null)}>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="₹1,250"
                  className="input-glass w-full px-4 py-3 rounded-xl text-white placeholder:text-outline/40"
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Category</label>
                <select name="category" className="input-glass w-full px-4 py-3 rounded-xl text-white bg-[#0e1511]">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="e.g. Zomato Dinner, Electricity Bill"
                  className="input-glass w-full px-4 py-3 rounded-xl text-white placeholder:text-outline/40"
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Date</label>
                <input
                  type="date"
                  name="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="input-glass w-full px-4 py-3 rounded-xl text-white"
                  required
                />
              </div>
            </ModalForm>
          </ModalTemplate>
        )}

        {activeModal === "budget" && (
          <ModalTemplate title="Set Budget" onClose={() => setActiveModal(null)}>
            <ModalForm onSubmit={handleCreateBudget} onClose={() => setActiveModal(null)}>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Category</label>
                <select name="category" className="input-glass w-full px-4 py-3 rounded-xl text-white bg-[#0e1511]">
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Limit Amount (₹)</label>
                <input
                  type="number"
                  name="limitAmount"
                  placeholder="₹15,000"
                  className="input-glass w-full px-4 py-3 rounded-xl text-white placeholder:text-outline/40"
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Month (YYYY-MM)</label>
                <input
                  type="text"
                  name="month"
                  placeholder="e.g. 2026-06"
                  defaultValue={new Date().toISOString().slice(0, 7)}
                  className="input-glass w-full px-4 py-3 rounded-xl text-white placeholder:text-outline/40"
                  required
                />
              </div>
            </ModalForm>
          </ModalTemplate>
        )}

        {activeModal === "goal" && (
          <ModalTemplate title="Create Savings Goal" onClose={() => setActiveModal(null)}>
            <ModalForm onSubmit={handleCreateGoal} onClose={() => setActiveModal(null)}>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Goal Name</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Tesla Roadster, Emergency Fund"
                  className="input-glass w-full px-4 py-3 rounded-xl text-white placeholder:text-outline/40"
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Target Amount (₹)</label>
                <input
                  type="number"
                  name="targetAmount"
                  placeholder="₹1,20,000"
                  className="input-glass w-full px-4 py-3 rounded-xl text-white placeholder:text-outline/40"
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Initial Savings (₹)</label>
                <input
                  type="number"
                  name="currentAmount"
                  placeholder="₹5,000"
                  defaultValue="0"
                  className="input-glass w-full px-4 py-3 rounded-xl text-white placeholder:text-outline/40"
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Target Date</label>
                <input
                  type="date"
                  name="targetDate"
                  className="input-glass w-full px-4 py-3 rounded-xl text-white"
                  required
                />
              </div>
            </ModalForm>
          </ModalTemplate>
        )}

        {activeModal === "investment" && (
          <ModalTemplate title="Add Investment" onClose={() => setActiveModal(null)}>
            <ModalForm onSubmit={handleCreateInvestment} onClose={() => setActiveModal(null)}>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Asset Type</label>
                <select name="assetType" className="input-glass w-full px-4 py-3 rounded-xl text-white bg-[#0e1511]">
                  {INVESTMENT_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Asset Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Apple (AAPL), HDFC Mutual Fund"
                  className="input-glass w-full px-4 py-3 rounded-xl text-white placeholder:text-outline/40"
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Invested Amount (₹)</label>
                <input
                  type="number"
                  name="investedAmount"
                  placeholder="₹10,000"
                  className="input-glass w-full px-4 py-3 rounded-xl text-white placeholder:text-outline/40"
                  required
                />
              </div>
              <div className="space-y-xs">
                <label className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs">Current Market Value (₹)</label>
                <input
                  type="number"
                  name="currentValue"
                  placeholder="₹12,450"
                  className="input-glass w-full px-4 py-3 rounded-xl text-white placeholder:text-outline/40"
                  required
                />
              </div>
            </ModalForm>
          </ModalTemplate>
        )}
      </AnimatePresence>
    </main>
  );
}

/* Modal Helper Components */
function ModalTemplate({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-panel w-full max-w-lg overflow-hidden rounded-3xl p-6 md:p-8 z-10 relative conic-border"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline-md text-headline-md text-white font-bold">{title}</h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white transition-colors flex items-center justify-center p-1 hover:bg-white/5 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        {children}
      </motion.div>
    </div>
  );
}

function ModalForm({ onSubmit, onClose, children }: { onSubmit: (data: Record<string, any>) => Promise<void>; onClose: () => void; children: React.ReactNode }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-xs text-danger">{error}</p>}
      {children}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3.5 rounded-xl bg-white/5 text-on-surface-variant hover:text-white transition-colors font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={busy}
          className="flex-1 btn-emerald-gradient py-3.5 rounded-xl text-on-primary font-bold flex items-center justify-center gap-2"
        >
          {busy ? "Saving..." : <>Save <span className="material-symbols-outlined text-[18px]">check</span></>}
        </button>
      </div>
    </form>
  );
}



/* Redesigned Dashboard View Component */
function DashboardView({
  summary,
  expenses,
  onAddExpense,
  onInvestNow,
  onGoalProgress,
  onNavigate,
  onNavigateToUtility
}: {
  summary: DashboardSummary | null;
  expenses: Expense[];
  onAddExpense: () => void;
  onInvestNow: () => void;
  onGoalProgress: () => void;
  onNavigate: (view: View) => void;
  onNavigateToUtility: (tab: "mobile" | "electricity" | "water" | "dth" | "gas" | "fastag" | "upi-qr") => void;
}) {
  const aggregatedNetWorth = (summary?.totalIncome ?? 0) - (summary?.totalExpenses ?? 0) + (summary?.portfolioValue ?? 0);
  
  // Custom Sparkline coordinate generation based on trendData
  const trendData = summary?.monthlyTrend || [
    { month: "Jan", income: 150000, expenses: 105000, savings: 45000 },
    { month: "Feb", income: 150000, expenses: 95000, savings: 55000 },
    { month: "Mar", income: 150000, expenses: 110000, savings: 40000 },
    { month: "Apr", income: 150000, expenses: 115000, savings: 35000 },
    { month: "May", income: 150000, expenses: 98000, savings: 52000 },
    { month: "Jun", income: 150000, expenses: 102000, savings: 48000 }
  ];

  const maxVal = Math.max(...trendData.map((d) => Math.max(d.expenses, d.savings, 1)));
  const pointsActual = trendData
    .map((d, i) => {
      const x = (i / (trendData.length - 1)) * 900 + 50;
      const y = 220 - (d.expenses / maxVal) * 150;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `50,250 ${pointsActual} 950,250 Z`;

  // Financial Health gauge stroke calculation
  const score = summary?.financialHealthScore ?? 88;
  const strokeOffset = 251.2 - (251.2 * score) / 100;

  return (
    <div className="grid grid-cols-12 gap-6">
      
      {/* Welcome Header */}
      <div className="col-span-12 mb-4">
        <h1 className="font-headline-lg text-4xl text-on-surface font-extrabold tracking-tight">Financial Overview</h1>
        <p className="text-on-surface-variant text-base mt-1">
          Welcome back, your portfolio has outperformed the market by <span className="text-primary font-bold">+1.4%</span> today.
        </p>
      </div>

      {/* KPI Row */}
      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all"></div>
          <p className="text-on-surface-variant font-label-md text-xs uppercase tracking-wider mb-2 font-medium">Aggregated Balance</p>
          <div className="flex items-baseline gap-2">
            <h2 className="font-headline-md text-2xl font-bold text-on-surface">{currency(aggregatedNetWorth)}</h2>
            <span className="text-primary font-bold text-xs">+2.4%</span>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[11px] text-on-surface-variant">
            <span className="material-symbols-outlined text-[14px]">info</span>
            Synced from 4 accounts
          </div>
        </div>
      </div>

      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <p className="text-on-surface-variant font-label-md text-xs uppercase tracking-wider mb-2 font-medium">Monthly Savings</p>
          <h2 className="font-headline-md text-2xl font-bold text-on-surface">{currency(summary?.savings ?? 45000)}</h2>
          <div className="mt-4 w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "85%" }}></div>
          </div>
          <p className="mt-2 text-[11px] text-on-surface-variant">85% of monthly goal reached</p>
        </div>
      </div>

      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <p className="text-on-surface-variant font-label-md text-xs uppercase tracking-wider mb-2 font-medium">Portfolio value</p>
          <h2 className="font-headline-md text-2xl font-bold text-on-surface">{currency(summary?.portfolioValue ?? 815000)}</h2>
          <div className="mt-4 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded text-[10px] font-bold">STOCKS</span>
            <span className="px-2 py-0.5 bg-secondary-container/40 text-secondary border border-white/10 rounded text-[10px] font-bold">CRYPTO</span>
          </div>
        </div>
      </div>

      <div className="col-span-12 md:col-span-6 xl:col-span-3">
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <p className="text-on-surface-variant font-label-md text-xs uppercase tracking-wider mb-2 font-medium">Credit Score</p>
          <div className="flex items-baseline gap-2">
            <h2 className="font-headline-md text-2xl font-bold text-on-surface">785</h2>
            <span className="text-primary font-bold text-xs">Excellent</span>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-error/40"></div>
            <div className="w-2 h-2 rounded-full bg-tertiary/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(66,229,176,0.5)]"></div>
            <span className="text-[10px] text-on-surface-variant ml-1 font-medium">Experian Synced</span>
          </div>
        </div>
      </div>

      {/* Utilities Quick Navigation Box */}
      <div className="col-span-12 mb-2">
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-headline-md text-lg text-on-surface mb-6 font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            Bills & Utilities Quick Portal
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div onClick={() => onNavigateToUtility("mobile")} className="flex flex-col items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl">smartphone</span>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface">Mobile Bills</span>
            </div>
            <div onClick={() => onNavigateToUtility("electricity")} className="flex flex-col items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl">bolt</span>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface">Electricity</span>
            </div>
            <div onClick={() => onNavigateToUtility("dth")} className="flex flex-col items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl">tv</span>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface">DTH</span>
            </div>
            <div onClick={() => onNavigateToUtility("water")} className="flex flex-col items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl">water_drop</span>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface">Water Dues</span>
            </div>
            <div onClick={() => onNavigateToUtility("gas")} className="flex flex-col items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl">local_gas_station</span>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface">Gas Booking</span>
            </div>
            <div onClick={() => onNavigateToUtility("fastag")} className="flex flex-col items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all group">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl">directions_car</span>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant group-hover:text-on-surface">FASTag Hub</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spending Trends SVG Chart */}
      <div className="col-span-12 xl:col-span-8">
        <div className="glass-card p-6 rounded-2xl h-[400px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-headline-md text-lg font-bold text-on-surface">Spending Trends</h3>
              <p className="text-on-surface-variant text-xs">Performance comparison vs last quarter</p>
            </div>
            <select className="bg-surface-container-low border border-white/10 rounded-lg text-xs text-on-surface focus:ring-primary focus:border-primary px-3 py-1.5 outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="flex-1 w-full relative">
            <svg className="w-full h-full" viewBox="0 0 1000 260" preserveAspectRatio="none">
              <path d={areaPoints ? `M ${areaPoints}` : ""} fill="url(#chartGradient)"></path>
              <path d={pointsActual ? `M ${pointsActual}` : ""} fill="none" stroke="#42e5b0" strokeLinecap="round" strokeWidth="3" className="chart-path"></path>
              {trendData.map((d, i) => {
                const x = (i / (trendData.length - 1)) * 900 + 50;
                const y = 220 - (d.expenses / maxVal) * 150;
                return (
                  <g key={i} className="group/dot">
                    <circle cx={x} cy={y} r="5" fill="#42e5b0" className="pulsing-glow cursor-pointer hover:r-7 transition-all"></circle>
                    <text x={x} y={y - 12} textAnchor="middle" fill="#dce4de" className="text-[10px] font-semibold opacity-0 group-hover/dot:opacity-100 transition-opacity bg-black/60 px-1 rounded">
                      {currency(d.expenses)}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
              <div className="border-b border-on-surface w-full"></div>
              <div className="border-b border-on-surface w-full"></div>
              <div className="border-b border-on-surface w-full"></div>
              <div className="border-b border-on-surface w-full"></div>
            </div>
          </div>
          <div className="flex justify-between mt-4 text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">
            {trendData.map((d, i) => (
              <span key={i}>{d.month}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Health Radial Gauge */}
      <div className="col-span-12 xl:col-span-4">
        <div className="glass-card p-6 rounded-2xl h-[400px] flex flex-col items-center justify-center text-center">
          <h3 className="font-headline-md text-lg font-bold text-on-surface mb-1">Financial Health</h3>
          <p className="text-on-surface-variant text-xs mb-8">AI-calculated stability index</p>
          
          <div className="relative w-44 h-44">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="none" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8"></circle>
              <circle
                className="transition-all duration-1000"
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="#42e5b0"
                strokeDasharray="251.2"
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="8"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-on-surface">{score}</span>
              <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest mt-1">Out of 100</span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 w-full">
            <div className="bg-surface-container-low p-3 rounded-xl border border-white/5">
              <p className="text-[10px] text-on-surface-variant uppercase mb-1 font-semibold">Stability</p>
              <p className="text-sm font-bold text-primary">High</p>
            </div>
            <div className="bg-surface-container-low p-3 rounded-xl border border-white/5">
              <p className="text-[10px] text-on-surface-variant uppercase mb-1 font-semibold">Risk level</p>
              <p className="text-sm font-bold text-tertiary">Minimal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions List & Table */}
      <div className="col-span-12 xl:col-span-8">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-lg font-bold text-on-surface">Recent Transactions</h3>
            <button onClick={() => onNavigate("expenses")} className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
              View All <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-white/5">
                <tr className="text-on-surface-variant font-label-md text-xs uppercase tracking-wider">
                  <th className="pb-4 font-semibold">Description</th>
                  <th className="pb-4 font-semibold">Category</th>
                  <th className="pb-4 font-semibold">Date</th>
                  <th className="pb-4 font-semibold text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(summary?.recentTransactions ?? expenses.slice(0, 5)).map((expense) => (
                  <tr key={expense.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">
                            {expense.category === "Food" ? "restaurant" : expense.category === "Travel" ? "flight" : expense.category === "Bills" ? "electric_bolt" : "shopping_bag"}
                          </span>
                        </div>
                        <span className="text-on-surface font-semibold">{expense.description}</span>
                      </div>
                    </td>
                    <td className="py-4 text-on-surface-variant text-sm">{expense.category}</td>
                    <td className="py-4 text-on-surface-variant text-sm">{expense.date}</td>
                    <td className="py-4 text-right text-on-surface font-bold">{currency(expense.amount)}</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-on-surface-variant text-sm">
                      No recent transactions found. Create one using Quick Actions!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Insights & Quick Actions Sidebar */}
      <div className="col-span-12 xl:col-span-4 space-y-6">
        
        {/* AI Insight Box */}
        <div className="glass-card p-6 rounded-2xl glow-pulse border-primary/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                smart_toy
              </span>
            </div>
            <div>
              <h3 className="font-headline-md text-base font-bold text-on-surface leading-tight">AI Insights</h3>
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Active Processing</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-xl border-l-4 border-tertiary">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-tertiary text-lg">event_upcoming</span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Upcoming Payment</p>
                  <p className="text-xs text-on-surface-variant mt-1">Your subscription for Netflix is due tomorrow.</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border-l-4 border-primary">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg">savings</span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">Savings Opportunity</p>
                  <p className="text-xs text-on-surface-variant mt-1">You could save ₹5,000 this month by reducing Food &amp; Dining expenses.</p>
                </div>
              </div>
            </div>
          </div>
          <button onClick={() => onNavigate("ai-advisor")} className="w-full mt-6 py-2.5 border border-white/10 rounded-xl text-sm font-bold text-on-surface hover:bg-white/5 transition-all">
            Talk to Advisor
          </button>
        </div>

        {/* Quick Actions Panel */}
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="font-headline-md text-base font-bold text-on-surface mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={onAddExpense} className="flex flex-col items-center justify-center p-4 bg-surface-container-low rounded-2xl hover:border-primary/50 border border-transparent transition-all group">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors mb-2">add_circle</span>
              <span className="text-xs font-bold text-on-surface text-center">Add Expense</span>
            </button>
            <button onClick={onInvestNow} className="flex flex-col items-center justify-center p-4 bg-surface-container-low rounded-2xl hover:border-primary/50 border border-transparent transition-all group">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors mb-2">account_balance</span>
              <span className="text-xs font-bold text-on-surface text-center">Invest Now</span>
            </button>
            <button onClick={onGoalProgress} className="flex flex-col items-center justify-center p-4 bg-surface-container-low rounded-2xl hover:border-primary/50 border border-transparent transition-all group">
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors mb-2">flag</span>
              <span className="text-xs font-bold text-on-surface text-center">Goal Progress</span>
            </button>
            <button onClick={() => onNavigateToUtility("upi-qr")} className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-2xl border border-primary/30 shadow-[0_0_15px_rgba(66,229,176,0.2)] hover:bg-primary/20 transition-all group">
              <span className="material-symbols-outlined text-primary text-xl mb-2">qr_code_scanner</span>
              <span className="text-xs font-bold text-primary text-center">Scan &amp; Pay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
