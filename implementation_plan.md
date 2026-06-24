# Plan to Replace In-Memory Store with Prisma PostgreSQL Repository

This plan describes how we will transition the Express API from the current mock in-memory store to a production-grade Prisma PostgreSQL repository (targeting Supabase), while preserving a seamless, zero-config local development experience.

## Design Overview

To support both the quick-start local demo (in-memory) and production (PostgreSQL/Supabase), we will introduce a repository abstraction:

1. **`IStore` Interface**: Defines the contract for all data operations (users, expenses, budgets, goals, investments, credit profiles).
2. **`InMemoryStore`**: An implementation of `IStore` using the current local memory array, used as a fallback.
3. **`PrismaStore`**: An implementation of `IStore` using Prisma Client to execute queries against the PostgreSQL/Supabase database.
4. **Environment Check**:
   - If `DATABASE_URL` is present in the environment/`.env` file, the server launches with `PrismaStore`.
   - If `DATABASE_URL` is missing, it falls back to `InMemoryStore`, meaning judges and developers can still run the app instantly using `npm run dev`.

---

## User Review Required

> [!IMPORTANT]
> The database schema uses slightly different naming conventions for categories (e.g., `MutualFund` in the schema vs `"Mutual Fund"` with a space in the typescript frontend).
> We will handle the type mapping transparently inside `PrismaStore` to avoid modifying the frontend app or public API contracts.

> [!NOTE]
> Database `Decimal` types returned by Prisma will be converted to standard Javascript `number` values in `PrismaStore` to align with the frontend types.

---

## Proposed Changes

### Component: Shared & API Repository

#### [NEW] [store.interface.ts](file:///d:/ASHISH%20GITHUB/FinSphere-AI/apps/api/src/store.interface.ts)
Create a unified async store interface:
```typescript
import type { Budget, CreditProfile, Expense, Goal, Investment, User } from "@finsphere/shared";

export interface StoredUser extends User {
  passwordHash: string;
}

export interface IStore {
  // Users
  getUserByEmail(email: string): Promise<StoredUser | null>;
  getUserById(id: string): Promise<StoredUser | null>;
  createUser(user: Omit<StoredUser, "createdAt">): Promise<StoredUser>;

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
}
```

#### [NEW] [store-inmemory.ts](file:///d:/ASHISH%20GITHUB/FinSphere-AI/apps/api/src/store-inmemory.ts)
Extract the current in-memory store implementation from `store.ts` into a separate file that implements `IStore`:
- Implement all data access functions asynchronously.
- Seed default user (`demo@finsphere.ai`) and sample data on initialization.

#### [NEW] [store-prisma.ts](file:///d:/ASHISH%20GITHUB/FinSphere-AI/apps/api/src/store-prisma.ts)
Implement `PrismaStore` using the generated Prisma Client:
- Import `PrismaClient` from `@prisma/client`.
- Convert Prisma enums to TS values and back (e.g. `MutualFund` <-> `Mutual Fund`).
- Map PostgreSQL `Decimal` types to javascript numbers using `Number()`.
- Map `DateTime` values to `YYYY-MM-DD` strings for frontend compatibility.

#### [DELETE] [store.ts](file:///d:/ASHISH%20GITHUB/FinSphere-AI/apps/api/src/store.ts)
Remove the old mock store implementation to clean up the codebase.

#### [MODIFY] [auth.ts](file:///d:/ASHISH%20GITHUB/FinSphere-AI/apps/api/src/auth.ts)
- Modify `authMiddleware` signature to take `IStore` instead of `Store`.
- Update `store.users.find(...)` to call `await store.getUserById(userId)`.

#### [MODIFY] [app.ts](file:///d:/ASHISH%20GITHUB/FinSphere-AI/apps/api/src/app.ts)
- Update `createApp(store: IStore)` to support the new `IStore` async interface.
- Convert all route handlers to be asynchronous and await repository calls.
- Simplify update and delete endpoints by delegating search and save operations directly to the store repository.

#### [MODIFY] [server.ts](file:///d:/ASHISH%20GITHUB/FinSphere-AI/apps/api/src/server.ts)
- Inspect `process.env.DATABASE_URL`.
- If set, instantiate `PrismaStore` and pass it to `createApp`.
- Otherwise, log a warning and fallback to `InMemoryStore`.

#### [MODIFY] [app.test.ts](file:///d:/ASHISH%20GITHUB/FinSphere-AI/apps/api/src/app.test.ts)
- Pass a clean instance of `InMemoryStore` to `createApp` for tests.

---

## Verification Plan

### Automated Tests
We will run:
- `npm run lint` (To ensure typescript/eslint compliance)
- `npm run typecheck` (To make sure typings match up)
- `npm run test` (To verify that the Express app works correctly with the new `InMemoryStore` adapter)

### Manual Verification
- We will verify that local dev mode starts up with the fallback in-memory store and is accessible via the web app.
