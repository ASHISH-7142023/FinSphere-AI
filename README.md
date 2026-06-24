# FinSphere AI

FinSphere AI is a personal finance super-app MVP designed for team development and collaboration.

## Stack

- **Frontend**: Next.js 15, Tailwind CSS, Recharts, React Hook Form, Framer Motion
- **Backend**: Express API, JWT Authentication, Prisma ORM
- **Database**: PostgreSQL / Supabase (with automatic local in-memory fallback)
- **Testing**: Vitest & Playwright

---

## Developer Quick Start

Teammates can choose between two modes for local development.

### Option A: Instant Development Mode (Zero-Config / Mock)
Use this option to start coding immediately. It uses an in-memory repository fallback. No database installation or setup is needed.

1. **Clone the repository** and install dependencies:
   ```bash
   npm install
   ```
2. **Start the application**:
   ```bash
   npm run dev
   ```
   *The console will print a warning indicating that `DATABASE_URL` is not set and the API is falling back to the `InMemoryStore` adapter. You can interact with the app, register new accounts, and perform all actions locally.*

3. **Open the services**:
   - Web App: `http://localhost:3000`
   - Express API: `http://localhost:4000`

4. **Login with the seeded demo account**:
   - **Email**: `demo@finsphere.ai`
   - **Password**: `Demo@12345`

---

### Option B: Real Database Mode (Docker PostgreSQL)
Use this option to test database persistence, runs migrations, and query the real database schemas.

1. **Start the local PostgreSQL container**:
   ```bash
   docker compose up -d postgres
   ```
2. **Create your environment configuration**:
   ```bash
   cp .env.example .env
   ```
   *(Ensure `DATABASE_URL` in `.env` points to your PostgreSQL instance. `.env` is ignored by Git and should never be committed).*
3. **Generate Prisma Client, execute migrations, and seed sample records**:
   ```bash
   npm run db:generate
   ```
   *(If you run migrations for the first time or update the schema):*
   ```bash
   npm run db:migrate
   ```
   *(To seed the DB with initial values):*
   ```bash
   npm run db:seed
   ```
4. **Start the application**:
   ```bash
   npm run dev
   ```
   *The console will print: `Successfully connected to the database. Using PrismaStore.`*

---

## Project Structure

- `apps/web`: Next.js 15 client application.
- `apps/api`: Express backend application with JWT auth and route groups.
- `packages/shared`: Shared TS types, Zod schemas, and budget/health calculation algorithms.
- `packages/db`: Prisma database schemas, migrations, and database seed scripts.

---

## Contribution & Pre-push Checklist

Before pushing changes to GitHub, please run the following commands to ensure clean code:

- **Lint Checks**: Ensure zero formatting/linting warnings:
  ```bash
  npm run lint
  ```
- **Typecheck**: Verify all workspace typings compile correctly:
  ```bash
  npm run typecheck
  ```
- **Run Tests**: Verify unit and integration test suites pass:
  ```bash
  npm run test
  ```
