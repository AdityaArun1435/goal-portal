# GoalFlow — Goal Setting & Tracking Portal

**AtomQuest Hackathon 1.0 Submission**
Live: [https://goal-portal-fawn.vercel.app](https://goal-portal-fawn.vercel.app)
Repo: [https://github.com/AdityaArun1435/goal-portal](https://github.com/AdityaArun1435/goal-portal)

---

## Demo Credentials

| Role     | Email                | Password    |
|----------|----------------------|-------------|
| Admin    | admin@test.com       | password123 |
| Employee | employee@test.com    | password123 |

> Auto-fill buttons for both accounts are available on the login page.

---

## Tech Stack

- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Three.js (WebGL shaders)
- **Backend:** Next.js API Routes (serverless)
- **Database:** Supabase (PostgreSQL + Row Level Security)
- **Auth:** Supabase Auth (email/password)
- **Hosting:** Vercel + Supabase (free tier)

---

## Local Setup

### Prerequisites
- Node.js 18+
- A Supabase project (free tier works)

### Steps

```bash
git clone https://github.com/AdityaArun1435/goal-portal.git
cd goal-portal
npm install
```

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database Setup

Run the SQL schema from `/supabase/schema.sql` in your Supabase SQL editor to create all 8 tables, triggers, and RLS policies. Then seed demo users via the Supabase dashboard or the provided seed script.

---

## Features

- **Employee:** Set goals → submit for approval → daily check-ins → earn achievements → view progress reports
- **Admin:** Approve/reject goals → manage users → view audit logs → access all employee reports
- **Goal cycles** with configurable thrust areas
- **Row Level Security** — employees can only access their own data
- **Audit trail** — all write operations auto-logged via Postgres trigger
- **WebGL animated background** via Three.js shaders
- **Bento grid landing page** with dark theme

---

## Known Limitations

- No email notifications — approval/rejection is visible only on next login
- No real-time updates — page refresh required to see status changes
- Achievements are rule-based (not ML-driven)
- Mobile layout is functional but not fully optimised for small screens
- Seeded demo data is minimal; audit log will be sparse on a fresh account
