import type { Budget, CreditProfile, Expense, Goal, Investment, User, KhataContact, KhataEntry } from "./shared/index.js";

export interface StoredUser extends User {
  passwordHash: string;
}

export interface IStore {
  // Users
  getUserByEmail(email: string): Promise<StoredUser | null>;
  getUserById(id: string): Promise<StoredUser | null>;
  createUser(user: Omit<StoredUser, "createdAt">): Promise<StoredUser>;
  updateUserPassword(email: string, passwordHash: string): Promise<StoredUser | null>;

  // Expenses
  getExpenses(userId: string, filter?: { search?: string; category?: string }): Promise<Expense[]>;
  createExpense(expense: Omit<Expense, "id">): Promise<Expense>;
  updateExpense(id: string, userId: string, data: Partial<Omit<Expense, "id" | "userId">>): Promise<Expense | null>;
  deleteExpense(id: string, userId: string): Promise<boolean>;

  // Budgets
  getBudgets(userId: string): Promise<Budget[]>;
  createBudget(budget: Omit<Budget, "id">): Promise<Budget>;
  updateBudget(id: string, userId: string, data: Partial<Omit<Budget, "id" | "userId">>): Promise<Budget | null>;
  deleteBudget(id: string, userId: string): Promise<boolean>;

  // Goals
  getGoals(userId: string): Promise<Goal[]>;
  createGoal(goal: Omit<Goal, "id">): Promise<Goal>;
  updateGoal(id: string, userId: string, data: Partial<Omit<Goal, "id" | "userId">>): Promise<Goal | null>;
  deleteGoal(id: string, userId: string): Promise<boolean>;

  // Investments
  getInvestments(userId: string): Promise<Investment[]>;
  createInvestment(investment: Omit<Investment, "id">): Promise<Investment>;
  updateInvestment(id: string, userId: string, data: Partial<Omit<Investment, "id" | "userId">>): Promise<Investment | null>;
  deleteInvestment(id: string, userId: string): Promise<boolean>;

  // Credit Profile
  getCreditProfile(userId: string): Promise<CreditProfile | null>;
  upsertCreditProfile(userId: string, data: Omit<CreditProfile, "id" | "userId">): Promise<CreditProfile>;

  // Users
  updateUser(id: string, data: Partial<Omit<User, "id" | "createdAt">>): Promise<StoredUser | null>;

  // Khata Ledger
  getKhataContacts(userId: string): Promise<KhataContact[]>;
  createKhataContact(userId: string, data: { name: string; type: "get" | "give" }): Promise<KhataContact>;
  createKhataEntry(contactId: string, data: { type: "get" | "give"; amount: number; remarks: string }): Promise<KhataEntry>;
  settleKhataContact(contactId: string, userId: string): Promise<boolean>;
}
