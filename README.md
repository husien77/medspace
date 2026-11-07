# MEDSPACE

Arabic-first academic application for a private Human Medicine cohort, designed and owned by الحسين الغرسي.

## Current implementation status

The repository contains a Next.js 14 / TypeScript / Tailwind application foundation, PostgreSQL schema via Drizzle, database-backed registration and login, pending student approval, database-authoritative role checks, admin student approval, subject listing/creation, lecture creation/status updates and calculated subject progress. Arabic RTL landing, dashboard, subject views, and an initial PWA shell are included.

**Important:** this repository has not been run or tested in an execution environment in this workflow. PDF persistent storage/upload, password recovery, complete subject CRUD/reordering, push delivery, offline IndexedDB/sync, exams/discussions, deployment, and security verification remain incomplete. Do not treat demo text or placeholders as real data. Deployment requires configuring a real PostgreSQL URL and strong `AUTH_SECRET`.

## Local setup

1. Install Node.js 20+ and PostgreSQL 15+.
2. Copy `.env.example` to `.env.local`; set `DATABASE_URL` and a cryptographically random `AUTH_SECRET` of 32+ characters.
3. Run `npm install` and `npm run db:push`.
4. Provision the sole admin from a secure server environment with `SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` (16+ characters), and optional `SUPER_ADMIN_NAME=الحسين الغرسي`, then run `npm run admin:bootstrap`. Remove the bootstrap password from environment after use.
5. Run `npm run dev`. Register student accounts; they remain pending until admin approval.

Never expose bootstrap credentials in client-side environment variables or commit `.env.local`.

## Security and operations

- Roles and account status are re-read from PostgreSQL for each server session check. Public registration hardcodes the `STUDENT` role and `PENDING` status.
- Passwords are bcrypt-hashed. Session cookies are HttpOnly, SameSite=Lax, and Secure in production; signed sessions expire after 8 hours.
- Use HTTPS in production, rotate secrets, configure database backups and test restore procedures, and restrict database/storage credentials.
- Audit events are written for implemented admin actions; append-only database permissions/triggers are not yet configured, so immutability is not guaranteed.

## Product roadmap

Phase 1 continues with secure file storage/PDF reader and richer subject/lecture administration. Phase 2: announcements, push, schedule, search, IndexedDB/offline synchronization. Phase 3: exams and discussions. Phase 4: automated tests, security review, performance tuning and production deployment.
