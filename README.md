# DearGynac — Women's Health Platform

India's most trusted women's health ecosystem — private, expert-led, and stigma-free.

## Tech Stack

- **Framework:** Next.js 16.2.3 (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** NextAuth v5 (next-auth@beta) — OTP + Anonymous login
- **Styling:** Tailwind CSS v4, Shadcn UI
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Notifications:** Sonner (toast)
- **Payments:** Razorpay (coming soon — dummy flow active)

## Quick Start

```bash
# 1. Clone and install
git clone <repo-url>
cd deargynac
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Fill in your MongoDB URI and other values

# 3. Seed the database (dev only)
npm run dev
# Visit http://localhost:3000/api/seed in your browser

# 4. Start developing
npm run dev
```

## Default Accounts (after seeding)

Login via OTP at `/auth/login`. The OTP is printed to the terminal console in development:

| Role | Phone | Name |
|------|-------|------|
| Admin | 9000000000 | Admin User |
| Doctor (Gynecologist) | 9000000001 | Dr. Snehal Pansare |
| Radiologist | 9000000002 | Dr. Kshitija Borkar |
| Surgeon | 9000000003 | Dr. Praveen Borkar |
| Patient | 9000000004 | Priya Sharma |

## Key URLs

| URL | Description |
|-----|-------------|
| `/` | Landing page |
| `/auth/login` | OTP login + anonymous access |
| `/patient` | Patient dashboard |
| `/patient/book` | 6-step consultation booking |
| `/patient/consultation/[id]` | Async chat view |
| `/doctor` | Doctor dashboard |
| `/doctor/consultation/[id]` | Doctor case workspace |
| `/doctor/consultation/[id]/prescribe` | E-prescription builder |
| `/doctor/schedule` | Availability manager |
| `/admin` | Admin panel |
| `/admin/doctors` | Doctor management |
| `/admin/consultations` | All consultations (filtered) |
| `/admin/sla` | SLA breach monitor |
| `/api/health` | Health check |
| `/api/seed` | Seed database (dev only) |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_SECRET` | Secret for NextAuth JWT encryption |
| `NEXTAUTH_URL` | App URL (http://localhost:3000 for dev) |
| `RAZORPAY_KEY_ID` | Razorpay API key (not yet integrated) |
| `RAZORPAY_KEY_SECRET` | Razorpay secret (not yet integrated) |
| `SMTP_HOST` | Email SMTP host |
| `SMTP_PORT` | Email SMTP port |
| `SMTP_USER` | Email sender address |
| `SMTP_PASS` | Email app password |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client-side Razorpay key |

## Project Structure

```
app/
  (marketing)/          # Landing page (public)
  (dashboard)/
    patient/            # Patient dashboard + booking + chat
    doctor/             # Doctor dashboard + consultation + prescribe
    admin/              # Admin panel + doctors + SLA
  auth/login/           # OTP authentication
  api/                  # All API routes
components/
  marketing/            # Landing page sections
  dashboard/            # Dashboard shared components
  shared/               # Providers, spinners
  ui/                   # Shadcn UI components
models/                 # Mongoose schemas
lib/                    # DB connection, auth config, utils
types/                  # TypeScript interfaces
```

## Roadmap

- [ ] Razorpay payment integration
- [ ] WhatsApp OTP via Gupshup
- [ ] Video consultation via LiveKit
- [ ] PDF prescription generation
- [ ] ABHA ID integration
- [ ] Period & cycle tracker module
- [ ] Mobile apps (React Native)
- [ ] AI symptom triage assistant
