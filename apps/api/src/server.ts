import "dotenv/config";
import { createApp } from "./app.js";
import { InMemoryStore } from "./store-inmemory.js";
import { PrismaStore } from "./store-prisma.js";

const port = Number(process.env.PORT ?? 4000);

const store = process.env.DATABASE_URL
  ? new PrismaStore()
  : new InMemoryStore();

if (process.env.DATABASE_URL) {
  console.log("FinSphere API starting with PostgreSQL Prisma repository backend.");
} else {
  console.warn("WARNING: DATABASE_URL not set. Falling back to InMemoryStore for development.");
}

createApp(store).listen(port, () => {
  console.log(`FinSphere API listening on http://localhost:${port}`);
});
