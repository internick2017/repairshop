# Repairshop Demo-Ready Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the repairshop landing page into a professional Clean Business showcase with a visible demo bar, pre-filled Kinde login, and faker-based seed data.

**Architecture:** Four independent changes — (1) DemoBar client component added to root layout, (2) landing page rewritten with Clean Business design, (3) seed-data.ts rewritten with faker and idempotent behavior, (4) README rewritten professionally. No new routes, no schema changes, no auth changes.

**Tech Stack:** Next.js 15, `@kinde-oss/kinde-auth-nextjs` (LoginLink component), `@faker-js/faker` v9, Drizzle ORM, Neon DB, Tailwind CSS, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/DemoBar.tsx` | **Create** | Fixed blue top bar with credentials + Kinde LoginLink |
| `src/app/layout.tsx` | **Modify** | Mount `<DemoBar />` as first child of `<body>` |
| `src/app/page.tsx` | **Rewrite** | Clean Business landing page |
| `src/db/seed-data.ts` | **Rewrite** | Faker-based idempotent seed (25 customers, 40 tickets) |
| `README.md` | **Rewrite** | Professional README with demo credentials |
| `package.json` | **Modify** | Add `@faker-js/faker` to devDependencies |

---

## Task 1: Install @faker-js/faker

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

Run from the repairshop project root:

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
yarn add -D @faker-js/faker
```

Expected: `@faker-js/faker@^9.x.x` appears in `devDependencies` in `package.json`.

- [ ] **Step 2: Verify installation**

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
node -e "const { faker } = require('@faker-js/faker'); console.log(faker.person.firstName())"
```

Expected: prints a first name like `"John"`.

- [ ] **Step 3: Commit**

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
git add package.json yarn.lock
git commit -m "chore: add @faker-js/faker for seed data generation"
```

---

## Task 2: Create DemoBar Component

**Files:**
- Create: `src/components/DemoBar.tsx`

The bar is `'use client'` because it reads `sessionStorage`. It uses `LoginLink` from the Kinde SDK (already installed) with `authUrlParams` to pre-fill the demo email on the Kinde login form.

- [ ] **Step 1: Create the file**

Create `src/components/DemoBar.tsx` with this exact content:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { XIcon } from 'lucide-react'

export function DemoBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('demo-bar-dismissed')
    if (!dismissed) setVisible(true)
  }, [])

  if (!visible) return null

  const dismiss = () => {
    sessionStorage.setItem('demo-bar-dismissed', '1')
    setVisible(false)
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex flex-wrap items-center justify-between gap-2 bg-[#1e40af] px-4 py-3 text-white text-sm">
      <span className="font-medium">
        🎯 Demo disponible — Probá la app sin registrarte
      </span>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="hidden sm:flex items-center gap-3 text-blue-100">
          <span>📧 demo@repairshop.com</span>
          <span>🔑 demo1234</span>
        </span>
        <LoginLink
          authUrlParams={{ login_hint: 'demo@repairshop.com' }}
          className="rounded bg-white px-3 py-1 text-[#1e40af] font-semibold text-sm hover:bg-blue-50 transition-colors whitespace-nowrap"
        >
          Entrar al Demo →
        </LoginLink>
        <button
          onClick={dismiss}
          aria-label="Cerrar banner de demo"
          className="hover:opacity-70 transition-opacity ml-1"
        >
          <XIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
yarn typecheck
```

Expected: no errors. If `LoginLink` props cause a type error, check the installed version: `yarn list @kinde-oss/kinde-auth-nextjs` and look up `authUrlParams` in its types.

- [ ] **Step 3: Commit**

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
git add src/components/DemoBar.tsx
git commit -m "feat: add DemoBar component with Kinde login_hint"
```

---

## Task 3: Mount DemoBar in Root Layout

**Files:**
- Modify: `src/app/layout.tsx`

The bar is `position: fixed; top: 0`, so it overlays content. The landing page will handle its own top padding. The bar is added **before** `<ErrorBoundary>` so it's always in the DOM regardless of errors.

- [ ] **Step 1: Read the current file**

Read `src/app/layout.tsx` to confirm current imports and structure before editing.

- [ ] **Step 2: Add the DemoBar import and mount it**

In `src/app/layout.tsx`, make these two changes:

**Add import** (after the existing imports):
```tsx
import { DemoBar } from '@/components/DemoBar'
```

**Replace the `<body>` content** — add `<DemoBar />` as the very first child:
```tsx
      <body className={`${inter.className}`}>
        <DemoBar />
        <ErrorBoundary>
          <SentryUserProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <NotificationProvider>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  {children}
                </div>
                <Toaster />
              </NotificationProvider>
            </ThemeProvider>
          </SentryUserProvider>
        </ErrorBoundary>
      </body>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
yarn typecheck
```

Expected: no errors.

- [ ] **Step 4: Manual test**

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
yarn dev
```

Open `http://localhost:3000`. Confirm:
- Blue bar appears at top with credentials and "Entrar al Demo →" button
- Clicking X hides the bar
- Refreshing the same tab keeps bar hidden
- Opening a new tab shows the bar again (sessionStorage is per-tab)

- [ ] **Step 5: Commit**

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
git add src/app/layout.tsx
git commit -m "feat: mount DemoBar in root layout"
```

---

## Task 4: Rewrite Landing Page (Clean Business)

**Files:**
- Rewrite: `src/app/page.tsx`

The new landing replaces the gradient-blob design with a clean white/blue business landing. It uses `LoginLink` (same Kinde component) for both the nav and hero CTAs. Top padding of `pt-12` pushes content below the fixed DemoBar (48px tall).

- [ ] **Step 1: Rewrite src/app/page.tsx**

Replace the entire file content:

```tsx
import { LoginLink } from '@kinde-oss/kinde-auth-nextjs/components'
import { WrenchIcon, UsersIcon, TicketIcon, BarChart3Icon } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] pt-12">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2 font-bold text-[#1e40af] text-lg">
          <WrenchIcon className="w-5 h-5" />
          Francisco Repair Shop
        </div>
        <LoginLink
          authUrlParams={{ login_hint: 'demo@repairshop.com' }}
          className="rounded-md bg-[#1e40af] px-4 py-2 text-sm font-medium text-white hover:bg-blue-900 transition-colors"
        >
          Ver Demo
        </LoginLink>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 py-20">
        <h1 className="text-5xl font-bold leading-tight mb-4">
          Tu taller, perfectamente
          <br />
          <span className="text-[#3b82f6]">organizado</span>
        </h1>
        <p className="text-xl text-slate-600 mb-8 max-w-xl mx-auto">
          Gestión de clientes, tickets de reparación y reportes — todo en un solo lugar.
        </p>
        <LoginLink
          authUrlParams={{ login_hint: 'demo@repairshop.com' }}
          className="inline-block rounded-lg bg-[#1e40af] px-8 py-4 text-lg font-semibold text-white hover:bg-blue-900 transition-colors shadow-lg"
        >
          Ver Demo →
        </LoginLink>
      </section>

      {/* Stats bar */}
      <div className="border-y border-slate-200 bg-white py-8">
        <div className="max-w-2xl mx-auto flex justify-center gap-16 text-center">
          <div>
            <div className="text-3xl font-bold text-[#1e40af]">25</div>
            <div className="text-sm text-slate-500 mt-1">Clientes</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#1e40af]">40</div>
            <div className="text-sm text-slate-500 mt-1">Tickets</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#1e40af]">$4,820</div>
            <div className="text-sm text-slate-500 mt-1">Revenue demo</div>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <section className="max-w-4xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <UsersIcon className="w-8 h-8 text-[#1e40af] mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">Customer Management</h3>
          <p className="text-sm text-slate-500">
            Full customer profiles, history, and contact info in one click.
          </p>
        </div>
        <div className="text-center p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <TicketIcon className="w-8 h-8 text-[#1e40af] mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">Ticket Tracking</h3>
          <p className="text-sm text-slate-500">
            Assign, update, and close repair tickets with full audit trail.
          </p>
        </div>
        <div className="text-center p-6 rounded-xl border border-slate-200 bg-white shadow-sm">
          <BarChart3Icon className="w-8 h-8 text-[#1e40af] mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">Analytics</h3>
          <p className="text-sm text-slate-500">
            Dashboard with completion rates, open tickets, and customer trends.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500">
        <p className="mb-3">
          Built by{' '}
          <a
            href="https://nickgranados.com"
            className="text-[#1e40af] font-medium hover:underline"
          >
            Nick Granados
          </a>
        </p>
        <div className="flex justify-center flex-wrap gap-2">
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">Next.js 15</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">Kinde Auth</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">Neon DB</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">Drizzle ORM</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">shadcn/ui</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">Sentry</span>
        </div>
      </footer>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
yarn typecheck
```

Expected: no errors.

- [ ] **Step 3: Manual test**

With `yarn dev` running, open `http://localhost:3000`.

Confirm:
- Page has white background (no gradient blobs)
- Blue nav with "Francisco Repair Shop" + "Ver Demo" button
- Hero headline visible below the DemoBar (not hidden behind it)
- Stats bar shows 25 / 40 / $4,820
- 3-column features grid
- Footer with tech badges

Click "Ver Demo" button — should redirect to Kinde login with `demo@repairshop.com` pre-filled in the email field.

- [ ] **Step 4: Commit**

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
git add src/app/page.tsx
git commit -m "feat: rewrite landing page with Clean Business design"
```

---

## Task 5: Rewrite Seed Data with Faker

**Files:**
- Rewrite: `src/db/seed-data.ts`

The existing `seed-data.ts` has 20 static customers and 35 static tickets. Replace it with faker-generated data (25 customers, 40 tickets) that is idempotent (clears first). The schema only has `completed: boolean` — no `status`, `device`, or `price` fields.

`seed.ts` already exists and delegates to `seedDatabase()` / `clearDatabase()` from this file — no changes to `seed.ts` needed.

The seed script is already in `package.json` as `"db:seed": "tsx src/db/seed.ts"`.

- [ ] **Step 1: Rewrite src/db/seed-data.ts**

Replace the entire file content:

```typescript
import { faker } from '@faker-js/faker'
import { db } from './index'
import { customers, tickets } from './schema'

const REPAIR_TITLES = [
  'Screen Repair',
  'Battery Replacement',
  'Virus Removal',
  'Data Recovery',
  'Keyboard Fix',
  'RAM Upgrade',
  'OS Installation',
  'General Diagnosis',
] as const

const REPAIR_DESCRIPTIONS: Record<string, string> = {
  'Screen Repair': 'Customer reports cracked or unresponsive display. Physical replacement required.',
  'Battery Replacement': 'Device battery drains rapidly or does not hold charge. Full replacement required.',
  'Virus Removal': 'Multiple pop-ups, browser redirects, and degraded performance. Malware suspected.',
  'Data Recovery': 'Storage drive making clicking sounds or not detected. Critical data must be recovered.',
  'Keyboard Fix': 'Several keys not responding. Possible debris or hardware connection failure.',
  'RAM Upgrade': 'Device runs slowly with multiple apps open. RAM upgrade consultation and installation.',
  'OS Installation': 'Fresh operating system installation requested. No data preservation needed.',
  'General Diagnosis': 'Device malfunctioning in unspecified ways. Full diagnostic needed to identify root cause.',
}

const TECHS = ['demo@repairshop.com', 'Alex Martinez'] as const

function daysAgo(maxDays: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - Math.floor(Math.random() * maxDays))
  return d
}

export async function seedDatabase() {
  console.log('🧹 Clearing existing data...')
  await db.delete(tickets)
  await db.delete(customers)

  console.log('📝 Inserting 25 customers...')
  const customerValues = Array.from({ length: 25 }, () => ({
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address1: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state({ abbreviated: true }),
    zip: faker.location.zipCode(),
    country: 'US',
    active: true,
    createdAt: daysAgo(180),
  }))

  const insertedCustomers = await db.insert(customers).values(customerValues).returning()
  console.log(`✅ Inserted ${insertedCustomers.length} customers`)

  console.log('🎫 Inserting 40 tickets...')
  const ticketValues = Array.from({ length: 40 }, (_, i) => {
    const title = REPAIR_TITLES[i % REPAIR_TITLES.length]
    const completed = i < 18
    const customer = insertedCustomers[i % insertedCustomers.length]
    return {
      customerId: customer.id,
      title,
      description: REPAIR_DESCRIPTIONS[title],
      completed,
      tech: TECHS[i % 2],
      createdAt: daysAgo(90),
    }
  })

  const insertedTickets = await db.insert(tickets).values(ticketValues).returning()
  console.log(`✅ Inserted ${insertedTickets.length} tickets`)

  console.log('🎉 Database seeding completed!')
  return { customers: insertedCustomers, tickets: insertedTickets }
}

export async function clearDatabase() {
  console.log('🧹 Clearing database...')
  await db.delete(tickets)
  await db.delete(customers)
  console.log('🎉 Database cleared!')
}

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
yarn typecheck
```

Expected: no errors. If `faker.location.state({ abbreviated: true })` errors, replace with `faker.location.state()` and use only 2-char abbreviations manually, or check the `@faker-js/faker` version installed.

- [ ] **Step 3: Run the seed against Neon DB**

Requires the `.env.local` file to have `DATABASE_URL` set.

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
yarn db:seed
```

Expected output:
```
🧹 Clearing existing data...
📝 Inserting 25 customers...
✅ Inserted 25 customers
🎫 Inserting 40 tickets...
✅ Inserted 40 tickets
🎉 Database seeding completed!
```

- [ ] **Step 4: Verify data in the app**

With `yarn dev` running, open `http://localhost:3000` and click "Ver Demo →". After logging in as `demo@repairshop.com`, navigate to `/dashboard`. Confirm:

- Total Tickets shows **40**
- Customers section shows customer names (not empty state)
- Recent Tickets list is populated

- [ ] **Step 5: Commit**

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
git add src/db/seed-data.ts
git commit -m "feat: rewrite seed data with faker, idempotent clear-then-insert"
```

---

## Task 6: Rewrite README

**Files:**
- Rewrite: `README.md`

- [ ] **Step 1: Rewrite README.md**

Replace the entire file content:

```markdown
# Francisco Computer Repair Shop

> A full-stack repair shop management system built with Next.js 15, Kinde Auth, and Neon DB.

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Kinde](https://img.shields.io/badge/Kinde_Auth-FF5C00?style=flat)
![Neon](https://img.shields.io/badge/Neon_DB-00E5B4?style=flat)
![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat)
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=flat&logo=sentry&logoColor=white)

**Live demo:** https://repairshop-puce.vercel.app/

---

## Features

- **Customer Management** — Create, search, and manage customer profiles with full history
- **Ticket Tracking** — Open, assign, and close repair tickets per customer
- **Dashboard** — Live stats: open tickets, completed tickets, customer count
- **Role-based Access** — Manager vs. Regular User permissions via Kinde
- **Search** — Real-time search across customers and tickets
- **Sentry Monitoring** — Error tracking and performance monitoring in production

## Demo Account

The live deployment is pre-loaded with realistic demo data (25 customers, 40 tickets).

| Field | Value |
|-------|-------|
| Email | `demo@repairshop.com` |
| Password | `demo1234` |

Click **"Ver Demo →"** on the landing page — the login form will have the email pre-filled.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Kinde Auth |
| Database | Neon DB (PostgreSQL) |
| ORM | Drizzle ORM |
| Monitoring | Sentry |
| Forms | React Hook Form + Zod |

## Local Setup

### 1. Clone and install

```bash
git clone https://github.com/nick-granados/repairshop.git
cd repairshop
yarn install
```

### 2. Configure environment variables

Create `.env.local` with:

```env
# Kinde Auth
KINDE_CLIENT_ID=your_client_id
KINDE_CLIENT_SECRET=your_client_secret
KINDE_ISSUER_URL=https://your-domain.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard

# Neon DB
DATABASE_URL=your_neon_connection_string
```

### 3. Seed the database

```bash
yarn db:seed
```

This clears existing data and inserts 25 customers + 40 tickets with realistic faker data.

### 4. Run the dev server

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

---

Built by [Nick Granados](https://nickgranados.com) — Full Stack Developer
```

- [ ] **Step 2: Commit**

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
git add README.md
git commit -m "docs: rewrite README with demo credentials and professional setup guide"
```

---

## Task 7: Manual Step — Create Demo User in Kinde

This step is done by Nick in the Kinde dashboard, not by the implementation agent.

- [ ] **Step 1: Log in to Kinde dashboard**

Go to your Kinde project dashboard and navigate to **Users**.

- [ ] **Step 2: Create the demo user**

Create a new user:
- Email: `demo@repairshop.com`
- Password: `demo1234`
- Role: `Regular User` (not Manager — visitors should not see admin controls)

- [ ] **Step 3: Deploy and verify end-to-end**

Push all commits to trigger Vercel deploy:

```bash
cd "E:/Users/nick_/Documents/Cursos/repairshop"
git push
```

Once deployed, open `https://repairshop-puce.vercel.app/` and verify all 5 success criteria from the spec:

- [ ] Blue DemoBar visible with credentials on first load
- [ ] "Entrar al Demo →" click lands on Kinde login with `demo@repairshop.com` pre-filled
- [ ] After login, dashboard shows 40 tickets and 25 customers (not empty states)
- [ ] `yarn db:seed` runs without errors locally
- [ ] README on GitHub describes the project professionally

---

## Success Criteria Checklist

- [ ] Visitor lands on the page and immediately sees demo credentials in the blue top bar
- [ ] One click on "Entrar al Demo →" → Kinde login with email pre-filled
- [ ] After login, dashboard shows populated data (40 tickets, 25 customers)
- [ ] `yarn db:seed` runs without errors and populates Neon DB
- [ ] README describes the project professionally with badges, demo credentials, and local setup
