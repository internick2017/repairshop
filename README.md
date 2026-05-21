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
| Password | `Demo@1234` |

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
