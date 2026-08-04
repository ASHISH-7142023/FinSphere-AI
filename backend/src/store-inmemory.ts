import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import type { Budget, CreditProfile, Expense, Goal, Investment, User, KhataContact, KhataEntry } from "./shared/index.js";
import type { IStore, StoredUser } from "./store.interface.js";

export function makeId(prefix: string) {
  return `${prefix}_${nanoid(10)}`;
}

export class InMemoryStore implements IStore {
  private users: StoredUser[] = [];
  private expenses: Expense[] = [];
  private budgets: Budget[] = [];
  private goals: Goal[] = [];
  private investments: Investment[] = [];
  private creditProfiles: CreditProfile[] = [];
  private khataContacts: KhataContact[] = [];
  private khataEntries: KhataEntry[] = [];
  private dbPath = path.resolve(process.cwd(), "inmemory_db.json");

  constructor() {
    this.load();
  }

  private seed() {
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

  private load() {
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
      } else {
        this.seed();
        this.save();
      }
    } catch (err) {
      console.error("Failed to load inmemory db file:", err);
      this.seed();
    }
  }

  private save() {
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
    } catch (err) {
      console.error("Failed to save inmemory db file:", err);
    }
  }

  async getUserByEmail(email: string): Promise<StoredUser | null> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async getUserById(id: string): Promise<StoredUser | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async createUser(user: Omit<StoredUser, "createdAt">): Promise<StoredUser> {
    const newUser: StoredUser = {
      ...user,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    this.save();
    return newUser;
  }

  async updateUserPassword(email: string, passwordHash: string): Promise<StoredUser | null> {
    const user = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return null;
    user.passwordHash = passwordHash;
    this.save();
    return user;
  }

  async getExpenses(userId: string, filter?: { search?: string; category?: string }): Promise<Expense[]> {
    return this.expenses.filter((item) => {
      if (item.userId !== userId) return false;
      if (filter?.category && item.category !== filter.category) return false;
      if (filter?.search && !item.description.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  }

  async createExpense(expense: Omit<Expense, "id">): Promise<Expense> {
    const newExpense: Expense = {
      id: makeId("exp"),
      ...expense
    };
    this.expenses.push(newExpense);
    this.save();
    return newExpense;
  }

  async updateExpense(id: string, userId: string, data: Partial<Omit<Expense, "id" | "userId">>): Promise<Expense | null> {
    const item = this.expenses.find((x) => x.id === id && x.userId === userId);
    if (!item) return null;
    Object.assign(item, data);
    this.save();
    return item;
  }

  async deleteExpense(id: string, userId: string): Promise<boolean> {
    const index = this.expenses.findIndex((x) => x.id === id && x.userId === userId);
    if (index === -1) return false;
    this.expenses.splice(index, 1);
    this.save();
    return true;
  }

  async getBudgets(userId: string): Promise<Budget[]> {
    return this.budgets.filter((item) => item.userId === userId);
  }

  async createBudget(budget: Omit<Budget, "id">): Promise<Budget> {
    const newBudget: Budget = {
      id: makeId("bud"),
      ...budget
    };
    this.budgets.push(newBudget);
    this.save();
    return newBudget;
  }

  async updateBudget(id: string, userId: string, data: Partial<Omit<Budget, "id" | "userId">>): Promise<Budget | null> {
    const item = this.budgets.find((x) => x.id === id && x.userId === userId);
    if (!item) return null;
    Object.assign(item, data);
    this.save();
    return item;
  }

  async deleteBudget(id: string, userId: string): Promise<boolean> {
    const index = this.budgets.findIndex((x) => x.id === id && x.userId === userId);
    if (index === -1) return false;
    this.budgets.splice(index, 1);
    this.save();
    return true;
  }

  async getGoals(userId: string): Promise<Goal[]> {
    return this.goals.filter((item) => item.userId === userId);
  }

  async createGoal(goal: Omit<Goal, "id">): Promise<Goal> {
    const newGoal: Goal = {
      id: makeId("goal"),
      ...goal
    };
    this.goals.push(newGoal);
    this.save();
    return newGoal;
  }

  async updateGoal(id: string, userId: string, data: Partial<Omit<Goal, "id" | "userId">>): Promise<Goal | null> {
    const item = this.goals.find((x) => x.id === id && x.userId === userId);
    if (!item) return null;
    Object.assign(item, data);
    this.save();
    return item;
  }

  async deleteGoal(id: string, userId: string): Promise<boolean> {
    const index = this.goals.findIndex((x) => x.id === id && x.userId === userId);
    if (index === -1) return false;
    this.goals.splice(index, 1);
    this.save();
    return true;
  }

  async getInvestments(userId: string): Promise<Investment[]> {
    return this.investments.filter((item) => item.userId === userId);
  }

  async createInvestment(investment: Omit<Investment, "id">): Promise<Investment> {
    const newInvestment: Investment = {
      id: makeId("inv"),
      ...investment
    };
    this.investments.push(newInvestment);
    this.save();
    return newInvestment;
  }

  async updateInvestment(id: string, userId: string, data: Partial<Omit<Investment, "id" | "userId">>): Promise<Investment | null> {
    const item = this.investments.find((x) => x.id === id && x.userId === userId);
    if (!item) return null;
    Object.assign(item, data);
    this.save();
    return item;
  }

  async deleteInvestment(id: string, userId: string): Promise<boolean> {
    const index = this.investments.findIndex((x) => x.id === id && x.userId === userId);
    if (index === -1) return false;
    this.investments.splice(index, 1);
    this.save();
    return true;
  }

  async getCreditProfile(userId: string): Promise<CreditProfile | null> {
    return this.creditProfiles.find((x) => x.userId === userId) || null;
  }

  async upsertCreditProfile(userId: string, data: Omit<CreditProfile, "id" | "userId">): Promise<CreditProfile> {
    const existing = this.creditProfiles.find((x) => x.userId === userId);
    if (existing) {
      Object.assign(existing, data);
      this.save();
      return existing;
    }
    const newProfile: CreditProfile = {
      id: makeId("cred"),
      userId,
      ...data
    };
    this.creditProfiles.push(newProfile);
    this.save();
    return newProfile;
  }

  async updateUser(id: string, data: Partial<Omit<User, "id" | "createdAt">>): Promise<StoredUser | null> {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;
    if (data.name !== undefined) user.name = data.name;
    if (data.email !== undefined) user.email = data.email;
    if (data.monthlyIncome !== undefined) user.monthlyIncome = data.monthlyIncome;
    this.save();
    return user;
  }

  async getKhataContacts(userId: string): Promise<KhataContact[]> {
    const contacts = this.khataContacts.filter((c) => c.userId === userId);
    return contacts.map((c) => ({
      ...c,
      entries: this.khataEntries.filter((e) => e.contactId === c.id)
    }));
  }

  async createKhataContact(userId: string, data: { name: string; type: "get" | "give" }): Promise<KhataContact> {
    const contact: KhataContact = {
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

  async createKhataEntry(contactId: string, data: { type: "get" | "give"; amount: number; remarks: string }): Promise<KhataEntry> {
    const contact = this.khataContacts.find((c) => c.id === contactId);
    if (!contact) throw new Error("Contact not found");

    const entry: KhataEntry = {
      id: makeId("kentry"),
      contactId,
      type: data.type,
      amount: data.amount,
      remarks: data.remarks,
      date: new Date().toISOString().split("T")[0]!
    };
    this.khataEntries.push(entry);

    let finalAmount = contact.amount;
    if (contact.type === data.type) {
      finalAmount += data.amount;
    } else {
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

  async settleKhataContact(contactId: string, userId: string): Promise<boolean> {
    const contactIdx = this.khataContacts.findIndex((c) => c.id === contactId && c.userId === userId);
    if (contactIdx === -1) return false;

    const contact = this.khataContacts[contactIdx]!;
    contact.amount = 0;
    contact.lastActive = "Settled up just now";
    this.khataEntries = this.khataEntries.filter((e) => e.contactId !== contactId);
    this.save();
    return true;
  }
}
