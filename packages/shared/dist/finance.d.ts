import type { Budget, CreditProfile, Expense, Grade, Investment } from "./types.js";
export declare function calculateBudgetUsage(expenses: Expense[], budgets: Budget[]): number;
export declare function getOverspendingAlerts(expenses: Expense[], budgets: Budget[]): {
    category: "Food" | "Travel" | "Shopping" | "Bills" | "Entertainment" | "Education" | "Health" | "Other";
    spent: number;
    limitAmount: number;
    overBy: number;
}[];
export declare function simulateCreditScore(profile: Omit<CreditProfile, "id" | "userId">): {
    estimatedScore: number;
    recommendations: string[];
};
export declare function gradeFinancialHealth(score: number): Grade;
export declare function calculateFinancialHealth(input: {
    income: number;
    expenses: Expense[];
    budgets: Budget[];
    investments: Investment[];
    debtPayment?: number;
}): {
    score: number;
    grade: Grade;
    budgetUsage: number;
};
