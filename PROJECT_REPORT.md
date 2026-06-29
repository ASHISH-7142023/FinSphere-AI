# FinSphere AI Super App: Comprehensive Project Report & Resource Allocation

## 1. Executive Summary

**FinSphere AI** is an institutional-grade, cinematic personal finance super-app. Designed as a high-fidelity MVP (Minimum Viable Product), it showcases cutting-edge visual techniques including glassmorphic layouts, dynamic 3D WebGL visualizations, and responsive dashboard layouts integrated with context-aware AI simulation widgets. 

### Core Business Objectives:
*   **Engagement**: Retain users through dynamic UI/UX, mouse-reactive 3D assets, and customized SVG metrics.
*   **Integration**: Seamlessly synchronize credit cards, bank accounts, investments, and business ledgers into a single unified workspace.
*   **Intelligence**: Provide real-time financial suggestions via an interactive AI Chat Advisor and smart rebalancing engines.
*   **Scale**: Maintain a high-performance system by decoupling Next.js 15 App router frontend from a highly scalable Node.js/Express API connected to PostgreSQL via Prisma ORM.

---

## 2. Technology Stack & Architecture

The application is engineered as a modern monorepo workspace divided into two core segments:

### Frontend Client (`/frontend`)
*   **Core Framework**: Next.js 15 (App Router) & React 19 (TypeScript)
*   **Design & Theme**: Vanilla CSS with custom token systems, integrated with Tailwind CSS for glassmorphic elements.
*   **3D Elements**: Three.js (WebGL renderer) for mouse-reactive interactive canvases.
*   **Graphs**: Recharts for custom SVG Bézier curve rendering.
*   **Animations**: Framer Motion for smooth, hardware-accelerated drawer transitions and page transitions.

### Backend Services (`/backend`)
*   **Runtime & Framework**: Node.js, Express, TypeScript.
*   **Database & ORM**: PostgreSQL (primary database) managed via Prisma ORM.
*   **Authentication**: JSON Web Token (JWT) secure authorization loops.

```mermaid
graph TD
    subgraph Client Layer (Frontend)
        Client[Next.js 15 Web Client]
        WebGL[Three.js WebGL 3D Hero]
        Framer[Framer Motion & Vanilla CSS]
        Charts[Recharts Custom SVGs]
    end

    subgraph API & Logic Layer (Backend)
        Express[Node.js / Express Server]
        JWT[JWT Authentication Guard]
        Router[Router Engine & Simulators]
    end

    subgraph Data & Storage Layer
        Prisma[Prisma ORM]
        Postgres[(PostgreSQL Database)]
    end

    Client -->|HTTPS / REST API| Express
    Express --> JWT
    Express --> Router
    Router --> Prisma
    Prisma --> Postgres
    WebGL -.-> Client
    Charts -.-> Client
    Framer -.-> Client
```

---

## 3. Team Structure & Roles (15 Members)

To achieve maximum efficiency, the 15-person team is divided into cross-functional roles. **Ashish** serves as the Project Lead and Solutions Architect, orchestrating overall integration, review, and architectural governance.

| Name | Role | Core Domain Focus |
| :--- | :--- | :--- |
| **Ashish** | **Project Lead & Solutions Architect** | Architecture, Schema Design, System Integration, Code Review |
| **Liam Davies** | Senior Frontend Developer | Hero WebGL, Landing Layout, Pricing Toggle Mechanics |
| **Olivia Taylor** | Frontend Developer | Auth Gates, Core Workspace Dashboard Shell |
| **Noah Wilson** | Frontend Developer | Full-Height AI Chat Advisor & Prompt Overlays |
| **Ava Thomas** | Frontend Developer | Utilities Hub, Bill tab panels, UPI QR simulator |
| **Lucas Martinez** | Frontend Developer | Credit Card Bill Center, SVG score gauges, Credit Engine |
| **Isabella Anderson** | Frontend Developer | Mutual Funds / SIP UI, Insurance Hub (Forms & sliders) |
| **Sophia White** | Frontend Developer | Merchant Khata UI, Settings / Profile Forms UI |
| **James Jackson** | Backend Developer | User Accounts, JWT Security Loops, Settings APIs |
| **Benjamin Harris** | Backend Developer | Dashboard overview aggregators, Ledger syncing endpoints |
| **Mia Martin** | Backend Developer | AI Advisor Prompts & Credit simulator event loggers |
| **Charlotte Garcia** | Backend Developer | Mutual Fund (XIRR), Utilities bills, Merchant Khata APIs |
| **William Robinson** | AI/ML Research Engineer | Prompt Context Optimization & AI routing swap advisors |
| **Stephen Strange** | AI/ML Research Engineer | Predictive rebalancing algorithms, Salary scaling analytics |
| **Amelia Clark** | QA / SDET Automation | Automated API contract validations & E2E cypress test suites |
| **Alexander Rodriguez** | DevOps & Cloud Engineer | Supabase/PostgreSQL setups, Docker environments, CI/CD |

---

## 4. Equal Work Distribution Matrix

To ensure fair contribution and parallel development, the feature scope is broken down into exactly 15 equivalent packages.

```mermaid
gantt
    title FinSphere AI Development Timeline (8 Weeks)
    dateFormat  YYYY-MM-DD
    section Phase 1: Foundation
    Arch, Database & Scaffolding     :active, des1, 2026-07-01, 14d
    section Phase 2: Feature Dev
    Core Frontend Pages & API Routes :active, des2, 2026-07-15, 21d
    section Phase 3: AI & Analytics
    AI Prompts & Curve Algorithms    :active, des3, 2026-08-05, 14d
    section Phase 4: Verification
    End-to-End Testing & DevOps Sync :active, des4, 2026-08-19, 7d
```


## 5. RACI Matrix (Responsibility Assignment)

| Project Activity | Ashish | FE Team (2-8) | BE Team (9-12) | AI Team (13-14) | DevOps (15) | QA (14) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **System Architecture** | **A** / R | C | C | I | C | I |
| **Database Schema Design** | **A** / R | I | R | C | C | I |
| **UI Components (Glassmorphism)** | A | **R** | I | I | I | C |
| **API Endpoint Development** | A | C | **R** | C | I | C |
| **AI Routing & Math Models** | A | I | C | **R** | I | I |
| **Database Migrations** | A | I | C | I | **R** | I |
| **E2E Automation Testing** | A | C | C | I | I | **R** / A |
| **Deployment / CI Pipelines** | A | I | I | I | **R** / A | I |

*   **R** - Responsible (does the work)
*   **A** - Accountable (approves/owns the result; Ashish holds overall project accountability)
*   **C** - Consulted (provides input/feedback)
*   **I** - Informed (kept up-to-date on progress)

---

## 6. Communication & Collaboration Protocols

To ensure seamless coordination across a team of 15, the following strict workflow will be enforced:

### 1. Git Workflow & Branching Strategy
*   **Main Branch**: `main` (only holds stable, tested production code).
*   **Development Branch**: `dev` (integration branch for current sprint features).
*   **Feature Branches**: Named as `feature/member-name/description-of-feature` (e.g. `feature/liam/webgl-card`).
*   **Pull Requests (PRs)**:
    *   All PRs must target the `dev` branch.
    *   Must satisfy lint validations and pass unit tests.
    *   Requires approval from **Ashish** (Project Lead) and at least one peer.

### 2. Standups & Progress Checkpoints
*   **Daily Sync (15 mins)**: Text-based slack/teams updates or short standup focusing on:
    1. What did I complete yesterday?
    2. What am I working on today?
    3. Are there any blockers?
*   **Weekly Demo (Saturdays)**: A screen-share session led by **Ashish** demonstrating integrated components.

---

## 7. Quality Assurance & Verification Plan

### Automated Test Strategy
*   **Unit & Component Testing**: Jest (backend controller tests) and React Testing Library (frontend component mounts).
*   **API Verification**: Postman collections mapping auth loops, settings scales, and transaction additions.
*   **E2E Testing**: Cypress/Playwright suites validating user flow: Login -> Dashboard -> Card Center.

### Manual Verification
1.  **Deployment Verification**: Testing the Docker build locally and checking Supabase connectivity.
2.  **Salary-Scaling Visual Check**: Verify that increasing the Monthly Salary in the profile page correctly increases:
    *   Max Card limit by $3.33 \times$ Salary.
    *   Utility bill baseline amounts.
    *   Premium slider starting bounds.
