# Architecture Decisions

This document explains the **why** behind technical decisions in this starter kit. Reading it will save you 20+ hours of "why did they do it this way?" when you start customizing.

## Table of Contents
1. [Why Next.js 16 App Router (not Pages Router)](#1-nextjs-16-app-router)
2. [Why Supabase SSR (not NextAuth)](#2-supabase-ssr)
3. [Why 3 Supabase clients](#3-three-supabase-clients)
4. [Why `getUser()` not `getSession()` in middleware](#4-getuser-not-getsession)
5. [Why Server Actions (not API routes) for mutations](#5-server-actions)
6. [Why idempotent webhooks matter](#6-idempotent-webhooks)
7. [Why cookie-based i18n (not URL prefixes)](#7-cookie-i18n)
8. [Why `after()` for emails (not synchronous)](#8-after-for-emails)
9. [Why Zod in every server action](#9-zod-everywhere)
10. [Why standalone Docker output](#10-standalone-docker)

---

## 1. Next.js 16 App Router

**Decision**: Use App Router with React Server Components (RSC).

**Why not Pages Router**:
- RSC reduces client JS bundle by ~60% (server renders, client hydrates only interactive parts).
- Layouts are stable across navigations (no flash, no refetch).
- Server Actions eliminate need for API routes on mutations.
- Streaming with `<Suspense>` improves perceived performance.

**Trade-offs**:
- Steeper learning curve (cache, revalidate, etc.).
- Some libraries don't support RSC yet.
- `searchParams` is async in Next 15+ (requires `React.use()`).

**When to reconsider**: If you're migrating an existing Pages Router app, do it incrementally route by route.

---

## 2. Supabase SSR

**Decision**: Use `@supabase/ssr` instead of NextAuth/Auth.js.

**Why**:
- Supabase handles auth, DB, storage, and realtime in one. NextAuth only does auth.
- No need to set up Prisma + Postgres separately.
- RLS (Row Level Security) is the killer feature — security at DB level, not app level.
- Magic Link + OAuth work out of the box.
- Free tier covers 50k MAU.

**Trade-offs**:
- Vendor lock-in to Supabase (mitigated: standard Postgres under the hood, can self-host).
- Less flexible than Auth.js for exotic auth flows (custom JWT, etc.).
- NextAuth has more OAuth providers (50+ vs Supabase's 20+).

**When to reconsider**: If you need self-hosted auth with no vendor, use Auth.js + Postgres + Prisma.

---

## 3. Three Supabase Clients

**Decision**: Maintain 3 separate client factories:
- `createSupabaseBrowserClient()` — for Client Components.
- `createSupabaseServerClient()` — for Server Components/Actions/Route Handlers.
- `createSupabaseAdminClient()` — service_role, bypasses RLS.

**Why not one client**:
- Browser client uses cookies via `@supabase/ssr`'s `createBrowserClient`.
- Server client reads/writes cookies via `next/headers`.
- Admin client uses service_role key (NEVER in browser — would expose god-mode).

**Critical**: The admin client bypasses RLS. Only use in:
- Webhook handlers (no user session).
- Admin actions (after explicit `role === 'admin'` check).

**Mistake to avoid**: Don't import `createSupabaseAdminClient` in a Client Component. Next.js will throw at build time, but if you bypass it, the service_role key leaks.

---

## 4. `getUser()` not `getSession()`

**Decision**: Always use `supabase.auth.getUser()` in middleware and Server Components. Never `getSession()`.

**Why**:
- `getUser()` makes a network request to Supabase and validates the JWT against the server.
- `getSession()` only reads from cookies. A malicious user can forge a cookie and bypass auth.

**Performance note**: `getUser()` adds ~50ms per request. Acceptable for auth-protected routes. For public routes, don't call it.

**When to use `getSession()`**: Only in Client Components for optimistic UI (e.g., showing user avatar before server confirms). Always pair with `getUser()` for actual security checks.

---

## 5. Server Actions

**Decision**: Use Server Actions for all mutations (login, profile update, billing). Reserve API routes for webhooks only.

**Why**:
- Server Actions have built-in CSRF protection (origin check).
- No need to manually set up `fetch` calls + JSON parsing.
- Type-safe end-to-end (TypeScript infers form data types).
- Progressive enhancement: forms work without JS.

**Pattern**:
```typescript
"use server";
export async function updateProfile(prev: State, formData: FormData) {
  const parsed = ProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  // ... DB update
  return { ok: true };
}

// Client
const [state, action] = useActionState(updateProfile, {});
return <form action={action}>...</form>;
```

**When to use API routes instead**:
- Webhooks (need raw body for signature verification).
- Public API endpoints (third-party integrations).
- Streaming responses (Server Actions don't support streams yet).

---

## 6. Idempotent Webhooks

**Decision**: Persist every Stripe event.id in `webhook_events` table. Deduplicate before processing.

**Why**:
- Stripe retries webhooks if it doesn't get a 2xx response within 10s.
- If your handler takes >10s (e.g., sending email), Stripe retries → you send 2 emails.
- Without idempotency, a single checkout can trigger 3-5 welcome emails.

**Implementation**:
```typescript
const { error } = await supabase
  .from("webhook_events")
  .insert({ event_id: event.id, event_type: event.type });

if (error?.code === "23505") {
  // unique violation → already processed
  return Response.json({ deduplicated: true });
}
```

**Cost**: 1 extra DB insert per webhook (~5ms). Worth it.

---

## 7. Cookie-based i18n

**Decision**: Use `localePrefix: "as-needed"` + cookie `NEXT_LOCALE` for language switching. Don't use URL prefixes like `/es/login`, `/en/login`.

**Why**:
- URL prefixes require complex middleware combining auth + intl (they conflict).
- Cookies are invisible to users — they just see `/login` in their language.
- Better SEO: each language has one canonical URL.

**Trade-offs**:
- Worse for multilingual SEO (Google can't crawl /es vs /en separately).
- Sharing a link doesn't preserve language (recipient sees their own cookie).

**When to reconsider**: If SEO in multiple languages is critical, switch to `localePrefix: "always"` and combine middlewares. See [next-intl docs](https://next-intl-docs.vercel.app/docs/routing/middleware).

---

## 8. `after()` for Emails

**Decision**: Send emails via `after()` (Next.js 15+) instead of synchronously in the webhook handler.

**Why**:
- Email sending takes 200-1000ms (Resend API call).
- Stripe expects webhook response in <10s.
- If email fails, Stripe retries → re-processes event → tries email again (idempotency saves us, but wastes resources).

**Implementation**:
```typescript
export async function POST(request: Request) {
  // ... process event ...
  after(async () => {
    await sendWelcomeEmail({ to: email });
  });
  return Response.json({ received: true }); // Stripe gets response immediately
}
```

**Trade-off**: If `after()` fails, no retry. For critical emails, use a queue (Inngest, QStash).

---

## 9. Zod Everywhere

**Decision**: Validate ALL inputs in Server Actions with Zod. No exceptions.

**Why**:
- Server Actions accept `FormData` — untyped by default.
- Without validation, malicious users can submit arbitrary data.
- Zod gives type inference + validation in one.

**Pattern**:
```typescript
const Schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80),
});

export async function action(prev: State, formData: FormData) {
  const parsed = Schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  // parsed.data is now typed as { email: string; name: string }
}
```

**Rule**: If a Server Action doesn't have Zod validation, it's a bug.

---

## 10. Standalone Docker Output

**Decision**: Use `output: "standalone"` in `next.config.ts`.

**Why**:
- Produces a minimal Docker image (~150MB vs ~1GB with full node_modules).
- Only includes files actually imported by your app.
- Perfect for Vercel-like deployments on Kubernetes, Fly.io, Railway.

**Dockerfile pattern**:
```dockerfile
FROM node:20-alpine AS builder
COPY . .
RUN bun run build  # produces .next/standalone

FROM node:20-alpine AS runner
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]
```

**Trade-off**: Standalone mode doesn't support `next/image` optimization by default. You need to either install `sharp` separately or use a CDN.

---

## Summary

Every decision here was made to:
1. **Maximize security** (RLS, getUser, Zod, idempotency).
2. **Minimize operational overhead** (Server Actions, standalone Docker).
3. **Avoid common SaaS bugs** (idempotent webhooks, after() for emails).
4. **Stay free-tier friendly** (Supabase free, Vercel free, Resend free).

If you disagree with any decision, fork the kit and change it. That's the point of a starter kit — it's a starting point, not a religion.
