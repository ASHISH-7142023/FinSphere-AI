import { z } from "zod";
import { EXPENSE_CATEGORIES, INVESTMENT_TYPES } from "./types.js";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  monthlyIncome: z.coerce.number().positive().default(150000)
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1)
});

export const expenseSchema = z.object({
  amount: z.coerce.number().positive(),
  category: z.enum(EXPENSE_CATEGORIES),
  description: z.string().min(2).max(120),
  date: z.string().min(8)
});

export const budgetSchema = z.object({
  category: z.enum(EXPENSE_CATEGORIES),
  limitAmount: z.coerce.number().positive(),
  month: z.string().regex(/^\d{4}-\d{2}$/)
});

export const goalSchema = z.object({
  title: z.string().min(2).max(80),
  targetAmount: z.coerce.number().positive(),
  currentAmount: z.coerce.number().min(0),
  targetDate: z.string().min(8)
});

export const investmentSchema = z.object({
  assetType: z.enum(INVESTMENT_TYPES),
  name: z.string().min(2).max(80),
  investedAmount: z.coerce.number().positive(),
  currentValue: z.coerce.number().min(0)
});

export const creditProfileSchema = z.object({
  utilization: z.coerce.number().min(0).max(100),
  paymentHistory: z.coerce.number().min(0).max(100),
  creditAge: z.coerce.number().min(0).max(40)
});
