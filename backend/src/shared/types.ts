export const EXPENSE_CATEGORIES = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Entertainment",
  "Education",
  "Health",
  "Other"
] as const;

export const INVESTMENT_TYPES = ["Stock", "Mutual Fund", "SIP", "Gold", "Crypto", "Other"] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type InvestmentType = (typeof INVESTMENT_TYPES)[number];

export type Grade = "Poor" | "Average" | "Good" | "Excellent";

export interface User {
  id: string;
  name: string;
  email: string;
  monthlyIncome: number;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  userId: string;
  category: ExpenseCategory;
  limitAmount: number;
  month: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface Investment {
  id: string;
  userId: string;
  assetType: InvestmentType;
  name: string;
  investedAmount: number;
  currentValue: number;
}

export interface CreditProfile {
  id: string;
  userId: string;
  utilization: number;
  paymentHistory: number;
  creditAge: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  budgetUsage: number;
  financialHealthScore: number;
  financialHealthGrade: Grade;
  portfolioValue: number;
  portfolioProfitLoss: number;
  recentTransactions: Expense[];
  categoryBreakdown: Array<{ category: ExpenseCategory; amount: number }>;
  monthlyTrend: Array<{ month: string; income: number; expenses: number; savings: number }>;
}
