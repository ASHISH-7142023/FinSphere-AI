import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import {
  budgetSchema,
  calculateBudgetUsage,
  calculateFinancialHealth,
  creditProfileSchema,
  expenseSchema,
  getOverspendingAlerts,
  goalSchema,
  investmentSchema,
  loginSchema,
  registerSchema,
  simulateCreditScore
} from "./shared/index.js";
import { authMiddleware, signToken } from "./auth.js";
import { makeId } from "./store-inmemory.js";
import type { IStore } from "./store.interface.js";

function generateUpiDetails(user: { id: string; name: string; email: string }) {
  const localPart = user.email.split("@")[0]!.toLowerCase().replace(/[^a-z0-9]/g, "");
  const suffix = user.id.replace("user_", "").slice(-4);
  const upiId = `${localPart}_${suffix}@finsphere`;
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(user.name)}&cu=INR`;
  const upiQr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
  return { upiId, upiQr };
}

export function createApp(store: IStore) {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true, service: "finsphere-api" }));

  app.post("/api/auth/register", async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid registration data", issues: parsed.error.issues });
    
    const existingUser = await store.getUserByEmail(parsed.data.email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
    const user = await store.createUser({
      id: makeId("user"),
      name: parsed.data.name,
      email: parsed.data.email,
      monthlyIncome: parsed.data.monthlyIncome,
      passwordHash: hashedPassword
    });

    const { passwordHash: _passwordHash, ...baseUser } = user;
    const safeUser = { ...baseUser, ...generateUpiDetails(user) };

    // Log welcome email notification
    try {
      const timestamp = new Date().toISOString();
      const emailTemplate = `
================================================================================
FROM: welcome@finsphere.ai
TO: ${user.email}
SUBJECT: Welcome to FinSphere AI!
DATE: ${timestamp}
--------------------------------------------------------------------------------
Dear ${user.name},

Welcome to FinSphere AI, the cinematic personal finance super-app! 

Your account has been successfully registered. You are currently on the Free Tier 
by default. You can track your wealth flow, analyze your expenses, and rebalance 
your mutual fund SIP investments.

Thank you for choosing FinSphere AI to guide your financial journey.

Warm regards,
FinSphere AI Welcome & Onboarding Team
================================================================================
\n`;
      const logPath = path.resolve(process.cwd(), "../sent_emails.log");
      fs.appendFileSync(logPath, emailTemplate, "utf8");
    } catch (err) {
      console.error("Failed to write mock email log:", err);
    }

    return res.status(201).json({ token: signToken(user.id), user: safeUser });
  });

  app.post("/api/auth/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid login data" });
    
    const user = await store.getUserByEmail(parsed.data.email);
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    const { passwordHash: _passwordHash, ...baseUser } = user;
    const safeUser = { ...baseUser, ...generateUpiDetails(user) };

    // Log login email notification
    try {
      const timestamp = new Date().toISOString();
      const ipAddress = req.ip ?? req.socket.remoteAddress ?? "127.0.0.1";
      const userAgent = req.headers["user-agent"] ?? "Unknown Device";
      
      const emailTemplate = `
================================================================================
FROM: security@finsphere.ai
TO: ${user.email}
SUBJECT: FinSphere AI - Account Logged In
DATE: ${timestamp}
--------------------------------------------------------------------------------
Dear FinSphere AI User,

A new login to your FinSphere AI account was detected.

Access Details:
- Date/Time: ${timestamp}
- IP Address: ${ipAddress}
- Device Details (User Agent): ${userAgent}

If this activity was you, no action is required. If this login was unauthorized, 
please change your password immediately.

Warm regards,
FinSphere AI Security & Systems Team
================================================================================
\n`;
      const logPath = path.resolve(process.cwd(), "../sent_emails.log");
      fs.appendFileSync(logPath, emailTemplate, "utf8");
    } catch (err) {
      console.error("Failed to write mock email log:", err);
    }

    return res.json({ token: signToken(user.id), user: safeUser });
  });

  const activeOtps = new Map<string, { otp: string; expiresAt: number }>();
  const resetTokens = new Map<string, { email: string; expiresAt: number }>();

  app.post("/api/auth/forgot-password", async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await store.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    activeOtps.set(email.toLowerCase(), { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    try {
      const timestamp = new Date().toISOString();
      const emailTemplate = `
================================================================================
FROM: security@finsphere.ai
TO: ${email}
SUBJECT: FinSphere AI - Password Reset Verification Code
DATE: ${timestamp}
--------------------------------------------------------------------------------
Dear FinSphere AI User,

We received a request to reset your password. Please use the following 
6-digit One-Time Password (OTP) code to complete your verification:

                          ======================
                              [   ${otp}   ]
                          ======================

This code is active for 5 minutes. If you did not request this, please 
ignore this email.

Warm regards,
FinSphere AI Security & Systems Team
================================================================================
\n`;
      const logPath = path.resolve(process.cwd(), "../sent_emails.log");
      fs.appendFileSync(logPath, emailTemplate, "utf8");
    } catch (err) {
      console.error("Failed to write mock email log:", err);
    }

    return res.json({ message: "OTP sent successfully" });
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const entry = activeOtps.get(email.toLowerCase());
    if (!entry || entry.expiresAt < Date.now() || entry.otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    activeOtps.delete(email.toLowerCase());
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    resetTokens.set(email.toLowerCase(), { email, expiresAt: Date.now() + 10 * 60 * 1000 });

    return res.json({ token: resetToken });
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and new password are required" });

    const entry = resetTokens.get(email.toLowerCase());
    if (!entry || entry.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Password reset session has expired. Please request another OTP." });
    }

    resetTokens.delete(email.toLowerCase());
    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await store.updateUserPassword(email, hashedPassword);
    if (!updated) return res.status(404).json({ message: "User not found" });

    // Log password reset success email
    try {
      const timestamp = new Date().toISOString();
      const emailTemplate = `
================================================================================
FROM: security@finsphere.ai
TO: ${email}
SUBJECT: FinSphere AI - Password Reset Successful
DATE: ${timestamp}
--------------------------------------------------------------------------------
Dear FinSphere AI User,

Your password has been successfully reset. 

Date/Time of change: ${timestamp}

You can now log in using your new credentials. If you did not authorize this, 
please contact security@finsphere.ai immediately.

Warm regards,
FinSphere AI Security & Systems Team
================================================================================
\n`;
      const logPath = path.resolve(process.cwd(), "../sent_emails.log");
      fs.appendFileSync(logPath, emailTemplate, "utf8");
    } catch (err) {
      console.error("Failed to write mock email log:", err);
    }

    return res.json({ message: "Password reset successfully" });
  });

  const requireAuth = authMiddleware(store);

  app.get("/api/auth/me", requireAuth, (_req, res) => {
    const { passwordHash: _passwordHash, ...baseUser } = res.locals.user;
    const safeUser = { ...baseUser, ...generateUpiDetails(res.locals.user) };
    res.json({ user: safeUser });
  });

  app.get("/api/dashboard/summary", requireAuth, async (_req, res) => {
    const user = res.locals.user;
    const [expenses, budgets, investments] = await Promise.all([
      store.getExpenses(user.id),
      store.getBudgets(user.id),
      store.getInvestments(user.id)
    ]);

    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const health = calculateFinancialHealth({ income: user.monthlyIncome, expenses, budgets, investments });
    
    const categoryBreakdown = budgets.map((budget) => ({
      category: budget.category,
      amount: expenses.filter((expense) => expense.category === budget.category).reduce((sum, expense) => sum + expense.amount, 0)
    }));

    const portfolioValue = investments.reduce((sum, item) => sum + item.currentValue, 0);
    const invested = investments.reduce((sum, item) => sum + item.investedAmount, 0);

    res.json({
      totalIncome: user.monthlyIncome,
      totalExpenses,
      savings: user.monthlyIncome - totalExpenses,
      budgetUsage: health.budgetUsage,
      financialHealthScore: health.score,
      financialHealthGrade: health.grade,
      portfolioValue,
      portfolioProfitLoss: portfolioValue - invested,
      recentTransactions: expenses.slice(-5).reverse(),
      categoryBreakdown,
      monthlyTrend: [
        { month: "Apr", income: user.monthlyIncome, expenses: 47200, savings: user.monthlyIncome - 47200 },
        { month: "May", income: user.monthlyIncome, expenses: 39800, savings: user.monthlyIncome - 39800 },
        { month: "Jun", income: user.monthlyIncome, expenses: totalExpenses, savings: user.monthlyIncome - totalExpenses }
      ]
    });
  });

  app.route("/api/expenses")
    .get(requireAuth, async (req, res) => {
      const userId = res.locals.user.id;
      const search = String(req.query.search ?? "");
      const category = String(req.query.category ?? "");
      
      const items = await store.getExpenses(userId, { search, category });
      res.json({ expenses: items });
    })
    .post(requireAuth, async (req, res) => {
      const parsed = expenseSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid expense", issues: parsed.error.issues });
      
      const expense = await store.createExpense({ userId: res.locals.user.id, ...parsed.data });

      // Log payment confirmation email
      try {
        const timestamp = new Date().toISOString();
        const user = res.locals.user;
        const emailTemplate = `
================================================================================
FROM: transactions@finsphere.ai
TO: ${user.email}
SUBJECT: FinSphere AI - Transaction Alert: ${parsed.data.description}
DATE: ${timestamp}
--------------------------------------------------------------------------------
Dear FinSphere AI User,

A new payment of Rs. ${parsed.data.amount} has been successfully charged 
to your account.

Transaction Details:
- Description: ${parsed.data.description}
- Category: ${parsed.data.category}
- Date: ${parsed.data.date}
- Status: SUCCESSFUL

Thank you for choosing FinSphere AI to track and manage your finances.

Warm regards,
FinSphere AI Transactions Team
================================================================================
\n`;
        const logPath = path.resolve(process.cwd(), "../sent_emails.log");
        fs.appendFileSync(logPath, emailTemplate, "utf8");
      } catch (err) {
        console.error("Failed to write mock email log:", err);
      }

      res.status(201).json({ expense });
    });

  app.route("/api/expenses/:id")
    .put(requireAuth, async (req, res) => {
      const parsed = expenseSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid expense", issues: parsed.error.issues });
      
      const expense = await store.updateExpense(req.params.id, res.locals.user.id, parsed.data);
      if (!expense) return res.status(404).json({ message: "Not found" });
      res.json({ expense });
    })
    .delete(requireAuth, async (req, res) => {
      const success = await store.deleteExpense(req.params.id, res.locals.user.id);
      if (!success) return res.status(404).json({ message: "Not found" });
      res.status(204).send();
    });

  app.route("/api/budgets")
    .get(requireAuth, async (_req, res) => {
      const userId = res.locals.user.id;
      const [budgets, expenses] = await Promise.all([
        store.getBudgets(userId),
        store.getExpenses(userId)
      ]);
      res.json({
        budgets,
        budgetUsage: calculateBudgetUsage(expenses, budgets),
        alerts: getOverspendingAlerts(expenses, budgets)
      });
    })
    .post(requireAuth, async (req, res) => {
      const parsed = budgetSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid budget", issues: parsed.error.issues });
      
      const budget = await store.createBudget({ userId: res.locals.user.id, ...parsed.data });
      res.status(201).json({ budget });
    });

  app.route("/api/budgets/:id")
    .put(requireAuth, async (req, res) => {
      const parsed = budgetSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid budget", issues: parsed.error.issues });
      
      const budget = await store.updateBudget(req.params.id, res.locals.user.id, parsed.data);
      if (!budget) return res.status(404).json({ message: "Not found" });
      res.json({ budget });
    })
    .delete(requireAuth, async (req, res) => {
      const success = await store.deleteBudget(req.params.id, res.locals.user.id);
      if (!success) return res.status(404).json({ message: "Not found" });
      res.status(204).send();
    });

  app.route("/api/goals")
    .get(requireAuth, async (_req, res) => {
      const goals = await store.getGoals(res.locals.user.id);
      res.json({ goals });
    })
    .post(requireAuth, async (req, res) => {
      const parsed = goalSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid goal", issues: parsed.error.issues });
      
      const goal = await store.createGoal({ userId: res.locals.user.id, ...parsed.data });
      res.status(201).json({ goal });
    });

  app.route("/api/goals/:id")
    .put(requireAuth, async (req, res) => {
      const parsed = goalSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid goal", issues: parsed.error.issues });
      
      const goal = await store.updateGoal(req.params.id, res.locals.user.id, parsed.data);
      if (!goal) return res.status(404).json({ message: "Not found" });
      res.json({ goal });
    })
    .delete(requireAuth, async (req, res) => {
      const success = await store.deleteGoal(req.params.id, res.locals.user.id);
      if (!success) return res.status(404).json({ message: "Not found" });
      res.status(204).send();
    });

  app.route("/api/investments")
    .get(requireAuth, async (_req, res) => {
      const investments = await store.getInvestments(res.locals.user.id);
      res.json({ investments });
    })
    .post(requireAuth, async (req, res) => {
      const parsed = investmentSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid investment", issues: parsed.error.issues });
      
      const investment = await store.createInvestment({ userId: res.locals.user.id, ...parsed.data });
      res.status(201).json({ investment });
    });

  app.route("/api/investments/:id")
    .put(requireAuth, async (req, res) => {
      const parsed = investmentSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid investment", issues: parsed.error.issues });
      
      const investment = await store.updateInvestment(req.params.id, res.locals.user.id, parsed.data);
      if (!investment) return res.status(404).json({ message: "Not found" });
      res.json({ investment });
    })
    .delete(requireAuth, async (req, res) => {
      const success = await store.deleteInvestment(req.params.id, res.locals.user.id);
      if (!success) return res.status(404).json({ message: "Not found" });
      res.status(204).send();
    });

  app.post("/api/credit-profile/simulate", requireAuth, async (req, res) => {
    const parsed = creditProfileSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid credit profile", issues: parsed.error.issues });
    
    const profile = await store.upsertCreditProfile(res.locals.user.id, parsed.data);
    res.json({ profile, ...simulateCreditScore(parsed.data) });
  });

  app.get("/api/financial-health", requireAuth, async (_req, res) => {
    const user = res.locals.user;
    const [expenses, budgets, investments] = await Promise.all([
      store.getExpenses(user.id),
      store.getBudgets(user.id),
      store.getInvestments(user.id)
    ]);
    res.json(calculateFinancialHealth({ income: user.monthlyIncome, expenses, budgets, investments }));
  });

  app.get("/api/reports/monthly", requireAuth, async (_req, res) => {
    const user = res.locals.user;
    const expenses = await store.getExpenses(user.id);
    
    const byCategory = expenses.reduce<Record<string, typeof expenses>>((groups, expense) => {
      const rows = groups[expense.category] ?? [];
      rows.push(expense);
      groups[expense.category] = rows;
      return groups;
    }, {});

    res.json({
      month: "2026-06",
      totalIncome: user.monthlyIncome,
      totalExpenses: expenses.reduce((sum, item) => sum + item.amount, 0),
      categoryAnalysis: Object.entries(byCategory).map(([category, rows]) => ({
        category,
        amount: rows?.reduce((sum, item) => sum + item.amount, 0) ?? 0,
        count: rows?.length ?? 0
      })),
      expenses
    });
  });

  return app;
}
