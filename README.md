# 💈 BarberPro — Modern Barbershop Booking Platform

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

> *"First impressions start with a well-groomed haircut."*

**BarberPro** is a production-ready, full-stack booking platform for barbershops.
Customers pick a service, choose their favorite barber, and lock a real-time
time slot in under a minute — while the owner manages everything from a
premium admin dashboard with live stats, email & WhatsApp notifications.

🔗 **Live demo:** [https://your-domain.vercel.app](https://your-domain.vercel.app)

---

## ✨ Features

### For Customers
- 🏠 Premium landing page with services, barber profiles & testimonials
- 💈 Real-time booking flow: service → barber → date → available slots
- 🚫 Fully-booked slots are automatically disabled (no double booking)
- 📧 Instant email confirmation (Resend)
- 📱 Mobile-first design that scales beautifully to desktop

### For Admins
- 🔐 Secure login (Supabase Auth) with server-side route protection
- 📊 Live dashboard: today's bookings, revenue estimate, busiest barber
- ✅ One-tap status management: confirm / complete / cancel
- 📲 WhatsApp notification for every new booking (Fonnte gateway)

---

## 🛠 Tech Stack

| Layer      | Technology |
|------------|------------|
| Framework  | Next.js 16 (App Router, Server Actions, Server Components) |
| Language   | TypeScript |
| Styling    | Tailwind CSS v4 (custom design system, `next/font`) |
| Database   | Supabase (PostgreSQL + Row Level Security + Auth) |
| Validation | Zod (server-side schema validation) |
| Email      | Resend |
| WhatsApp   | Fonnte gateway |
| Hosting    | Vercel (auto CI/CD from GitHub) |

---

## 🏗 Engineering Highlights

- **Overlap-proof scheduling** — a PostgreSQL `EXCLUDE ... USING gist`
  constraint with `tstzrange` makes double-booked barbers *impossible at the
  database level*, not just in the UI.
- **Defense in depth** — client validation for UX, Zod on Server Actions for
  security, and DB constraints as the final source of truth.
- **Least-privilege data access** — RLS policies per role, plus a
  `security definer` RPC (`get_booked_slots`) that exposes only slot
  availability without leaking customer PII.
- **Failure isolation** — a booking always commits even if email/WhatsApp
  notifications fail (`Promise.allSettled`).
- **Race-condition-safe UI** — `useEffect` cleanup prevents stale async
  responses from overwriting fresh slot data.
- **Timezone-correct by design** — all times are stored as `timestamptz` and
  computed with explicit WIB (`+07:00`) offsets, independent of server locale.
- **Two products, one codebase** — marketing site, booking app, and admin
  panel are isolated via route groups with dedicated layouts.

---

## 🗄 Database Schema

```text
services ──────┐
               ├──< bookings >──┐
barbers ───────┤                │
      │        │                │
      └──< working_hours        │
                                │
auth.users ── (RLS: admin role) ┘
```

Full DDL, RLS policies, and seed data: [`database/schema.sql`](database/schema.sql)

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- A [Supabase](https://supabase.com) project
- API keys: [Resend](https://resend.com), [Fonnte](https://fonnte.com) (optional)

### Setup

```bash
git clone https://github.com/Rendyrta2405/BarberPro.git
cd BarberPro
npm install

# 1. Copy env template and fill in your keys
cp .env.example .env.local

# 2. Initialize the database
#    → Supabase Dashboard → SQL Editor → run database/schema.sql

# 3. Create the admin account
#    → Supabase Dashboard → Authentication → Add user (auto-confirm)

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note (Android/Termux developers):** Turbopack has no native bindings for
> `android/arm64`. The `dev`/`build` scripts already include `--webpack`, so
> `npm run dev` works out of the box on Termux.

---

## 📦 Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel (framework preset: **Next.js**).
3. Add all variables from `.env.example` in **Project → Settings → Environment Variables**.
4. Deploy. Every push to `main` auto-deploys; other branches get preview URLs.

Optional: attach a custom domain in Vercel and verify it in Resend to unlock
email delivery to any customer address.

---

## 📁 Project Structure

```text
src/
├── app/
│   ├── (marketing)/   # Landing site (hero, services, barbers, testimonials)
│   ├── (app)/         # Booking application (mobile app shell)
│   ├── (admin)/       # Admin dashboard & login
│   ├── layout.tsx     # Root layout + fonts
│   └── globals.css    # Design system (Tailwind v4 @theme)
├── components/        # UI components (cards, forms, stats)
└── lib/
    ├── supabase.ts           # Browser/anon client
    ├── supabase-server.ts    # Cookie-based server client
    ├── booking-actions.ts    # Server Actions (create booking, slots)
    ├── admin-actions.ts      # Server Actions (status updates)
    ├── auth-actions.ts       # Login / logout
    ├── email.ts              # Resend integration
    ├── whatsapp.ts           # Fonnte integration
    ├── slots.ts              # Time-slot engine
    └── queries.ts            # Shared data queries
database/
└── schema.sql         # Full DDL + RLS + seed
```

---

## 🗺 Roadmap

- [ ] Real barber photos via Supabase Storage upload
- [ ] H-1 booking reminders (email + WhatsApp)
- [ ] Down payment (DP) with Midtrans
- [ ] Customer accounts & booking history
- [ ] Multi-outlet support

---

## 📱 Fun Fact

This entire project — every line of code, every database migration, every
debug session — was built on an **Android tablet** using **Termux** and
**Acode**. No laptop involved. Proof that shipping real products is about
understanding, not hardware.

---

## 📄 License

MIT — free to use for learning and commercial projects.

---

Built with ☕by **[Rafael.dev](https://github.com/Rendyrta2405)**