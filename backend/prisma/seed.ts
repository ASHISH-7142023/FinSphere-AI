import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Demo@12345", 10);
  const user = await prisma.user.upsert({
    where: { email: "demo@finsphere.ai" },
    update: {},
    create: {
      name: "Siddharth Verma",
      email: "demo@finsphere.ai",
      passwordHash,
      monthlyIncome: 150000
    }
  });

  await prisma.expense.createMany({
    data: [
      { userId: user.id, amount: 4200, category: "Food", description: "Client dinner", date: new Date("2026-06-02") },
      { userId: user.id, amount: 9200, category: "Travel", description: "Airport and rides", date: new Date("2026-06-08") },
      { userId: user.id, amount: 12500, category: "Shopping", description: "Work setup", date: new Date("2026-06-12") },
      { userId: user.id, amount: 7800, category: "Bills", description: "Utilities", date: new Date("2026-06-15") }
    ],
    skipDuplicates: true
  });

  await prisma.budget.createMany({
    data: [
      { userId: user.id, category: "Food", limitAmount: 18000, month: "2026-06" },
      { userId: user.id, category: "Travel", limitAmount: 12000, month: "2026-06" },
      { userId: user.id, category: "Shopping", limitAmount: 10000, month: "2026-06" },
      { userId: user.id, category: "Bills", limitAmount: 15000, month: "2026-06" }
    ],
    skipDuplicates: true
  });

  await prisma.goal.create({
    data: {
      userId: user.id,
      title: "Emergency Fund",
      targetAmount: 600000,
      currentAmount: 245000,
      targetDate: new Date("2026-12-31")
    }
  });

  await prisma.investment.createMany({
    data: [
      { userId: user.id, assetType: "Stock", name: "NIFTY 50 ETF", investedAmount: 160000, currentValue: 184500 },
      { userId: user.id, assetType: "MutualFund", name: "Flexi Cap Fund", investedAmount: 220000, currentValue: 247800 },
      { userId: user.id, assetType: "SIP", name: "Monthly SIP Basket", investedAmount: 90000, currentValue: 96500 }
    ]
  });

  await prisma.creditProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id, utilization: 24, paymentHistory: 98, creditAge: 6 }
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
