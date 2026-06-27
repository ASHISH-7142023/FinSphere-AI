# FinSphere AI Super App - Documentation

FinSphere AI is a premium, cinematic personal finance super-app MVP built with high-fidelity glassmorphism, responsive elements, and interactive AI simulators. 

---

## 🚀 Key Feature Updates & Enhancements

Over the course of the project, we implemented several major feature updates:

1. **Credit Score Engine & Simulator**:
   - Built a custom, interactive scoring gauge utilizing SVG circular paths.
   - Added dynamic sliders to simulate paying off debt, mortgage hard inquiries, and credit limit increases.
   - Included a credit repair checklist that updates scores dynamically, and a simulated SQLite saving log.
2. **Dedicated Login & Registration Flow**:
   - Replaced registration popup modals with a dedicated split Auth page.
   - Built a custom **Google Account Chooser** modal and **Sign-in with Apple ID** prompt to simulate custom or preset user profiles.
3. **Sidebar Resizing & Drag Handle Merger**:
   - Merged sidebar resizing logic with a custom-styled mint-green scrollbar handle.
   - Bound typography scales, button margins, and layout offsets to adapt proportionally to dragging widths (200px to 450px).
4. **Dynamic SVG Forecasting Timeline**:
   - Enabled select options for 5-Year and 10-Year forecasts (mapping up to 2033) with smooth SVG Bezier curve path transformations.
5. **Mobile Responsiveness**:
   - Programmed dynamic window resize hooks to collapse margins and offsets automatically on mobile viewports.
   - Created mobile headers and sliding menu drawers.
6. **Full-Length Layout Stretching**:
   - Expanded the **AI Advisor Chat** to occupy the full canvas width and vertical viewport height.
   - Removed bounds on the **AI Engine Neural Pulse** container to show its parameters in full.
7. **Connected Institutions & Settings**:
   - Built the connected institutions ledger showing sync status loops, refreshes, and delete hooks.
   - Created the Settings Panel to manage profile details, theme visual palettes, notification rules, and sandbox REST credentials.

---

## 📂 Page-by-Page Feature Tour

### 1. Landing Page (Home)
- **Purpose**: High-impact brand introduction with glassmorphic designs, floating particles, and particle orbs.
- **Features**:
  - *Dynamic Underlines*: Highlights active menu items (Home, Features, AI Engine, Pricing) based on the scroll position.
  - *Hero Call-to-Actions*: Reroutes users to registration and watch-demo streams.
  - *AI Engine Neural Pulse*: Showcases mock data feeds, performance metrics, and forecast lines.
  - *Legal Footers*: Renders simulated alert dialogues on clicking privacy policies or terms of services.

### 2. Authentication Center (/login)
- **Purpose**: Secure split-card login interface.
- **Features**:
  - *Suspense-bound signup*: Detects query parameters (`?signup=true`) to open the register card.
  - *Google & Apple Sign-In Simulator*: Lets users select preset accounts or input custom names/emails to log in.
  - *Visual Backdrop*: Combines blurred background overlays of the `public/screen.png` fintech hero visual.

### 3. Workspace Dashboard (Overview)
- **Purpose**: Unified cockpit detailing financial health.
- **Features**:
  - *Financial Metrics*: Displays total asset values, monthly expense tracks, active budget parameters, and savings goals.
  - *Connected Feeds*: Details transaction histories, category spend metrics, and bank indicators.

### 4. AI Advisor Chat
- **Purpose**: Contextual personal finance chat assistant.
- **Features**:
  - *Full Canvas Layout*: Stretches to the maximum width and vertical heights (`h-[calc(100vh-10rem)]`).
  - *Contextual Prompts*: Provides quick options (e.g. auto-balancing tax advice, debt consolidation).

### 5. Utilities Hub
- **Purpose**: Bill payment simulator.
- **Features**:
  - *Payment Categories*: Tab selectors for Mobile, Electricity, Water, Gas, DTH, and Fastag.
  - *UPI QR Code Simulator*: Displays personalized QR codes and copies virtual payment addresses (VPAs) to clipboard.

### 6. Credit Card Bill Center
- **Purpose**: Dues and optimization ledger.
- **Features**:
  - *Outstanding Balance Cards*: Highlights card status (HDFC Regalia, Amex Platinum) with Pay Full and Pay Minimum buttons.
  - *Optimal Card Routing*: Suggests card swaps (e.g. routing grocery spend to Amex for 5x multiplier points).

### 7. Credit Engine & Simulator
- **Purpose**: Score analysis and sandbox events calculator.
- **Features**:
  - *Interactive checklist*: Toggles tasks to boost credit scores.
  - *Simulated inquiries*: Tracks credit inquiries, auto loans, and mortgage request points.

### 8. Investments & Sparklines
- **Purpose**: Performance and stock tracker.
- **Features**:
  - *Smooth Sparkline Wave*: A tall, custom cubic Bezier performance wave (`h-28`) that displays valuations without edge clipping.
  - *Stock Holding Records*: Displays mock stock performance, returns, and category classifications.

### 9. Mutual Fund Portfolio
- **Purpose**: Fund allocation and rebalance dashboard.
- **Features**:
  - *AI Rebalance Advisor*: Displays tech vs debt allocations and rebalances portfolios dynamically.
  - *Thematic Funds*: Displays high-yield opportunities (NextGen AI, Green Energy, Urban REITs) with detail alerts.

### 10. SIP Setup
- **Purpose**: Configures automated monthly investment goals.
- **Features**: Calculates expected future values based on interest multipliers and locks simulated deposits.

### 11. Insurance Hub
- **Purpose**: Unified coverage portfolio.
- **Features**:
  - *Filing Claims*: An interactive modal form to file claims.
  - *Premium Calculator*: Selects sum assured, smoking habits, and age ranges to compute monthly dues.

### 12. Merchant Khata
- **Purpose**: Small business digital ledger.
- **Features**: Renders transactions, invoice creations, and payment link simulators.

### 13. Rewards & Offers
- **Purpose**: FinSphere Coin conversion center.
- **Features**:
  - *Coin Converters*: Redeems loyalty coins for asset credits.
  - *Milestone Trackers*: Displays referral progress bars.

### 14. Reports & Charts
- **Purpose**: Analytical charts view.
- **Features**: Renders custom monthly and category charts via Recharts layouts.

### 15. Settings View
- **Purpose**: User configurations and personalization.
- **Features**:
  - *Profile Editing*: Edit profile details (name, email, phone) via modal forms.
  - *System Prefs*: Adjusts base currencies, visual theme templates, and monthly limits.
  - *Developer Access*: Copyable developer key generator, sandbox credentials, and two-factor toggles.

---

## 🛠️ Stack & Execution

- **Frontend**: Next.js 15, Tailwind CSS, Recharts, Framer Motion
- **Backend**: Express API, JWT Authentication, Prisma ORM
- **Database**: PostgreSQL (Prisma Store) / InMemoryStore local fallback

### Run Locally:
```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```
- Frontend: `http://localhost:3000`
- API: `http://localhost:4000`
- Seed Account: `demo@finsphere.ai` / `Demo@12345`
