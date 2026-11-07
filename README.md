# MEDSPACE

MEDSPACE is an Arabic-first academic platform for a private human medicine cohort. This repository contains the production-oriented foundation of the application, including the architecture, authentication flow, subject management, PDF library, lecture tracker, dashboard screens, PWA scaffolding, and server-side authorization model.

## Tech stack

- Next.js 14 + React + TypeScript
- Tailwind CSS
- PostgreSQL + Drizzle ORM
- Secure JWT session model with server-side authorization
- PWA manifest + service worker foundation
- Arabic RTL user experience

## Phase 1 status

This repository is initialized for Phase 1 implementation. It includes the application shell, auth routes, database schema, subject and dashboard scaffolding, PDF library layout, and offline/PWA foundation.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment variables

```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medspace
AUTH_SECRET=replace_with_a_secure_secret
SUPER_ADMIN_EMAIL=admin@medspace.med
```

## Database setup

```bash
npm run db:generate
npm run db:migrate
```

## Notes

This codebase is intentionally structured to support incremental Phase 2 and Phase 3 feature expansion including notifications, examinations, search, offline sync, and audit logging.
