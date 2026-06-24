# FinSphere AI - Technical Architecture & Schema

## 1. Database Schema (PostgreSQL)

### Users Table
- id: UUID (PK)
- email: VARCHAR (Unique)
- password_hash: TEXT
- full_name: VARCHAR
- occupation: VARCHAR
- monthly_income: DECIMAL
- financial_goals: JSONB
- created_at: TIMESTAMP

### Transactions Table
- id: UUID (PK)
- user_id: UUID (FK)
- amount: DECIMAL
- category: ENUM ('Food', 'Travel', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Others')
- merchant: VARCHAR
- description: TEXT
- date: TIMESTAMP
- is_recurring: BOOLEAN
- ai_categorized: BOOLEAN

### Budgets Table
- id: UUID (PK)
- user_id: UUID (FK)
- category: VARCHAR
- limit_amount: DECIMAL
- spent_amount: DECIMAL
- month_year: DATE

### Goals Table
- id: UUID (PK)
- user_id: UUID (FK)
- title: VARCHAR
- target_amount: DECIMAL
- current_amount: DECIMAL
- deadline: DATE
- type: ENUM ('Buy Car', 'Buy House', 'Vacation', 'Emergency Fund', 'Education Fund')

### Investments Table
- id: UUID (PK)
- user_id: UUID (FK)
- asset_type: ENUM ('Stock', 'Mutual Fund', 'SIP')
- ticker: VARCHAR
- quantity: DECIMAL
- avg_price: DECIMAL
- current_price: DECIMAL

## 2. API Architecture (Spring Boot)

### Auth Service
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/otp-verify

### Finance Service
- GET /api/finance/dashboard - Aggregated summary
- GET /api/finance/transactions - List with filters
- POST /api/finance/transactions - Add new
- GET /api/finance/budgets - Progress tracking

### AI Service (Python/Gemini Wrapper)
- POST /api/ai/chat - Advice & recommendations
- GET /api/ai/forecast - Spending predictions
- POST /api/ai/categorize - Transaction classification

## 3. Project Structure (Next.js 15)
/app
  /(auth)
    /login
    /register
  /(dashboard)
    /layout.tsx (Sidebar + Nav)
    /page.tsx (Overview)
    /expenses
    /investments
    /budgets
    /savings
    /ai-advisor
    /credit-score
/components
  /ui (Shadcn)
  /charts (Recharts)
  /dashboard (Cards, KPIs)
  /shared (Modals, Buttons)
/hooks
/lib (utils, api-client)
/store (zustand)
