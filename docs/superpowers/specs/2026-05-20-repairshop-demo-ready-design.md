# Repairshop — Demo-Ready Portfolio Upgrade

**Date:** 2026-05-20  
**Status:** Approved  
**Project:** `E:/Users/nick_/Documents/Cursos/repairshop`  
**Live URL:** https://repairshop-puce.vercel.app/

---

## Goal

Transform repairshop from a course exercise into a professional portfolio showcase. Any visitor (client or recruiter) should be able to try a fully-populated demo in one click — without registering.

---

## Decisions Made

| Decision | Choice | Rationale |
|---|---|---|
| Demo mechanism | Banner + credentials + Kinde login_hint | Balance between simplicity and UX — visitor sees credentials (transparency) + one click to pre-filled login |
| Seed data volume | Realistic (B) | 25 customers, 40 tickets, $4.8k revenue — enough to make the dashboard feel alive |
| Landing direction | Clean Business | White background, corporate blue `#1e40af` — appeals to business clients |
| Banner placement | Fixed top bar | Always visible, impossible to miss |
| Auto-reset | Out of scope | Can be added later if demo data gets corrupted |

---

## Architecture

### Files Changed

| File | Action | Description |
|---|---|---|
| `src/app/page.tsx` | Rewrite | New Clean Business landing |
| `src/components/DemoBar.tsx` | Create | Fixed top bar with demo credentials |
| `src/app/layout.tsx` | Modify | Add `<DemoBar />` above everything |
| `src/db/seed.ts` | Create | Idempotent seed script using faker |
| `README.md` | Rewrite | Professional — description, features, local setup |
| `package.json` | Modify | Add `@faker-js/faker` dev dep + `"seed"` script |

### No new routes, no auth changes, no DB schema changes.

---

## Section 1: Landing Page (Clean Business)

**Layout structure:**
```
[DemoBar — fixed top, blue #1e40af]
──────────────────────────────────
[Nav: Logo left | Login button right]
[Hero: H1 + subtitle + primary CTA "Ver Demo" → links to Kinde login URL with login_hint]
[Stats bar: 25 customers · 40 tickets · $4,820 revenue]
[Features grid: 3 cols — Customer Management / Ticket Tracking / Analytics]
[Footer: built by Nick Granados + tech stack badges]
```

**Design tokens:**
- Background: `#f8fafc` (slate-50)
- Primary: `#1e40af` (blue-800)
- Accent: `#3b82f6` (blue-500)
- Text: `#0f172a` (slate-900)
- Font: Geist (already installed)

**Business name kept as-is:** "Francisco Computer Repair Shop" — it's the fictional demo business.

---

## Section 2: DemoBar Component

**File:** `src/components/DemoBar.tsx`

**Markup:**
```
┌─────────────────────────────────────────────────────────────────┐
│ 🎯 Demo disponible — Probá la app sin registrarte               │
│  📧 demo@repairshop.com   🔑 demo1234   [Entrar al Demo →]  [X] │
└─────────────────────────────────────────────────────────────────┘
```

**Behavior:**
- Fixed position, `z-50`, blue `#1e40af` background, white text
- "Entrar al Demo →" button links to Kinde login URL with `?login_hint=demo@repairshop.com` query param — Kinde pre-fills the email field
- Dismissible with `X` button (sessionStorage key `demo-bar-dismissed`) — dismissed state survives page refresh within the same tab but resets when a new tab or window is opened
- Rendered in `src/app/layout.tsx` as the first child of `<body>`

**Manual step required (done by Nick):** Create user `demo@repairshop.com` / `demo1234` in the Kinde dashboard before deploying.

---

## Section 3: Seed Script

**File:** `src/db/seed.ts`  
**Run:** `npm run seed` (or `npx tsx src/db/seed.ts`)

**Data generated:**

```
Customers: 25
  - firstName, lastName (faker.person)
  - email (faker.internet.email)  
  - phone (faker.phone.number)
  - address: city, state, zip (US format)
  - createdAt: random date within last 6 months

Tickets: 40
  - customerId: randomly assigned from the 25 customers
  - title: one of 8 predefined repair types
    ["Screen Repair", "Battery Replacement", "Virus Removal", 
     "Data Recovery", "Keyboard Fix", "RAM Upgrade", "OS Installation", "General Diagnosis"]
  - status distribution: new (7), in-progress (15), completed (18)
  - device: laptop (40%), desktop (30%), phone (20%), tablet (10%)
  - price: $50–$350 (random, rounded to nearest $10)
  - createdAt: random within last 3 months
  - completedAt: set only for completed tickets

Technicians: 2
  - demo user (demo@repairshop.com) — primary technician (real Kinde user, created manually)
  - "Alex Martinez" — secondary technician (fictional display name only, assigned to some tickets as a string field — no real Kinde account needed)
```

**Idempotent behavior:** Script runs `DELETE FROM tickets; DELETE FROM customers;` before inserting — safe to run multiple times. Produces identical data structure but different faker values each run.

**Package.json addition:**
```json
{
  "devDependencies": {
    "@faker-js/faker": "^9.0.0"
  },
  "scripts": {
    "seed": "npx tsx src/db/seed.ts"
  }
}
```

---

## Section 4: README

**Sections:**
1. Project screenshot (use existing Vercel deployment)
2. Features list (customers, tickets, search, auth, analytics)
3. Tech stack badges (Next.js 15, Kinde, Neon DB, Drizzle, shadcn/ui, Sentry)
4. Demo account credentials (prominent)
5. Local setup (env vars needed, `npm install`, `npm run seed`, `npm run dev`)
6. Built by Nick Granados — link to portfolio

---

## Out of Scope

- Auto-reset cron job (can be added later)
- Dashboard UI improvements
- Changes to ticket/customer flows
- Internationalization

---

## Success Criteria

- [ ] Visitor lands on the page and immediately sees demo credentials
- [ ] One click on "Entrar al Demo →" → Kinde login with email pre-filled
- [ ] After login, dashboard shows populated data (not empty states)
- [ ] `npm run seed` runs without errors and populates Neon DB
- [ ] README describes the project professionally
