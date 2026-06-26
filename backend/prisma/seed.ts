import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Start with a clean database.
}

main().finally(async () => {
  await prisma.$disconnect();
});
