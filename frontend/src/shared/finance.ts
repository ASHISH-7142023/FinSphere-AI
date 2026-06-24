import type { Budget, CreditProfile, Expense, Grade, Investment } from "./types";

export function calculateBudgetUsage(expenses: Expense[], budgets: Budget[]) {
  const totalLimit = budgets.reduce((sum, budget) => sum + budget.limitAmount, 0);
  if (totalLimit === 0) return 0;
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return Math.min(100, Math.round((totalSpent / totalLimit) * 100));
}

export function getOverspendingAlerts(expenses: Expense[], budgets: Budget[]) {
  return budgets
    .map((budget) => {
      const spent = expenses
        .filter((expense) => expense.category === budget.category)
        .reduce((sum, expense) => sum + expense.amount, 0);
      return { category: budget.category, spent, limitAmount: budget.limitAmount, overBy: spent - budget.limitAmount };
    })
    .filter((item) => item.overBy > 0);
}

export function simulateCreditScore(profile: Omit<CreditProfile, "id" | "userId">) {
  const utilizationScore = Math.max(0, 100 - profile.utilization) * 1.8;
  const paymentScore = profile.paymentHistory * 3.5;
  const ageScore = Math.min(profile.creditAge, 20) * 6;
  const score = Math.round(300 + utilizationScore + paymentScore + ageScore);
  const estimatedScore = Math.max(300, Math.min(900, score));
  const recommendations = [
    profile.utilization > 30 ? "Reduce credit utilization below 30%." : "Credit utilization is healthy.",
    profile.paymentHistory < 95 ? "Prioritize on-time payments for the next 6 months." : "Payment history is excellent.",
    profile.creditAge < 3 ? "Keep older accounts active to improve credit age." : "Credit age is contributing positively."
  ];
  return { estimatedScore, recommendations };
}

export function gradeFinancialHealth(score: number): Grade {
  if (score <= 40) return "Poor";
  if (score <= 60) return "Average";
  if (score <= 80) return "Good";
  return "Excellent";
}

export function calculateFinancialHealth(input: {
  income: number;
  expenses: Expense[];
  budgets: Budget[];
  investments: Investment[];
  debtPayment?: number;
}) {
  const totalExpenses = input.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const savingsRatio = input.income > 0 ? Math.max(0, (input.income - totalExpenses) / input.income) : 0;
  const savingsScore = Math.min(100, savingsRatio * 100) * 0.3;

  const budgetUsage = calculateBudgetUsage(input.expenses, input.budgets);
  const budgetDiscipline = Math.max(0, 100 - Math.max(0, budgetUsage - 80) * 2) * 0.3;

  const debtRatio = input.income > 0 ? (input.debtPayment ?? 0) / input.income : 1;
  const debtScore = Math.max(0, 100 - debtRatio * 200) * 0.2;

  const invested = input.investments.reduce((sum, investment) => sum + investment.currentValue, 0);
  const investmentScore = Math.min(100, input.income > 0 ? (invested / input.income) * 35 : 0) * 0.2;

  const score = Math.round(savingsScore + budgetDiscipline + debtScore + investmentScore);
  return { score, grade: gradeFinancialHealth(score), budgetUsage };
}
