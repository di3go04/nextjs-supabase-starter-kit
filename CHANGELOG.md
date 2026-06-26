# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-06-26

### 🎉 Initial Release

Starter kit SaaS completo con Next.js 16 App Router, Supabase SSR, Stripe, Resend y todo lo necesario para lanzar en producción.

### Added — Auth & RBAC
- Magic Link + OAuth (Google/GitHub) authentication via Supabase SSR.
- 3 Supabase clients: `createSupabaseBrowserClient`, `createSupabaseServerClient`, `createSupabaseAdminClient`.
- Middleware with route protection + RBAC (`user` / `free` / `premium` / `admin`).
- `useUser` hook + `UserProvider` context.
- `/login`, `/register`, `/auth/callback` pages.
- `profiles` table with RLS, triggers, and role protection policy.

### Added — Billing
- Stripe Checkout Session + Billing Portal integration.
- `/dashboard/billing` with Pro/Enterprise plan cards.
- Idempotent webhook handler (`webhook_events` table).
- Handles `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`.
- `subscriptions` table with RLS + `user_with_plan` view.

### Added — Admin
- `/dashboard/admin` with MRR, churn, premium subscribers metrics.
- User table with inline role change.
- `audit_logs` table for action traceability.

### Added — Teams
- Multi-seat B2B: `teams`, `team_members`, `invitations` tables.
- `/dashboard/teams` create/list/detail pages.
- Server actions: `createTeam`, `inviteToTeam`, `acceptInvitation`, `removeTeamMember`.

### Added — Emails
- 8 React Email templates: welcome, subscription-success, magic-link, payment-failed, trial-ending, invoice-receipt, password-reset, account-deleted.
- Resend integration with no-op fallback in dev mode.
- Emails sent in background via `after()` (no webhook blocking).

### Added — i18n
- next-intl with ES/EN/PT locales.
- `LanguageSwitcher` component with cookie-based persistence.
- All UI strings translated (no hardcoded text).

### Added — UX/DX
- shadcn/ui (45+ components) + Tailwind 4.
- Dark mode via `next-themes` `ThemeProvider`.
- React Query `QueryClientProvider` mounted.
- App Router conventions: `error.tsx`, `loading.tsx`, `not-found.tsx`, `global-error.tsx`.
- `sitemap.ts`, `robots.ts`, `manifest.ts`.
- Toast notifications via `sonner`.

### Added — Security
- Rate limiting on auth endpoints (Upstash Redis with in-memory fallback).
- Security headers: CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy.
- Zod validation on all server actions.
- `getUser()` (not `getSession()`) for SSR auth verification.

### Added — Observability
- Sentry integration (`sentry.{client,server,edge}.config.ts`).
- Posthog analytics with proxy rewrite (`/ingest`).
- Structured logging with `pino`.

### Added — Feature Flags
- Vercel Edge Config integration with typed `FLAGS` helper.

### Added — DevOps
- `Dockerfile` multi-stage (standalone output).
- `docker-compose.yml` with Redis + Stripe CLI profiles.
- GitHub Actions CI: lint + typecheck + unit tests + e2e + build.
- `vercel.json` for 1-click deploy.

### Added — Testing
- Vitest setup with jsdom + Testing Library.
- Unit tests for `rbac`, `stripe`, `site` (20 tests).
- Playwright e2e: landing, auth, conventions (3 specs).
- Coverage config excluding UI components.

### Added — Documentation
- Comprehensive `README.md` with setup, deploy, and webhook config.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`.
- `.env.example` and `.env.local.example` with all variables.
- SQL migrations: `profiles.sql`, `subscriptions.sql`, `webhook_events.sql`, `audit_logs.sql`, `teams.sql`.

### Technical Decisions
- **Next.js 16** (latest, with Turbopack).
- **`output: "standalone"`** for minimal Docker images.
- **`reactStrictMode: true`** (no `ignoreBuildErrors`).
- **Bun** as package manager (npm/pnpm/yarn also compatible).
- **Cookie-based i18n** (not URL-based) to avoid middleware conflicts.
