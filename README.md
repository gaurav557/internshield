# InternShield — AI-Assisted Internship Fraud Detection

A Next.js App Router full-stack application for screening internship listings, maintaining company profiles, and collecting community fraud reports. It includes student and administrator experiences, PostgreSQL persistence through Prisma, password-based authentication, a light/dark theme, and an explainable rule-based risk engine.

> **Important:** Risk scores are triage signals, not proof of fraud or legitimacy. The starter engine does not query government registries, inspect live websites, or perform external reputation checks. When `OPENAI_API_KEY` is configured, submitted screening text is sent to the configured OpenAI model for advisory analysis; otherwise local rules are used. Those integrations require official data access and provider credentials and must be reviewed before production use.

## Stack
- Next.js 15 (App Router) + React 19 + TypeScript
- PostgreSQL + Prisma ORM
- Signed HTTP-only session cookie (JOSE) and bcrypt password hashing
- Zod request validation
- Responsive CSS with light/dark mode

## Features
- Student registration and login
- Company directory with search and status filters
- Company profile submission and preliminary risk screening
- Explainable risk score with human-readable findings (local rules by default; optional OpenAI analysis)
- Fraud report submission and report history
- Admin-only review queue to verify, flag, or reject company profiles
- Dashboard metrics and safety checklist
- Responsive interface and theme switcher

## Requirements
- Node.js 20.9+
- PostgreSQL 14+

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a PostgreSQL database named `internshield`.

3. Copy `.env.example` to `.env` and update `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.

   ```bash
   cp .env.example .env
   ```

   On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Generate Prisma client and create database tables:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Seed the administrator and sample company records:

   ```bash
   npm run db:seed
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

7. Open http://localhost:3000.

## Initial administrator
The seed script reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from `.env`. Defaults are `admin@internshield.local` and `ChangeMe123!`. Change these before running the seed script and never use the defaults in production.

## Main routes
- `/login` and `/register` — authentication
- `/dashboard` — workspace overview
- `/companies` — company directory and company submission
- `/reports` — fraud report submission and history
- `/admin` — administrator review queue (admin role only)

## API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET|POST /api/companies`
- `POST /api/analyze`
- `GET|POST /api/reports`
- `PATCH /api/admin` (admin only)

## Production checklist
- Use a strong random `AUTH_SECRET` and managed PostgreSQL.
- Add rate limiting and abuse protection to authentication and report endpoints.
- Add email verification, password reset, audit logs, CSRF review, and security headers.
- Restrict admin creation to a controlled provisioning process; do not allow users to self-select admin roles.
- Integrate official company registry sources and a reputable threat-intelligence provider under their terms. Display source, timestamp, and confidence for every external check.
- If adding an LLM, treat its output as advisory, validate structured output, protect user-submitted content against prompt injection, and never allow it to make final fraud determinations.
- Add automated tests, monitoring, backups, and privacy/retention policies before real users' data is collected.

## GitHub
Create a repository, then:

```bash
git init
git add .
git commit -m "Initial InternShield application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/internshield.git
git push -u origin main
```
