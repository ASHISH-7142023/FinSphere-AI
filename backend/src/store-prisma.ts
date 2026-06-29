import { PrismaClient, ExpenseCategory, InvestmentType } from "@prisma/client";
import type { Budget, CreditProfile, Expense, Goal, Investment } from "./shared/index.js";
import type { IStore, StoredUser } from "./store.interface.js";

function toTSInvestmentType(type: InvestmentType): string {
  if (type === "MutualFund") return "Mutual Fund";
  return type;
}

function toPrismaInvestmentType(type: string): InvestmentType {
  if (type === "Mutual Fund") return "MutualFund";
  return type as InvestmentType;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

export class PrismaStore implements IStore {
  private prisma = new PrismaClient();

  async getUserByEmail(email: string): Promise<StoredUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      monthlyIncome: Number(user.monthlyIncome),
      passwordHash: user.passwordHash,
      createdAt: user.createdAt.toISOString()
    };
  }

  async getUserById(id: string): Promise<StoredUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      monthlyIncome: Number(user.monthlyIncome),
      passwordHash: user.passwordHash,
      createdAt: user.createdAt.toISOString()
    };
  }

  async createUser(user: Omit<StoredUser, "createdAt">): Promise<StoredUser> {
    const dbUser = await this.prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email.toLowerCase(),
        passwordHash: user.passwordHash,
        monthlyIncome: user.monthlyIncome
      }
    });
    return {
      id: dbUser.id,
      name: dbUser.name,
      email: dbUser.email,
      monthlyIncome: Number(dbUser.monthlyIncome),
      passwordHash: dbUser.passwordHash,
      createdAt: dbUser.createdAt.toISOString()
    };
  }

  async updateUserPassword(email: string, passwordHash: string): Promise<StoredUser | null> {
    try {
      const user = await this.prisma.user.update({
        where: { email: email.toLowerCase() },
        data: { passwordHash }
      });
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        monthlyIncome: Number(user.monthlyIncome),
        passwordHash: user.passwordHash,
        createdAt: user.createdAt.toISOString()
      };
    } catch {
      return null;
    }
  }

  async getExpenses(userId: string, filter?: { search?: string; category?: string }): Promise<Expense[]> {
    const where: any = { userId };
    if (filter?.category) {
      where.category = filter.category as ExpenseCategory;
    }
    if (filter?.search) {
      where.description = {
        contains: filter.search,
        mode: "insensitive"
      };
    }
    const list = await this.prisma.expense.findMany({
      where,
      orderBy: { date: "asc" }
    });
    return list.map((item) => ({
      id: item.id,
      userId: item.userId,
      amount: Number(item.amount),
      category: item.category as any,
      description: item.description,
      date: formatDate(item.date)
    }));
  }

  async createExpense(expense: Omit<Expense, "id">): Promise<Expense> {
    const dbExpense = await this.prisma.expense.create({
      data: {
        userId: expense.userId,
        amount: expense.amount,
        category: expense.category as ExpenseCategory,
        description: expense.description,
        date: new Date(expense.date)
      }
    });
    return {
      id: dbExpense.id,
      userId: dbExpense.userId,
      amount: Number(dbExpense.amount),
      category: dbExpense.category as any,
      description: dbExpense.description,
      date: formatDate(dbExpense.date)
    };
  }

  async updateExpense(id: string, userId: string, data: Partial<Omit<Expense, "id" | "userId">>): Promise<Expense | null> {
    const updateData: any = {};
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.category !== undefined) updateData.category = data.category as ExpenseCategory;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.date !== undefined) updateData.date = new Date(data.date);

    try {
      const dbExpense = await this.prisma.expense.update({
        where: { id, userId },
        data: updateData
      });
      return {
        id: dbExpense.id,
        userId: dbExpense.userId,
        amount: Number(dbExpense.amount),
        category: dbExpense.category as any,
        description: dbExpense.description,
        date: formatDate(dbExpense.date)
      };
    } catch {
      return null;
    }
  }

  async deleteExpense(id: string, userId: string): Promise<boolean> {
    try {
      await this.prisma.expense.delete({
        where: { id, userId }
      });
      return true;
    } catch {
      return false;
    }
  }

  async getBudgets(userId: string): Promise<Budget[]> {
    const list = await this.prisma.budget.findMany({
      where: { userId }
    });
    return list.map((item) => ({
      id: item.id,
      userId: item.userId,
      category: item.category as any,
      limitAmount: Number(item.limitAmount),
      month: item.month
    }));
  }

  async createBudget(budget: Omit<Budget, "id">): Promise<Budget> {
    const dbBudget = await this.prisma.budget.upsert({
      where: {
        userId_category_month: {
          userId: budget.userId,
          category: budget.category as ExpenseCategory,
          month: budget.month
        }
      },
      update: {
        limitAmount: budget.limitAmount
      },
      create: {
        userId: budget.userId,
        category: budget.category as ExpenseCategory,
        limitAmount: budget.limitAmount,
        month: budget.month
      }
    });
    return {
      id: dbBudget.id,
      userId: dbBudget.userId,
      category: dbBudget.category as any,
      limitAmount: Number(dbBudget.limitAmount),
      month: dbBudget.month
    };
  }

  async updateBudget(id: string, userId: string, data: Partial<Omit<Budget, "id" | "userId">>): Promise<Budget | null> {
    const updateData: any = {};
    if (data.limitAmount !== undefined) updateData.limitAmount = data.limitAmount;
    if (data.category !== undefined) updateData.category = data.category as ExpenseCategory;
    if (data.month !== undefined) updateData.month = data.month;

    try {
      const dbBudget = await this.prisma.budget.update({
        where: { id, userId },
        data: updateData
      });
      return {
        id: dbBudget.id,
        userId: dbBudget.userId,
        category: dbBudget.category as any,
        limitAmount: Number(dbBudget.limitAmount),
        month: dbBudget.month
      };
    } catch {
      return null;
    }
  }

  async deleteBudget(id: string, userId: string): Promise<boolean> {
    try {
      await this.prisma.budget.delete({
        where: { id, userId }
      });
      return true;
    } catch {
      return false;
    }
  }

  async getGoals(userId: string): Promise<Goal[]> {
    const list = await this.prisma.goal.findMany({
      where: { userId }
    });
    return list.map((item) => ({
      id: item.id,
      userId: item.userId,
      title: item.title,
      targetAmount: Number(item.targetAmount),
      currentAmount: Number(item.currentAmount),
      targetDate: formatDate(item.targetDate)
    }));
  }

  async createGoal(goal: Omit<Goal, "id">): Promise<Goal> {
    const dbGoal = await this.prisma.goal.create({
      data: {
        userId: goal.userId,
        title: goal.title,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        targetDate: new Date(goal.targetDate)
      }
    });
    return {
      id: dbGoal.id,
      userId: dbGoal.userId,
      title: dbGoal.title,
      targetAmount: Number(dbGoal.targetAmount),
      currentAmount: Number(dbGoal.currentAmount),
      targetDate: formatDate(dbGoal.targetDate)
    };
  }

  async updateGoal(id: string, userId: string, data: Partial<Omit<Goal, "id" | "userId">>): Promise<Goal | null> {
    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.targetAmount !== undefined) updateData.targetAmount = data.targetAmount;
    if (data.currentAmount !== undefined) updateData.currentAmount = data.currentAmount;
    if (data.targetDate !== undefined) updateData.targetDate = new Date(data.targetDate);

    try {
      const dbGoal = await this.prisma.goal.update({
        where: { id, userId },
        data: updateData
      });
      return {
        id: dbGoal.id,
        userId: dbGoal.userId,
        title: dbGoal.title,
        targetAmount: Number(dbGoal.targetAmount),
        currentAmount: Number(dbGoal.currentAmount),
        targetDate: formatDate(dbGoal.targetDate)
      };
    } catch {
      return null;
    }
  }

  async deleteGoal(id: string, userId: string): Promise<boolean> {
    try {
      await this.prisma.goal.delete({
        where: { id, userId }
      });
      return true;
    } catch {
      return false;
    }
  }

  async getInvestments(userId: string): Promise<Investment[]> {
    const list = await this.prisma.investment.findMany({
      where: { userId }
    });
    return list.map((item) => ({
      id: item.id,
      userId: item.userId,
      assetType: toTSInvestmentType(item.assetType) as any,
      name: item.name,
      investedAmount: Number(item.investedAmount),
      currentValue: Number(item.currentValue)
    }));
  }

  async createInvestment(investment: Omit<Investment, "id">): Promise<Investment> {
    const dbInvestment = await this.prisma.investment.create({
      data: {
        userId: investment.userId,
        assetType: toPrismaInvestmentType(investment.assetType),
        name: investment.name,
        investedAmount: investment.investedAmount,
        currentValue: investment.currentValue
      }
    });
    return {
      id: dbInvestment.id,
      userId: dbInvestment.userId,
      assetType: toTSInvestmentType(dbInvestment.assetType) as any,
      name: dbInvestment.name,
      investedAmount: Number(dbInvestment.investedAmount),
      currentValue: Number(dbInvestment.currentValue)
    };
  }

  async updateInvestment(id: string, userId: string, data: Partial<Omit<Investment, "id" | "userId">>): Promise<Investment | null> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.assetType !== undefined) updateData.assetType = toPrismaInvestmentType(data.assetType);
    if (data.investedAmount !== undefined) updateData.investedAmount = data.investedAmount;
    if (data.currentValue !== undefined) updateData.currentValue = data.currentValue;

    try {
      const dbInvestment = await this.prisma.investment.update({
        where: { id, userId },
        data: updateData
      });
      return {
        id: dbInvestment.id,
        userId: dbInvestment.userId,
        assetType: toTSInvestmentType(dbInvestment.assetType) as any,
        name: dbInvestment.name,
        investedAmount: Number(dbInvestment.investedAmount),
        currentValue: Number(dbInvestment.currentValue)
      };
    } catch {
      return null;
    }
  }

  async deleteInvestment(id: string, userId: string): Promise<boolean> {
    try {
      await this.prisma.investment.delete({
        where: { id, userId }
      });
      return true;
    } catch {
      return false;
    }
  }

  async getCreditProfile(userId: string): Promise<CreditProfile | null> {
    const dbProfile = await this.prisma.creditProfile.findUnique({
      where: { userId }
    });
    if (!dbProfile) return null;
    return {
      id: dbProfile.id,
      userId: dbProfile.userId,
      utilization: Number(dbProfile.utilization),
      paymentHistory: Number(dbProfile.paymentHistory),
      creditAge: Number(dbProfile.creditAge)
    };
  }

  async upsertCreditProfile(userId: string, data: Omit<CreditProfile, "id" | "userId">): Promise<CreditProfile> {
    const dbProfile = await this.prisma.creditProfile.upsert({
      where: { userId },
      update: {
        utilization: data.utilization,
        paymentHistory: data.paymentHistory,
        creditAge: data.creditAge
      },
      create: {
        userId,
        utilization: data.utilization,
        paymentHistory: data.paymentHistory,
        creditAge: data.creditAge
      }
    });
    return {
      id: dbProfile.id,
      userId: dbProfile.userId,
      utilization: Number(dbProfile.utilization),
      paymentHistory: Number(dbProfile.paymentHistory),
      creditAge: Number(dbProfile.creditAge)
    };
  }
}
