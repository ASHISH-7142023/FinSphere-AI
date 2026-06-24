"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  CreditCard,
  Flag,
  LayoutDashboard,
  LogOut,
  PiggyBank,
  Plus,
  ShieldCheck,
  Target,
  TrendingUp,
  Wallet
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { Budget, DashboardSummary, Expense, Goal, Investment } from "@finsphere/shared";
import { EXPENSE_CATEGORIES, INVESTMENT_TYPES } from "@finsphere/shared";
import { apiRequest, type Session } from "@/lib/api";
import { currency, pct } from "@/lib/utils";
import { Button, Card, GhostButton, Input, Select } from "@/components/ui";

type View = "dashboard" | "expenses" | "budgets" | "goals" | "investments" | "credit" | "reports";

const nav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "expenses", label: "Expenses", icon: Wallet },
  { id: "budgets", label: "Budgets", icon: PiggyBank },
  { id: "goals", label: "Goals", icon: Target },
  { id: "investments", label: "Investments", icon: TrendingUp },
  { id: "credit", label: "Credit", icon: CreditCard },
  { id: "reports", label: "Reports", icon: BarChart3 }
] satisfies Array<{ id: View; label: string; icon: typeof LayoutDashboard }>;

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    return <AuthScreen onSession={(next) => {
      localStorage.setItem("finsphere.session", JSON.stringify(next));
      setSession(next);
    }} />;
  }

  return (
    <main className="min-h-screen">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 bg-surface/55 p-6 backdrop-blur-xl lg:block">
        <div className="mb-10">
          <div className="font-heading text-2xl font-bold text-primary">FinSphere AI</div>
          <div className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-on-surface-variant">
            <span className="h-2 w-2 rounded-full bg-primary" /> MVP Demo
          </div>
        </div>
        <nav className="space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${view === item.id ? "bg-primary text-[#003828]" : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"}`}
              >
                <Icon size={18} /> {item.label}
              </button>
            );
          })}
        </nav>
        <Card className="mt-8">
          <div className="text-xs uppercase tracking-[0.2em] text-on-surface-variant">Health Grade</div>
          <div className="mt-2 text-3xl font-bold text-primary">{summary?.financialHealthGrade ?? "..."}</div>
          <div className="mt-1 text-sm text-on-surface-variant">Score {summary?.financialHealthScore ?? 0}/100</div>
        </Card>
      </aside>

      <section className="lg:ml-72">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-surface/55 px-4 py-4 backdrop-blur-xl md:px-8">
          <div>
            <div className="font-heading text-xl font-bold md:text-2xl">{nav.find((item) => item.id === view)?.label}</div>
            <div className="text-sm text-on-surface-variant">Welcome back, {session.user.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <GhostButton onClick={() => void refreshAll()} disabled={loading}><Activity size={16} /> Refresh</GhostButton>
            <GhostButton onClick={() => {
              localStorage.removeItem("finsphere.session");
              setSession(null);
            }}><LogOut size={16} /></GhostButton>
          </div>
        </header>
        <div className="flex gap-2 overflow-x-auto border-b border-white/10 px-4 py-3 lg:hidden">
          {nav.map((item) => <GhostButton key={item.id} onClick={() => setView(item.id)} className={view === item.id ? "border-primary text-primary" : ""}>{item.label}</GhostButton>)}
        </div>
        {error ? <div className="mx-4 mt-4 rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger md:mx-8">{error}</div> : null}
        <div className="p-4 md:p-8">
          {view === "dashboard" && <Dashboard summary={summary} expenses={expenses} />}
          {view === "expenses" && <Expenses token={session.token} expenses={expenses} refresh={refreshAll} />}
          {view === "budgets" && <Budgets token={session.token} budgets={budgets} alerts={alerts} refresh={refreshAll} />}
          {view === "goals" && <Goals token={session.token} goals={goals} refresh={refreshAll} />}
          {view === "investments" && <Investments token={session.token} investments={investments} refresh={refreshAll} />}
          {view === "credit" && <Credit token={session.token} />}
          {view === "reports" && <Reports report={report} summary={summary} />}
        </div>
      </section>
    </main>
  );
}

function AuthScreen({ onSession }: { onSession: (session: Session) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(formData: FormData) {
    setBusy(true);
    try {
      const payload = Object.fromEntries(formData.entries());
      const session = await apiRequest<Session>(mode === "login" ? "/auth/login" : "/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      onSession(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.4fr_1fr]">
      <section className="relative hidden overflow-hidden p-12 lg:block">
        <div className="absolute inset-0 bg-[url('/hero-finsphere.png')] bg-cover bg-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-background" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 flex h-full max-w-2xl flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary">
            <ShieldCheck size={16} /> Secure personal finance command center
          </div>
          <h1 className="font-heading text-6xl font-bold leading-tight">Experience the <span className="text-primary">future</span> of finance.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-on-surface-variant">Track spending, budgets, savings goals, investments, credit strength, and financial health from one premium AI-ready workspace.</p>
        </motion.div>
      </section>
      <section className="flex items-center justify-center p-5">
        <Card className="w-full max-w-md">
          <div className="mb-8">
            <div className="font-heading text-3xl font-bold text-primary">FinSphere AI</div>
            <p className="mt-2 text-on-surface-variant">{mode === "login" ? "Login to the seeded MVP account." : "Create a local demo account."}</p>
          </div>
          <form action={submit} className="space-y-4">
            {mode === "register" ? <Input name="name" placeholder="Full name" defaultValue="Ashish Demo" required /> : null}
            <Input name="email" type="email" placeholder="Email" defaultValue={mode === "login" ? "demo@finsphere.ai" : ""} required />
            <Input name="password" type="password" placeholder="Password" defaultValue={mode === "login" ? "Demo@12345" : ""} required />
            {mode === "register" ? <Input name="monthlyIncome" type="number" placeholder="Monthly income" defaultValue="150000" required /> : null}
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button disabled={busy} className="w-full">{busy ? "Please wait..." : mode === "login" ? "Login" : "Register"}</Button>
          </form>
          <button className="mt-5 text-sm text-primary" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? "Create a new account" : "Use existing demo login"}
          </button>
        </Card>
      </section>
    </main>
  );
}

function Dashboard({ summary, expenses }: { summary: DashboardSummary | null; expenses: Expense[] }) {
  const kpis: Array<[string, number, LucideIcon]> = [
    ["Total Income", summary?.totalIncome ?? 0, Wallet],
    ["Total Expenses", summary?.totalExpenses ?? 0, CreditCard],
    ["Savings", summary?.savings ?? 0, PiggyBank],
    ["Portfolio", summary?.portfolioValue ?? 0, TrendingUp]
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([label, value, Icon]) => (
          <Card key={String(label)}>
            <div className="flex items-center justify-between">
              <div className="text-sm text-on-surface-variant">{label as string}</div>
              <Icon className="text-primary" size={20} />
            </div>
            <div className="mt-4 font-heading text-3xl font-bold">{currency(value as number)}</div>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <h2 className="mb-4 font-heading text-xl font-bold">Monthly Trend</h2>
          <div className="h-80">
            <ResponsiveContainer>
              <AreaChart data={summary?.monthlyTrend ?? []}>
                <XAxis dataKey="month" stroke="#bbcac1" />
                <YAxis stroke="#bbcac1" />
                <Tooltip />
                <Area type="monotone" dataKey="savings" stroke="#42e5b0" fill="#42e5b055" />
                <Area type="monotone" dataKey="expenses" stroke="#ffbca2" fill="#ffbca233" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-heading text-xl font-bold">Recent Transactions</h2>
          <div className="space-y-3">
            {(summary?.recentTransactions ?? expenses.slice(0, 5)).map((expense) => <Row key={expense.id} label={expense.description} meta={expense.category} value={currency(expense.amount)} />)}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Expenses({ token, expenses, refresh }: { token: string; expenses: Expense[]; refresh: () => Promise<void> }) {
  const [search, setSearch] = useState("");
  const filtered = expenses.filter((expense) => expense.description.toLowerCase().includes(search.toLowerCase()));
  return (
    <CrudShell title="Add Expense" onSubmit={async (data) => {
      await apiRequest("/expenses", { method: "POST", body: JSON.stringify(data) }, token);
      await refresh();
    }} fields={<>
      <Input name="amount" type="number" placeholder="Amount" required />
      <Select name="category">{EXPENSE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</Select>
      <Input name="description" placeholder="Description" required />
      <Input name="date" type="date" defaultValue="2026-06-24" required />
    </>}>
      <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search expenses" className="mb-4" />
      <DataList rows={filtered.map((expense) => ({ id: expense.id, label: expense.description, meta: expense.category, value: currency(expense.amount) }))} />
    </CrudShell>
  );
}

function Budgets({ token, budgets, alerts, refresh }: { token: string; budgets: Budget[]; alerts: Array<{ category: string; overBy: number }>; refresh: () => Promise<void> }) {
  return (
    <CrudShell title="Set Budget" onSubmit={async (data) => {
      await apiRequest("/budgets", { method: "POST", body: JSON.stringify(data) }, token);
      await refresh();
    }} fields={<>
      <Select name="category">{EXPENSE_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</Select>
      <Input name="limitAmount" type="number" placeholder="Limit amount" required />
      <Input name="month" defaultValue="2026-06" required />
    </>}>
      {alerts.length ? <div className="mb-4 rounded-xl border border-danger/40 bg-danger/10 p-3 text-sm text-danger">{alerts.map((item) => `${item.category} over by ${currency(item.overBy)}`).join(" | ")}</div> : null}
      <DataList rows={budgets.map((budget) => ({ id: budget.id, label: budget.category, meta: budget.month, value: currency(budget.limitAmount) }))} />
    </CrudShell>
  );
}

function Goals({ token, goals, refresh }: { token: string; goals: Goal[]; refresh: () => Promise<void> }) {
  return (
    <CrudShell title="Create Goal" onSubmit={async (data) => {
      await apiRequest("/goals", { method: "POST", body: JSON.stringify(data) }, token);
      await refresh();
    }} fields={<>
      <Input name="title" placeholder="Goal title" required />
      <Input name="targetAmount" type="number" placeholder="Target amount" required />
      <Input name="currentAmount" type="number" placeholder="Current amount" required />
      <Input name="targetDate" type="date" required />
    </>}>
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => <Card key={goal.id}>
          <div className="flex items-center justify-between"><h3 className="font-heading text-lg font-bold">{goal.title}</h3><Flag size={18} className="text-primary" /></div>
          <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-primary" style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }} /></div>
          <div className="mt-3 text-sm text-on-surface-variant">{currency(goal.currentAmount)} of {currency(goal.targetAmount)} | {pct((goal.currentAmount / goal.targetAmount) * 100)}</div>
        </Card>)}
      </div>
    </CrudShell>
  );
}

function Investments({ token, investments, refresh }: { token: string; investments: Investment[]; refresh: () => Promise<void> }) {
  return (
    <CrudShell title="Add Investment" onSubmit={async (data) => {
      await apiRequest("/investments", { method: "POST", body: JSON.stringify(data) }, token);
      await refresh();
    }} fields={<>
      <Select name="assetType">{INVESTMENT_TYPES.map((item) => <option key={item}>{item}</option>)}</Select>
      <Input name="name" placeholder="Asset name" required />
      <Input name="investedAmount" type="number" placeholder="Invested amount" required />
      <Input name="currentValue" type="number" placeholder="Current value" required />
    </>}>
      <div className="grid gap-6 xl:grid-cols-2">
        <DataList rows={investments.map((item) => ({ id: item.id, label: item.name, meta: item.assetType, value: currency(item.currentValue - item.investedAmount) }))} />
        <Card>
          <h3 className="mb-3 font-heading text-lg font-bold">Allocation</h3>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart><Pie data={investments} dataKey="currentValue" nameKey="name">{investments.map((_, index) => <Cell key={index} fill={["#42e5b0", "#bec6e0", "#ffbca2", "#00c896"][index % 4]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </CrudShell>
  );
}

function Credit({ token }: { token: string }) {
  const [result, setResult] = useState<{ estimatedScore: number; recommendations: string[] } | null>(null);
  return (
    <CrudShell title="Simulate Credit Score" onSubmit={async (data) => {
      const response = await apiRequest<{ estimatedScore: number; recommendations: string[] }>("/credit-profile/simulate", { method: "POST", body: JSON.stringify(data) }, token);
      setResult(response);
    }} fields={<>
      <Input name="utilization" type="number" placeholder="Credit utilization %" defaultValue="24" required />
      <Input name="paymentHistory" type="number" placeholder="Payment history %" defaultValue="98" required />
      <Input name="creditAge" type="number" placeholder="Credit age in years" defaultValue="6" required />
    </>}>
      <Card>
        <div className="text-sm uppercase tracking-[0.2em] text-on-surface-variant">Estimated Score</div>
        <div className="mt-2 font-heading text-6xl font-bold text-primary">{result?.estimatedScore ?? 782}</div>
        <ul className="mt-5 space-y-2 text-on-surface-variant">{(result?.recommendations ?? ["Run the simulator to refresh recommendations."]).map((item) => <li key={item}>{item}</li>)}</ul>
      </Card>
    </CrudShell>
  );
}

function Reports({ report, summary }: { report: { totalIncome: number; totalExpenses: number; categoryAnalysis: Array<{ category: string; amount: number; count: number }> } | null; summary: DashboardSummary | null }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
      <Card>
        <h2 className="font-heading text-xl font-bold">Monthly Summary</h2>
        <div className="mt-5 space-y-3">
          <Row label="Income" meta="June 2026" value={currency(report?.totalIncome ?? 0)} />
          <Row label="Expenses" meta="All categories" value={currency(report?.totalExpenses ?? 0)} />
          <Row label="Savings" meta="Net retained" value={currency((report?.totalIncome ?? 0) - (report?.totalExpenses ?? 0))} />
          <Row label="Health" meta={summary?.financialHealthGrade ?? "Pending"} value={`${summary?.financialHealthScore ?? 0}/100`} />
        </div>
      </Card>
      <Card>
        <h2 className="mb-4 font-heading text-xl font-bold">Category Analysis</h2>
        <div className="h-80">
          <ResponsiveContainer>
            <BarChart data={report?.categoryAnalysis ?? []}>
              <XAxis dataKey="category" stroke="#bbcac1" />
              <YAxis stroke="#bbcac1" />
              <Tooltip />
              <Bar dataKey="amount" fill="#42e5b0" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function CrudShell({ title, fields, children, onSubmit }: { title: string; fields: React.ReactNode; children: React.ReactNode; onSubmit: (data: Record<string, FormDataEntryValue>) => Promise<void> }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <Card>
        <h2 className="mb-4 font-heading text-xl font-bold">{title}</h2>
        <form action={async (formData) => {
          await onSubmit(Object.fromEntries(formData.entries()));
        }} className="space-y-3">
          {fields}
          <Button className="w-full"><Plus size={16} /> Save</Button>
        </form>
      </Card>
      <div>{children}</div>
    </div>
  );
}

function DataList({ rows }: { rows: Array<{ id: string; label: string; meta: string; value: string }> }) {
  return <Card><div className="space-y-3">{rows.map((row) => <Row key={row.id} label={row.label} meta={row.meta} value={row.value} />)}</div></Card>;
}

function Row({ label, meta, value }: { label: string; meta: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-3">
      <div className="min-w-0">
        <div className="truncate font-semibold">{label}</div>
        <div className="text-sm text-on-surface-variant">{meta}</div>
      </div>
      <div className="font-label font-bold text-primary">{value}</div>
    </div>
  );
}
