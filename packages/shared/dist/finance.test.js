import { describe, expect, it } from "vitest";
import { calculateBudgetUsage, calculateFinancialHealth, getOverspendingAlerts, simulateCreditScore } from "./finance.js";
const expenses = [
    { id: "1", userId: "u1", amount: 2000, category: "Food", description: "Dinner", date: "2026-06-01" },
    { id: "2", userId: "u1", amount: 5000, category: "Travel", description: "Cab", date: "2026-06-02" }
];
it("calculates budget usage", () => {
    expect(calculateBudgetUsage(expenses, [
        { id: "b1", userId: "u1", category: "Food", limitAmount: 4000, month: "2026-06" },
        { id: "b2", userId: "u1", category: "Travel", limitAmount: 6000, month: "2026-06" }
    ])).toBe(70);
});
it("detects overspending by category", () => {
    const alerts = getOverspendingAlerts(expenses, [{ id: "b1", userId: "u1", category: "Food", limitAmount: 1000, month: "2026-06" }]);
    expect(alerts[0]?.overBy).toBe(1000);
});
describe("credit simulator", () => {
    it("returns a bounded score and recommendations", () => {
        const result = simulateCreditScore({ utilization: 24, paymentHistory: 98, creditAge: 6 });
        expect(result.estimatedScore).toBeGreaterThan(700);
        expect(result.estimatedScore).toBeLessThanOrEqual(900);
        expect(result.recommendations).toHaveLength(3);
    });
});
it("calculates financial health score and grade", () => {
    const result = calculateFinancialHealth({
        income: 150000,
        expenses,
        budgets: [{ id: "b1", userId: "u1", category: "Food", limitAmount: 10000, month: "2026-06" }],
        investments: [{ id: "i1", userId: "u1", assetType: "Stock", name: "NIFTY ETF", investedAmount: 50000, currentValue: 62000 }]
    });
    expect(result.score).toBeGreaterThan(60);
});
