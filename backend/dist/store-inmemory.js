import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
export function makeId(prefix) {
    return `${prefix}_${nanoid(10)}`;
}
export class InMemoryStore {
    users = [];
    expenses = [];
    budgets = [];
    goals = [];
    investments = [];
    creditProfiles = [];
    constructor() {
        this.seed();
    }
    seed() {
        const userId = "user_demo";
        const now = new Date().toISOString();
        this.users.push({
            id: userId,
            name: "Siddharth Verma",
            email: "demo@finsphere.ai",
            passwordHash: bcrypt.hashSync("Demo@12345", 10),
            monthlyIncome: 150000,
            createdAt: now
        });
        this.expenses.push({ id: "exp_1", userId, amount: 4200, category: "Food", description: "Client dinner", date: "2026-06-02" }, { id: "exp_2", userId, amount: 9200, category: "Travel", description: "Airport rides", date: "2026-06-08" }, { id: "exp_3", userId, amount: 12500, category: "Shopping", description: "Work setup", date: "2026-06-12" }, { id: "exp_4", userId, amount: 7800, category: "Bills", description: "Utilities", date: "2026-06-15" }, { id: "exp_5", userId, amount: 3600, category: "Entertainment", description: "Premium streaming", date: "2026-06-20" });
        this.budgets.push({ id: "bud_1", userId, category: "Food", limitAmount: 18000, month: "2026-06" }, { id: "bud_2", userId, category: "Travel", limitAmount: 12000, month: "2026-06" }, { id: "bud_3", userId, category: "Shopping", limitAmount: 10000, month: "2026-06" }, { id: "bud_4", userId, category: "Bills", limitAmount: 15000, month: "2026-06" });
        this.goals.push({ id: "goal_1", userId, title: "Emergency Fund", targetAmount: 600000, currentAmount: 245000, targetDate: "2026-12-31" }, { id: "goal_2", userId, title: "Japan Trip", targetAmount: 350000, currentAmount: 92000, targetDate: "2027-03-30" });
        this.investments.push({ id: "inv_1", userId, assetType: "Stock", name: "NIFTY 50 ETF", investedAmount: 160000, currentValue: 184500 }, { id: "inv_2", userId, assetType: "Mutual Fund", name: "Flexi Cap Fund", investedAmount: 220000, currentValue: 247800 }, { id: "inv_3", userId, assetType: "SIP", name: "Monthly SIP Basket", investedAmount: 90000, currentValue: 96500 });
        this.creditProfiles.push({ id: "cred_1", userId, utilization: 24, paymentHistory: 98, creditAge: 6 });
    }
    async getUserByEmail(email) {
        return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
    }
    async getUserById(id) {
        return this.users.find((u) => u.id === id) || null;
    }
    async createUser(user) {
        const newUser = {
            ...user,
            createdAt: new Date().toISOString()
        };
        this.users.push(newUser);
        return newUser;
    }
    async getExpenses(userId, filter) {
        return this.expenses.filter((item) => {
            if (item.userId !== userId)
                return false;
            if (filter?.category && item.category !== filter.category)
                return false;
            if (filter?.search && !item.description.toLowerCase().includes(filter.search.toLowerCase()))
                return false;
            return true;
        });
    }
    async createExpense(expense) {
        const newExpense = {
            id: makeId("exp"),
            ...expense
        };
        this.expenses.push(newExpense);
        return newExpense;
    }
    async updateExpense(id, userId, data) {
        const item = this.expenses.find((x) => x.id === id && x.userId === userId);
        if (!item)
            return null;
        Object.assign(item, data);
        return item;
    }
    async deleteExpense(id, userId) {
        const index = this.expenses.findIndex((x) => x.id === id && x.userId === userId);
        if (index === -1)
            return false;
        this.expenses.splice(index, 1);
        return true;
    }
    async getBudgets(userId) {
        return this.budgets.filter((item) => item.userId === userId);
    }
    async createBudget(budget) {
        const newBudget = {
            id: makeId("bud"),
            ...budget
        };
        this.budgets.push(newBudget);
        return newBudget;
    }
    async updateBudget(id, userId, data) {
        const item = this.budgets.find((x) => x.id === id && x.userId === userId);
        if (!item)
            return null;
        Object.assign(item, data);
        return item;
    }
    async deleteBudget(id, userId) {
        const index = this.budgets.findIndex((x) => x.id === id && x.userId === userId);
        if (index === -1)
            return false;
        this.budgets.splice(index, 1);
        return true;
    }
    async getGoals(userId) {
        return this.goals.filter((item) => item.userId === userId);
    }
    async createGoal(goal) {
        const newGoal = {
            id: makeId("goal"),
            ...goal
        };
        this.goals.push(newGoal);
        return newGoal;
    }
    async updateGoal(id, userId, data) {
        const item = this.goals.find((x) => x.id === id && x.userId === userId);
        if (!item)
            return null;
        Object.assign(item, data);
        return item;
    }
    async deleteGoal(id, userId) {
        const index = this.goals.findIndex((x) => x.id === id && x.userId === userId);
        if (index === -1)
            return false;
        this.goals.splice(index, 1);
        return true;
    }
    async getInvestments(userId) {
        return this.investments.filter((item) => item.userId === userId);
    }
    async createInvestment(investment) {
        const newInvestment = {
            id: makeId("inv"),
            ...investment
        };
        this.investments.push(newInvestment);
        return newInvestment;
    }
    async updateInvestment(id, userId, data) {
        const item = this.investments.find((x) => x.id === id && x.userId === userId);
        if (!item)
            return null;
        Object.assign(item, data);
        return item;
    }
    async deleteInvestment(id, userId) {
        const index = this.investments.findIndex((x) => x.id === id && x.userId === userId);
        if (index === -1)
            return false;
        this.investments.splice(index, 1);
        return true;
    }
    async getCreditProfile(userId) {
        return this.creditProfiles.find((x) => x.userId === userId) || null;
    }
    async upsertCreditProfile(userId, data) {
        const existing = this.creditProfiles.find((x) => x.userId === userId);
        if (existing) {
            Object.assign(existing, data);
            return existing;
        }
        const newProfile = {
            id: makeId("cred"),
            userId,
            ...data
        };
        this.creditProfiles.push(newProfile);
        return newProfile;
    }
}
