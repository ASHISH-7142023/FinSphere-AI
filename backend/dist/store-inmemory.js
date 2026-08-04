import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
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
    khataContacts = [];
    khataEntries = [];
    dbPath = path.resolve(process.cwd(), "inmemory_db.json");
    constructor() {
        this.load();
    }
    seed() {
        // Seed default demo user for seamless local development fallback
        const hashedPassword = bcrypt.hashSync("Demo@12345", 10);
        this.users.push({
            id: "user_demo",
            name: "Demo User",
            email: "demo@finsphere.ai",
            monthlyIncome: 150000,
            passwordHash: hashedPassword,
            createdAt: new Date().toISOString()
        });
    }
    load() {
        try {
            if (fs.existsSync(this.dbPath)) {
                const raw = fs.readFileSync(this.dbPath, "utf8");
                const data = JSON.parse(raw);
                this.users = data.users || [];
                this.expenses = data.expenses || [];
                this.budgets = data.budgets || [];
                this.goals = data.goals || [];
                this.investments = data.investments || [];
                this.creditProfiles = data.creditProfiles || [];
                this.khataContacts = data.khataContacts || [];
                this.khataEntries = data.khataEntries || [];
            }
            else {
                this.seed();
                this.save();
            }
        }
        catch (err) {
            console.error("Failed to load inmemory db file:", err);
            this.seed();
        }
    }
    save() {
        try {
            const data = {
                users: this.users,
                expenses: this.expenses,
                budgets: this.budgets,
                goals: this.goals,
                investments: this.investments,
                creditProfiles: this.creditProfiles,
                khataContacts: this.khataContacts,
                khataEntries: this.khataEntries
            };
            fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), "utf8");
        }
        catch (err) {
            console.error("Failed to save inmemory db file:", err);
        }
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
        this.save();
        return newUser;
    }
    async updateUserPassword(email, passwordHash) {
        const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!user)
            return null;
        user.passwordHash = passwordHash;
        this.save();
        return user;
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
        this.save();
        return newExpense;
    }
    async updateExpense(id, userId, data) {
        const item = this.expenses.find((x) => x.id === id && x.userId === userId);
        if (!item)
            return null;
        Object.assign(item, data);
        this.save();
        return item;
    }
    async deleteExpense(id, userId) {
        const index = this.expenses.findIndex((x) => x.id === id && x.userId === userId);
        if (index === -1)
            return false;
        this.expenses.splice(index, 1);
        this.save();
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
        this.save();
        return newBudget;
    }
    async updateBudget(id, userId, data) {
        const item = this.budgets.find((x) => x.id === id && x.userId === userId);
        if (!item)
            return null;
        Object.assign(item, data);
        this.save();
        return item;
    }
    async deleteBudget(id, userId) {
        const index = this.budgets.findIndex((x) => x.id === id && x.userId === userId);
        if (index === -1)
            return false;
        this.budgets.splice(index, 1);
        this.save();
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
        this.save();
        return newGoal;
    }
    async updateGoal(id, userId, data) {
        const item = this.goals.find((x) => x.id === id && x.userId === userId);
        if (!item)
            return null;
        Object.assign(item, data);
        this.save();
        return item;
    }
    async deleteGoal(id, userId) {
        const index = this.goals.findIndex((x) => x.id === id && x.userId === userId);
        if (index === -1)
            return false;
        this.goals.splice(index, 1);
        this.save();
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
        this.save();
        return newInvestment;
    }
    async updateInvestment(id, userId, data) {
        const item = this.investments.find((x) => x.id === id && x.userId === userId);
        if (!item)
            return null;
        Object.assign(item, data);
        this.save();
        return item;
    }
    async deleteInvestment(id, userId) {
        const index = this.investments.findIndex((x) => x.id === id && x.userId === userId);
        if (index === -1)
            return false;
        this.investments.splice(index, 1);
        this.save();
        return true;
    }
    async getCreditProfile(userId) {
        return this.creditProfiles.find((x) => x.userId === userId) || null;
    }
    async upsertCreditProfile(userId, data) {
        const existing = this.creditProfiles.find((x) => x.userId === userId);
        if (existing) {
            Object.assign(existing, data);
            this.save();
            return existing;
        }
        const newProfile = {
            id: makeId("cred"),
            userId,
            ...data
        };
        this.creditProfiles.push(newProfile);
        this.save();
        return newProfile;
    }
    async updateUser(id, data) {
        const user = this.users.find((u) => u.id === id);
        if (!user)
            return null;
        if (data.name !== undefined)
            user.name = data.name;
        if (data.email !== undefined)
            user.email = data.email;
        if (data.monthlyIncome !== undefined)
            user.monthlyIncome = data.monthlyIncome;
        this.save();
        return user;
    }
    async getKhataContacts(userId) {
        const contacts = this.khataContacts.filter((c) => c.userId === userId);
        return contacts.map((c) => ({
            ...c,
            entries: this.khataEntries.filter((e) => e.contactId === c.id)
        }));
    }
    async createKhataContact(userId, data) {
        const contact = {
            id: makeId("cont"),
            userId,
            name: data.name,
            type: data.type,
            amount: 0,
            lastActive: "Created now",
            entries: []
        };
        this.khataContacts.push(contact);
        this.save();
        return contact;
    }
    async createKhataEntry(contactId, data) {
        const contact = this.khataContacts.find((c) => c.id === contactId);
        if (!contact)
            throw new Error("Contact not found");
        const entry = {
            id: makeId("kentry"),
            contactId,
            type: data.type,
            amount: data.amount,
            remarks: data.remarks,
            date: new Date().toISOString().split("T")[0]
        };
        this.khataEntries.push(entry);
        let finalAmount = contact.amount;
        if (contact.type === data.type) {
            finalAmount += data.amount;
        }
        else {
            finalAmount -= data.amount;
            if (finalAmount < 0) {
                contact.type = contact.type === "get" ? "give" : "get";
                finalAmount = Math.abs(finalAmount);
            }
        }
        contact.amount = finalAmount;
        contact.lastActive = "Just now";
        this.save();
        return entry;
    }
    async settleKhataContact(contactId, userId) {
        const contactIdx = this.khataContacts.findIndex((c) => c.id === contactId && c.userId === userId);
        if (contactIdx === -1)
            return false;
        const contact = this.khataContacts[contactIdx];
        contact.amount = 0;
        contact.lastActive = "Settled up just now";
        this.khataEntries = this.khataEntries.filter((e) => e.contactId !== contactId);
        this.save();
        return true;
    }
}
