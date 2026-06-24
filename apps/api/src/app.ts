import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
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
} from "@finsphere/shared";
import { authMiddleware, signToken } from "./auth.js";
import { createSeedStore, makeId, type Store } from "./store.js";

export function createApp(store: Store = createSeedStore()) {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ ok: true, service: "finsphere-api" }));

  app.post("/api/auth/register", async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid registration data", issues: parsed.error.issues });
    if (store.users.some((user) => user.email.toLowerCase() === parsed.data.email.toLowerCase())) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const user = {
      id: makeId("user"),
      name: parsed.data.name,
      email: parsed.data.email,
      monthlyIncome: parsed.data.monthlyIncome,
      passwordHash: await bcrypt.hash(parsed.data.password, 10),
      createdAt: new Date().toISOString()
    };
    store.users.push(user);
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return res.status(201).json({ token: signToken(user.id), user: safeUser });
  });

  app.post("/api/auth/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid login data" });
    const user = store.users.find((item) => item.email.toLowerCase() === parsed.data.email.toLowerCase());
    if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return res.json({ token: signToken(user.id), user: safeUser });
  });

  const requireAuth = authMiddleware(store);

  app.get("/api/auth/me", requireAuth, (_req, res) => {
    const { passwordHash: _passwordHash, ...safeUser } = res.locals.user;
    res.json({ user: safeUser });
  });

  app.get("/api/dashboard/summary", requireAuth, (_req, res) => {
    const user = res.locals.user;
    const expenses = store.expenses.filter((item) => item.userId === user.id);
    const budgets = store.budgets.filter((item) => item.userId === user.id);
    const investments = store.investments.filter((item) => item.userId === user.id);
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
    .get(requireAuth, (req, res) => {
      const userId = res.locals.user.id;
      const search = String(req.query.search ?? "").toLowerCase();
      const category = String(req.query.category ?? "");
      const items = store.expenses
        .filter((item) => item.userId === userId)
        .filter((item) => !category || item.category === category)
        .filter((item) => !search || item.description.toLowerCase().includes(search));
      res.json({ expenses: items });
    })
    .post(requireAuth, (req, res) => {
      const parsed = expenseSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid expense", issues: parsed.error.issues });
      const expense = { id: makeId("exp"), userId: res.locals.user.id, ...parsed.data };
      store.expenses.push(expense);
      res.status(201).json({ expense });
    });

  app.route("/api/expenses/:id")
    .put(requireAuth, (req, res) => updateEntity(req, res, store.expenses, expenseSchema, "expense"))
    .delete(requireAuth, (req, res) => deleteEntity(req, res, store.expenses));

  app.route("/api/budgets")
    .get(requireAuth, (_req, res) => {
      const userId = res.locals.user.id;
      const budgets = store.budgets.filter((item) => item.userId === userId);
      const expenses = store.expenses.filter((item) => item.userId === userId);
      res.json({ budgets, budgetUsage: calculateBudgetUsage(expenses, budgets), alerts: getOverspendingAlerts(expenses, budgets) });
    })
    .post(requireAuth, (req, res) => {
      const parsed = budgetSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid budget", issues: parsed.error.issues });
      const budget = { id: makeId("bud"), userId: res.locals.user.id, ...parsed.data };
      store.budgets.push(budget);
      res.status(201).json({ budget });
    });

  app.route("/api/budgets/:id")
    .put(requireAuth, (req, res) => updateEntity(req, res, store.budgets, budgetSchema, "budget"))
    .delete(requireAuth, (req, res) => deleteEntity(req, res, store.budgets));

  app.route("/api/goals")
    .get(requireAuth, (_req, res) => res.json({ goals: store.goals.filter((item) => item.userId === res.locals.user.id) }))
    .post(requireAuth, (req, res) => {
      const parsed = goalSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid goal", issues: parsed.error.issues });
      const goal = { id: makeId("goal"), userId: res.locals.user.id, ...parsed.data };
      store.goals.push(goal);
      res.status(201).json({ goal });
    });

  app.route("/api/goals/:id")
    .put(requireAuth, (req, res) => updateEntity(req, res, store.goals, goalSchema, "goal"))
    .delete(requireAuth, (req, res) => deleteEntity(req, res, store.goals));

  app.route("/api/investments")
    .get(requireAuth, (_req, res) => res.json({ investments: store.investments.filter((item) => item.userId === res.locals.user.id) }))
    .post(requireAuth, (req, res) => {
      const parsed = investmentSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ message: "Invalid investment", issues: parsed.error.issues });
      const investment = { id: makeId("inv"), userId: res.locals.user.id, ...parsed.data };
      store.investments.push(investment);
      res.status(201).json({ investment });
    });

  app.route("/api/investments/:id")
    .put(requireAuth, (req, res) => updateEntity(req, res, store.investments, investmentSchema, "investment"))
    .delete(requireAuth, (req, res) => deleteEntity(req, res, store.investments));

  app.post("/api/credit-profile/simulate", requireAuth, (req, res) => {
    const parsed = creditProfileSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Invalid credit profile", issues: parsed.error.issues });
    const existing = store.creditProfiles.find((item) => item.userId === res.locals.user.id);
    const profile = { id: existing?.id ?? makeId("cred"), userId: res.locals.user.id, ...parsed.data };
    if (existing) Object.assign(existing, profile);
    else store.creditProfiles.push(profile);
    res.json({ profile, ...simulateCreditScore(parsed.data) });
  });

  app.get("/api/financial-health", requireAuth, (_req, res) => {
    const user = res.locals.user;
    const expenses = store.expenses.filter((item) => item.userId === user.id);
    const budgets = store.budgets.filter((item) => item.userId === user.id);
    const investments = store.investments.filter((item) => item.userId === user.id);
    res.json(calculateFinancialHealth({ income: user.monthlyIncome, expenses, budgets, investments }));
  });

  app.get("/api/reports/monthly", requireAuth, (_req, res) => {
    const user = res.locals.user;
    const expenses = store.expenses.filter((item) => item.userId === user.id);
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

function updateEntity<T extends { id: string; userId: string }>(
  req: express.Request,
  res: express.Response,
  rows: T[],
  schema: { safeParse: (data: unknown) => { success: true; data: Omit<T, "id" | "userId"> } | { success: false; error: { issues: unknown[] } } },
  key: string
) {
  const index = rows.findIndex((item) => item.id === req.params.id && item.userId === res.locals.user.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: `Invalid ${key}`, issues: parsed.error.issues });
  rows[index] = { ...rows[index], ...parsed.data } as T;
  return res.json({ [key]: rows[index] });
}

function deleteEntity<T extends { id: string; userId: string }>(req: express.Request, res: express.Response, rows: T[]) {
  const index = rows.findIndex((item) => item.id === req.params.id && item.userId === res.locals.user.id);
  if (index === -1) return res.status(404).json({ message: "Not found" });
  rows.splice(index, 1);
  return res.status(204).send();
}
