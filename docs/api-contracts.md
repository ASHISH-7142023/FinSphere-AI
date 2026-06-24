# API Contracts

Base URL: `/api`

All routes except auth require `Authorization: Bearer <jwt>`.

## Auth

- `POST /auth/register`
  - Body: `{ name, email, password, monthlyIncome }`
  - Response: `{ token, user }`
- `POST /auth/login`
  - Body: `{ email, password }`
  - Response: `{ token, user }`
- `GET /auth/me`
  - Response: `{ user }`

## Dashboard

- `GET /dashboard/summary`
  - Response: totals, savings, budget usage, financial health score/grade, portfolio value, trend, category breakdown, recent transactions.

## Expenses

- `GET /expenses?search=&category=`
- `POST /expenses`
  - Body: `{ amount, category, description, date }`
- `PUT /expenses/:id`
- `DELETE /expenses/:id`

Categories: `Food`, `Travel`, `Shopping`, `Bills`, `Entertainment`, `Education`, `Health`, `Other`.

## Budgets

- `GET /budgets`
  - Response: `{ budgets, budgetUsage, alerts }`
- `POST /budgets`
  - Body: `{ category, limitAmount, month }`
- `PUT /budgets/:id`
- `DELETE /budgets/:id`

## Goals

- `GET /goals`
- `POST /goals`
  - Body: `{ title, targetAmount, currentAmount, targetDate }`
- `PUT /goals/:id`
- `DELETE /goals/:id`

## Investments

- `GET /investments`
- `POST /investments`
  - Body: `{ assetType, name, investedAmount, currentValue }`
- `PUT /investments/:id`
- `DELETE /investments/:id`

Asset types: `Stock`, `Mutual Fund`, `SIP`, `Gold`, `Crypto`, `Other`.

## Credit And Health

- `POST /credit-profile/simulate`
  - Body: `{ utilization, paymentHistory, creditAge }`
  - Response: `{ profile, estimatedScore, recommendations }`
- `GET /financial-health`
  - Response: `{ score, grade, budgetUsage }`

## Reports

- `GET /reports/monthly`
  - Response: monthly income, total expenses, category analysis, expense rows.
