import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { createApp } from "./app.js";
import { InMemoryStore } from "./store-inmemory.js";
import { PrismaStore } from "./store-prisma.js";

const port = Number(process.env.PORT ?? 4000);

let store;

if (process.env.DATABASE_URL) {
  try {
    const prisma = new PrismaClient();
    // Test database connectivity with a 2-second timeout
    await Promise.race([
      prisma.$connect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Database connection timeout")), 2000))
    ]);
    await prisma.$disconnect();
    
    console.log("Successfully connected to the database. Using PrismaStore.");
    store = new PrismaStore();
  } catch (error) {
    console.warn("WARNING: DATABASE_URL is set but database is not reachable. Falling back to InMemoryStore.");
    store = new InMemoryStore();
  }
} else {
  console.warn("WARNING: DATABASE_URL not set. Falling back to InMemoryStore for development.");
  store = new InMemoryStore();
}

createApp(store).listen(port, () => {
  console.log(`FinSphere API listening on http://localhost:${port}`);
});
