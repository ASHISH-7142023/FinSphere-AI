import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import type { Budget, CreditProfile, Expense, Goal, Investment, User } from "@finsphere/shared";

export interface StoredUser extends User {
  passwordHash: string;
}

export interface Store {
  users: StoredUser[];
  expenses: Expense[];
  budgets: Budget[];
  goals: Goal[];
  investments: Investment[];
  creditProfiles: CreditProfile[];
}

export function createSeedStore(): Store {
  const userId = "user_demo";
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: userId,
        name: "Siddharth Verma",
        email: "demo@finsphere.ai",
        passwordHash: bcrypt.hashSync("Demo@12345", 10),
        monthlyIncome: 150000,
        createdAt: now
      }
    ],
    expenses: [
      { id: "exp_1", userId, amount: 4200, category: "Food", description: "Client dinner", date: "2026-06-02" },
      { id: "exp_2", userId, amount: 9200, category: "Travel", description: "Airport rides", date: "2026-06-08" },
      { id: "exp_3", userId, amount: 12500, category: "Shopping", description: "Work setup", date: "2026-06-12" },
      { id: "exp_4", userId, amount: 7800, category: "Bills", description: "Utilities", date: "2026-06-15" },
      { id: "exp_5", userId, amount: 3600, category: "Entertainment", description: "Premium streaming", date: "2026-06-20" }
    ],
    budgets: [
      { id: "bud_1", userId, category: "Food", limitAmount: 18000, month: "2026-06" },
      { id: "bud_2", userId, category: "Travel", limitAmount: 12000, month: "2026-06" },
      { id: "bud_3", userId, category: "Shopping", limitAmount: 10000, month: "2026-06" },
      { id: "bud_4", userId, category: "Bills", limitAmount: 15000, month: "2026-06" }
    ],
    goals: [
      { id: "goal_1", userId, title: "Emergency Fund", targetAmount: 600000, currentAmount: 245000, targetDate: "2026-12-31" },
      { id: "goal_2", userId, title: "Japan Trip", targetAmount: 350000, currentAmount: 92000, targetDate: "2027-03-30" }
    ],
    investments: [
      { id: "inv_1", userId, assetType: "Stock", name: "NIFTY 50 ETF", investedAmount: 160000, currentValue: 184500 },
      { id: "inv_2", userId, assetType: "Mutual Fund", name: "Flexi Cap Fund", investedAmount: 220000, currentValue: 247800 },
      { id: "inv_3", userId, assetType: "SIP", name: "Monthly SIP Basket", investedAmount: 90000, currentValue: 96500 }
    ],
    creditProfiles: [{ id: "cred_1", userId, utilization: 24, paymentHistory: 98, creditAge: 6 }]
  };
}

export function makeId(prefix: string) {
  return `${prefix}_${nanoid(10)}`;
}
