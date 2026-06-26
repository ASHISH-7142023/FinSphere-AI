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
        // Start with a clean database/store with no pre-populated records or users.
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
