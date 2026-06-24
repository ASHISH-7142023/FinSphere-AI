# FinSphere AI

FinSphere AI is a personal finance super-app MVP built from the Stitch visual reference bundle in `stitch_finsphere_ai_super_app_ALL_FINAL`.

## Stack

- Next.js 15, TypeScript, Tailwind CSS, Recharts, React Hook Form, Zod
- Express API with JWT authentication
- Prisma schema for PostgreSQL/Supabase
- Vitest and Playwright

## Quick Start

```bash
npm install
npm run dev
```

Web: `http://localhost:3000`  
API: `http://localhost:4000`

Demo account:

- Email: `demo@finsphere.ai`
- Password: `Demo@12345`

## Database

The API ships with a seeded in-memory repository so the MVP can be demoed immediately. Prisma is configured for PostgreSQL/Supabase:

```bash
cp .env.example .env
npm run db:generate
npm run db:migrate
npm run db:seed
```

## Project Structure

- `apps/web`: Next.js app
- `apps/api`: Express API
- `packages/shared`: validation schemas, types, finance calculations
- `packages/db`: Prisma schema and seed script
- `docs`: architecture, API contracts, deployment guide, reports
- `src/design-system`: design token reference extracted from Stitch
