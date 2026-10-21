# LeadTrack AI – Intelligent Lead Management for Educational Institutions

> **Admissions CRM & Student Intent Intelligence Platform Supporting UN SDG 4 (Quality Education & Inclusive Learning Opportunities)**

---

## 🌟 Executive Summary

**LeadTrack AI** is an enterprise-grade admissions management and student lead conversion CRM built for colleges, universities, and polytechnics. It bridges the gap between top-of-funnel student inquiries and verified enrollments by combining:
- **0–100 Weighted AI Lead Intent Scoring** (Source authority, counselor touchpoint velocity, program demand, profile completeness, and recency)
- **Omnichannel Student Inquiry Capture** with real-time duplicate phone/email detection and automated assignment
- **Interactive Admissions Kanban Pipeline** (New → Contacted → Interested → Campus Visit → Application Submitted → Admitted → Lost)
- **Counselor Follow-up Queue & SLA Reminders**
- **Autonomous SLA Workflow Automation Engine** with manual live trigger capability
- **Marketing Channel Acquisition ROI Analysis & Counselor Conversion Benchmarks**
- **Dynamic Variable Communication Templates (Email & WhatsApp)** with real-time recipient preview
- **Interactive AI Admissions Advisor** answering real-time pipeline queries

---

## 🛠 Tech Stack Architecture

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14+ (App Router, Server Actions, Route Handlers) |
| **Language** | TypeScript 5 (Strict mode) |
| **Styling & Design** | Tailwind CSS, Glassmorphism, CSS Variables, Plus Jakarta Sans & Inter |
| **Database & ORM** | SQLite (`file:./dev.db`) for zero-config local run, switchable to PostgreSQL (Neon / Supabase) via Prisma ORM |
| **Drag & Drop** | `@dnd-kit/core` for Kanban admissions pipeline |
| **Charts & Heatmaps** | Recharts (Area, Bar, Donut, Funnel, Custom Engagement Heatmap) |
| **Spreadsheets & Reports**| `xlsx` (Excel / CSV export & import validation) |
| **Security & Auth** | JWT sessions in httpOnly cookies, bcryptjs password hashing, role-based authorization (ADMIN, MANAGER, COUNSELOR) |
| **Communications** | Nodemailer with SMTP integration & robust mock console logger |
| **Celebrations** | `canvas-confetti` for enquiry completions |

---

## ⚡ Quick Start & Run Locally

### 1. Prerequisites
- Node.js 18+ or 22+
- npm or pnpm

### 2. Installation
```bash
# Clone or navigate into directory
cd "lead AI"

# Install dependencies
npm install
```

### 3. Database Initialization
```bash
# Push Prisma schema to local database
npx prisma db push

# Seed 155+ realistic student leads, courses, automations & staff
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🔑 Pre-Configured Demo Accounts

| Role | Email | Password | Access Scope |
|---|---|---|---|
| **Administrator / Dean** | `admin@leadtrack.ai` | `Admin@123` | Full system access, Audit logs, Financial ROI, Team management |
| **Admissions Counselor** | `counselor.priya@leadtrack.ai` | `Priya@123` | Assigned lead queue, follow-ups, call logger |
| **Admissions Counselor** | `counselor.rahul@leadtrack.ai` | `Rahul@123` | Assigned lead queue, follow-ups, call logger |
| **Admissions Manager** | `manager.anita@leadtrack.ai` | `Counselor@123` | Counselor oversight, pipeline analytics |

> **Tip:** You can also use the 1-Click quick sign-in buttons on the `/login` screen to sign in instantly as any role!

---

## 🧭 Page Sitemap (All 18 Production Pages)

1. **`/`** — Ultra-Premium Landing Page (Hero, Features, How It Works, Stats Counters, UN SDG 4 section, FAQ, CTA)
2. **`/login`** — Split-screen authentication with 1-click demo filler buttons, remember me, show/hide password
3. **`/register`** — Institutional onboarding with role picker and password strength meter
4. **`/forgot-password`** — Password reset link dispatcher with expiry tokens
5. **`/reset-password`** — Secure password update with token validation
6. **`/enquire`** — Public embeddable Student Enquiry Form with duplicate detection and confetti celebration
7. **`/dashboard`** — Executive Command Center (6 KPIs with sparklines, Area Chart, Bar Chart, Funnel, Donut, Heatmap, Today's Follow-ups)
8. **`/leads`** — Advanced Leads Registry (Search, 6 multi-filters, sorting, pagination, column toggles, CSV import modal, Excel export)
9. **`/leads/[id]`** — Complete Student Dossier (Score gauge, Next Best Action, Pipeline stepper, Timeline, Notes, Documents, 1-Click Email/WhatsApp/Call, Deduplication merge)
10. **`/pipeline`** — Drag & drop Kanban Board syncing database status in real-time
11. **`/follow-ups`** — Counselor task queue with Overdue, Today, Upcoming tabs, calendar timeline, task resolver and reschedule
12. **`/automation`** — Workflow Rule Builder with live execution audit history and "Run Automation Engine Now" button
13. **`/templates`** — Standardized Email & WhatsApp templates with live dynamic variable interpolation preview
14. **`/analytics`** — Deep Source ROI, counselor conversion leaderboards, program seat fulfillment, and CSV/PDF export
15. **`/team`** — Counselor roster with workload counters, role modifier, and account provisioning
16. **`/settings`** — Institution campus profile, degree program CRUD, and scoring engine weights
17. **`/notifications`** — Centralized alert inbox with unread filters and quick navigation
18. **`/audit-logs`** — Administrative compliance trail tracking user actions, IP addresses, and timestamps

---

## 🌐 Deploying to Production (Vercel + Neon / Supabase)

To deploy to Vercel with PostgreSQL:
1. In `prisma/schema.prisma`, update the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set your `DATABASE_URL` in your Vercel project environment variables to your Neon or Supabase connection string:
   ```env
   DATABASE_URL="postgresql://user:password@ep-host.neon.tech/leadtrack?sslmode=require"
   JWT_SECRET="your-production-secret-min-32-chars"
   NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
   ```
3. Run `npx prisma db push && npx tsx prisma/seed.ts` on the production database.

---

## 📜 UN SDG 4 Alignment

LeadTrack AI is purposefully designed to advance **UN Sustainable Development Goal 4 (Quality Education)**:
- **Target 4.3 (Equal Access to Affordable Higher Education):** Transparent, objective AI scoring eliminates subjective bias.
- **Timely Information:** Automated merit scholarship broadcasts prevent deserving students from missing financial aid.
- **Zero Lost Inquiries:** Automated SLA workflows guarantee every student query receives structured guidance.

---
© LeadTrack AI. Built for institutions shaping the future of education.
