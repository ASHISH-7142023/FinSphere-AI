import { PrismaClient } from "@prisma/client";
function toTSInvestmentType(type) {
    if (type === "MutualFund")
        return "Mutual Fund";
    return type;
}
function toPrismaInvestmentType(type) {
    if (type === "Mutual Fund")
        return "MutualFund";
    return type;
}
function formatDate(date) {
    return date.toISOString().split("T")[0];
}
export class PrismaStore {
    prisma = new PrismaClient();
    async getUserByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            monthlyIncome: Number(user.monthlyIncome),
            passwordHash: user.passwordHash,
            createdAt: user.createdAt.toISOString()
        };
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (!user)
            return null;
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            monthlyIncome: Number(user.monthlyIncome),
            passwordHash: user.passwordHash,
            createdAt: user.createdAt.toISOString()
        };
    }
    async createUser(user) {
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
    async updateUserPassword(email, passwordHash) {
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
        }
        catch {
            return null;
        }
    }
    async getExpenses(userId, filter) {
        const where = { userId };
        if (filter?.category) {
            where.category = filter.category;
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
            category: item.category,
            description: item.description,
            date: formatDate(item.date)
        }));
    }
    async createExpense(expense) {
        const dbExpense = await this.prisma.expense.create({
            data: {
                userId: expense.userId,
                amount: expense.amount,
                category: expense.category,
                description: expense.description,
                date: new Date(expense.date)
            }
        });
        return {
            id: dbExpense.id,
            userId: dbExpense.userId,
            amount: Number(dbExpense.amount),
            category: dbExpense.category,
            description: dbExpense.description,
            date: formatDate(dbExpense.date)
        };
    }
    async updateExpense(id, userId, data) {
        const updateData = {};
        if (data.amount !== undefined)
            updateData.amount = data.amount;
        if (data.category !== undefined)
            updateData.category = data.category;
        if (data.description !== undefined)
            updateData.description = data.description;
        if (data.date !== undefined)
            updateData.date = new Date(data.date);
        try {
            const dbExpense = await this.prisma.expense.update({
                where: { id, userId },
                data: updateData
            });
            return {
                id: dbExpense.id,
                userId: dbExpense.userId,
                amount: Number(dbExpense.amount),
                category: dbExpense.category,
                description: dbExpense.description,
                date: formatDate(dbExpense.date)
            };
        }
        catch {
            return null;
        }
    }
    async deleteExpense(id, userId) {
        try {
            await this.prisma.expense.delete({
                where: { id, userId }
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async getBudgets(userId) {
        const list = await this.prisma.budget.findMany({
            where: { userId }
        });
        return list.map((item) => ({
            id: item.id,
            userId: item.userId,
            category: item.category,
            limitAmount: Number(item.limitAmount),
            month: item.month
        }));
    }
    async createBudget(budget) {
        const dbBudget = await this.prisma.budget.upsert({
            where: {
                userId_category_month: {
                    userId: budget.userId,
                    category: budget.category,
                    month: budget.month
                }
            },
            update: {
                limitAmount: budget.limitAmount
            },
            create: {
                userId: budget.userId,
                category: budget.category,
                limitAmount: budget.limitAmount,
                month: budget.month
            }
        });
        return {
            id: dbBudget.id,
            userId: dbBudget.userId,
            category: dbBudget.category,
            limitAmount: Number(dbBudget.limitAmount),
            month: dbBudget.month
        };
    }
    async updateBudget(id, userId, data) {
        const updateData = {};
        if (data.limitAmount !== undefined)
            updateData.limitAmount = data.limitAmount;
        if (data.category !== undefined)
            updateData.category = data.category;
        if (data.month !== undefined)
            updateData.month = data.month;
        try {
            const dbBudget = await this.prisma.budget.update({
                where: { id, userId },
                data: updateData
            });
            return {
                id: dbBudget.id,
                userId: dbBudget.userId,
                category: dbBudget.category,
                limitAmount: Number(dbBudget.limitAmount),
                month: dbBudget.month
            };
        }
        catch {
            return null;
        }
    }
    async deleteBudget(id, userId) {
        try {
            await this.prisma.budget.delete({
                where: { id, userId }
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async getGoals(userId) {
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
    async createGoal(goal) {
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
    async updateGoal(id, userId, data) {
        const updateData = {};
        if (data.title !== undefined)
            updateData.title = data.title;
        if (data.targetAmount !== undefined)
            updateData.targetAmount = data.targetAmount;
        if (data.currentAmount !== undefined)
            updateData.currentAmount = data.currentAmount;
        if (data.targetDate !== undefined)
            updateData.targetDate = new Date(data.targetDate);
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
        }
        catch {
            return null;
        }
    }
    async deleteGoal(id, userId) {
        try {
            await this.prisma.goal.delete({
                where: { id, userId }
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async getInvestments(userId) {
        const list = await this.prisma.investment.findMany({
            where: { userId }
        });
        return list.map((item) => ({
            id: item.id,
            userId: item.userId,
            assetType: toTSInvestmentType(item.assetType),
            name: item.name,
            investedAmount: Number(item.investedAmount),
            currentValue: Number(item.currentValue)
        }));
    }
    async createInvestment(investment) {
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
            assetType: toTSInvestmentType(dbInvestment.assetType),
            name: dbInvestment.name,
            investedAmount: Number(dbInvestment.investedAmount),
            currentValue: Number(dbInvestment.currentValue)
        };
    }
    async updateInvestment(id, userId, data) {
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.assetType !== undefined)
            updateData.assetType = toPrismaInvestmentType(data.assetType);
        if (data.investedAmount !== undefined)
            updateData.investedAmount = data.investedAmount;
        if (data.currentValue !== undefined)
            updateData.currentValue = data.currentValue;
        try {
            const dbInvestment = await this.prisma.investment.update({
                where: { id, userId },
                data: updateData
            });
            return {
                id: dbInvestment.id,
                userId: dbInvestment.userId,
                assetType: toTSInvestmentType(dbInvestment.assetType),
                name: dbInvestment.name,
                investedAmount: Number(dbInvestment.investedAmount),
                currentValue: Number(dbInvestment.currentValue)
            };
        }
        catch {
            return null;
        }
    }
    async deleteInvestment(id, userId) {
        try {
            await this.prisma.investment.delete({
                where: { id, userId }
            });
            return true;
        }
        catch {
            return false;
        }
    }
    async getCreditProfile(userId) {
        const dbProfile = await this.prisma.creditProfile.findUnique({
            where: { userId }
        });
        if (!dbProfile)
            return null;
        return {
            id: dbProfile.id,
            userId: dbProfile.userId,
            utilization: Number(dbProfile.utilization),
            paymentHistory: Number(dbProfile.paymentHistory),
            creditAge: Number(dbProfile.creditAge)
        };
    }
    async upsertCreditProfile(userId, data) {
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
    async updateUser(id, data) {
        try {
            const updateData = {};
            if (data.name !== undefined)
                updateData.name = data.name;
            if (data.email !== undefined)
                updateData.email = data.email.toLowerCase();
            if (data.monthlyIncome !== undefined)
                updateData.monthlyIncome = data.monthlyIncome;
            const user = await this.prisma.user.update({
                where: { id },
                data: updateData
            });
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                monthlyIncome: Number(user.monthlyIncome),
                passwordHash: user.passwordHash,
                createdAt: user.createdAt.toISOString()
            };
        }
        catch {
            return null;
        }
    }
    async getKhataContacts(userId) {
        const list = await this.prisma.khataContact.findMany({
            where: { userId },
            include: { entries: { orderBy: { createdAt: "desc" } } }
        });
        return list.map((item) => ({
            id: item.id,
            userId: item.userId,
            name: item.name,
            type: item.type,
            amount: Number(item.amount),
            lastActive: item.lastActive,
            entries: item.entries.map((e) => ({
                id: e.id,
                contactId: e.contactId,
                type: e.type,
                amount: Number(e.amount),
                remarks: e.remarks,
                date: formatDate(e.date)
            }))
        }));
    }
    async createKhataContact(userId, data) {
        const dbContact = await this.prisma.khataContact.create({
            data: {
                userId,
                name: data.name,
                type: data.type,
                amount: 0,
                lastActive: "Created now"
            }
        });
        return {
            id: dbContact.id,
            userId: dbContact.userId,
            name: dbContact.name,
            type: dbContact.type,
            amount: Number(dbContact.amount),
            lastActive: dbContact.lastActive,
            entries: []
        };
    }
    async createKhataEntry(contactId, data) {
        const contact = await this.prisma.khataContact.findUnique({
            where: { id: contactId }
        });
        if (!contact)
            throw new Error("Contact not found");
        const dbEntry = await this.prisma.khataEntry.create({
            data: {
                contactId,
                type: data.type,
                amount: data.amount,
                remarks: data.remarks
            }
        });
        let finalAmount = Number(contact.amount);
        let finalType = contact.type;
        if (finalType === data.type) {
            finalAmount += data.amount;
        }
        else {
            finalAmount -= data.amount;
            if (finalAmount < 0) {
                finalType = finalType === "get" ? "give" : "get";
                finalAmount = Math.abs(finalAmount);
            }
        }
        await this.prisma.khataContact.update({
            where: { id: contactId },
            data: {
                amount: finalAmount,
                type: finalType,
                lastActive: "Just now"
            }
        });
        return {
            id: dbEntry.id,
            contactId: dbEntry.contactId,
            type: dbEntry.type,
            amount: Number(dbEntry.amount),
            remarks: dbEntry.remarks,
            date: formatDate(dbEntry.date)
        };
    }
    async settleKhataContact(contactId, userId) {
        try {
            const contact = await this.prisma.khataContact.findUnique({
                where: { id: contactId }
            });
            if (!contact || contact.userId !== userId)
                return false;
            await this.prisma.khataEntry.deleteMany({
                where: { contactId }
            });
            await this.prisma.khataContact.update({
                where: { id: contactId },
                data: {
                    amount: 0,
                    lastActive: "Settled up just now"
                }
            });
            return true;
        }
        catch {
            return false;
        }
    }
}
