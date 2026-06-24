# Deployment Guide

## Frontend: Vercel

1. Set project root to `apps/web`.
2. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://<render-api-host>/api`
3. Build command: `npm run build -w @finsphere/web`
4. Output: Next.js default.

## Backend: Render

1. Create a Node web service from the repo.
2. Build command:
   - `npm install && npm run build -w @finsphere/shared && npm run build -w @finsphere/api`
3. Start command:
   - `npm run start -w @finsphere/api`
4. Environment:
   - `PORT=4000`
   - `JWT_SECRET=<long-random-secret>`
   - `DATABASE_URL=<supabase-postgres-url>`

## Database: Supabase

1. Create a Supabase PostgreSQL project.
2. Copy the connection string to `DATABASE_URL`.
3. Run:
   - `npm run db:generate`
   - `npm run db:migrate`
   - `npm run db:seed`

## Production Hardening

- Replace the MVP in-memory API store with Prisma repository calls.
- Move JWT from local storage to secure HTTP-only cookies.
- Add rate limiting and structured request logging.
- Add CI jobs for lint, typecheck, unit tests, and Playwright smoke tests.
