# 🔴 Reddit — 3 posts listos para copiar/pegar

## ⚠️ Reglas de Reddit (lee antes de postear)

1. **NO hagas spam**. Reddit te banea si solo promocionas.
2. Participa en la comunidad primero (10+ comentarios en otros posts).
3. Usa **text posts** (no link posts) para la mayoría de subreddits.
4. Cada subreddit tiene reglas distintas — lee el sidebar.

---

## 📌 Post 1 — r/nextjs (45k members)

### Título
```
[Show & Tell] Built a Next.js 16 + Supabase + Stripe boilerplate. 22 features, 38 tests, $50.
```

### Cuerpo (text post, NO link post)

```
Hi r/nextjs 👋

I just published a production-ready SaaS starter kit and wanted to share it with the community. I'm not here to spam — feedback welcome.

## What's included

- **Next.js 16** App Router + TypeScript strict
- **Supabase SSR** (3 clients: browser/server/admin)
- **Stripe** Checkout + Billing Portal + **idempotent webhook** (no double emails on retries)
- **RBAC middleware** (user/free/premium/admin)
- **Auth**: Magic Link + OAuth Google/GitHub
- **Teams/Organizations** multi-seat with invitations
- **Admin panel** with MRR/churn metrics + audit logs
- **Analytics dashboard** with Recharts (MRR, churn, growth)
- **In-app notifications** system (bell + dropdown + DB)
- **API Keys management** + public `/api/v1/me` endpoint
- **8 React Email templates** (welcome, magic-link, payment-failed, trial-ending, invoice, password-reset, account-deleted, subscription-success)
- **i18n ES/EN/PT** with next-intl (actually wired, not just config)
- **38 tests** passing (Vitest unit + Playwright e2e)
- **Dockerfile** multi-stage + docker-compose + GitHub Actions CI
- **Sentry + Posthog + pino logger** integrated
- **Feature flags** with Vercel Edge Config
- **Rate limiting** + security headers (CSP, HSTS)

## Honest take

- ❌ I don't host a demo (you deploy yourself with the included guide)
- ❌ I don't have a Discord (use GitHub Issues + email)
- ✅ Code is production-ready (38 tests pass, lint clean, typecheck clean)
- ✅ Lifetime updates (v2, v3... free for buyers)

## Why $50 (not $199 like Shipfa.st)

No demo overhead, no Discord overhead, no onboarding calls. Just code + docs. Pass the savings to the buyer.

## Repo (public, you can review before buying)

https://github.com/di3go04/nextjs-supabase-starter-kit

## If you want to buy

https://gumroad.com/l/starter-kit-di3go04

## Questions for the community

1. Is $50 too low for this? Should I charge $89?
2. What features would make you pay $99+?
3. Anyone else shipping boilerplates? What's your pricing strategy?

Feedback welcome 👇
```

### Notas
- Postea **martes o miércoles 9-11am ET** (mejor engagement)
- Responde a comentarios en 1h
- Si te preguntan "can I see the code?", manda el link del repo
- NO uses títulos clickbait ("you won't believe..."). Reddit odia eso.

---

## 📌 Post 2 — r/supabase (15k members)

### Título
```
Built a SaaS boilerplate with Supabase SSR + 3 clients pattern (browser/server/admin) + RLS on 8 tables
```

### Cuerpo

```
Hi r/supabase 👋

I just published a Next.js 16 + Supabase starter kit and wanted to share the architecture decisions I made around Supabase specifically. Feedback welcome.

## 3 Supabase clients pattern

I split into 3 factories (file: `src/lib/supabase/`):

1. **`createSupabaseBrowserClient()`** — for Client Components. Uses `@supabase/ssr` `createBrowserClient`.
2. **`createSupabaseServerClient()`** — for Server Components/Actions/Route Handlers. Uses `createServerClient` + `next/headers` cookies.
3. **`createSupabaseAdminClient()`** — service_role key. **Only** used in webhook handlers and admin actions after explicit `role === 'admin'` check.

Why 3? Because mixing them leads to either:
- Service role key leaking to client (security disaster)
- Server components not being able to write cookies (auth refresh fails)

## RLS on 8 tables

All tables have RLS enabled. The `profiles` table has a special policy that prevents users from changing their own `role`:

```sql
create policy "profiles_update_role_restricted"
  on public.profiles for update
  to authenticated
  using (true)
  with check (
    case
      when (select public.can_update_role()) then true
      when (select role from public.profiles where id = auth.uid()) = new.role then true
      else false
    end
  );
```

Only the service_role (via `can_update_role()` function checking JWT role) can change a user's role.

## getUser() not getSession()

In middleware and Server Components, I always use `supabase.auth.getUser()`. `getSession()` reads from cookies and is vulnerable to manipulation. `getUser()` makes a network request to Supabase and validates the JWT.

## Tables

- `profiles` (with trigger on `auth.users` insert)
- `subscriptions` (synced with Stripe webhook)
- `webhook_events` (idempotency for Stripe)
- `audit_logs` (admin actions traceability)
- `teams` + `team_members` + `invitations` (multi-seat B2B)
- `usage_events` (analytics tracking)
- `notifications` (in-app feed)
- `api_keys` (SHA-256 hashed personal tokens)

## Repo

https://github.com/di3go04/nextjs-supabase-starter-kit

All SQL migrations are in `supabase/` folder, runnable in order.

## Question

Anyone else using the 3-client pattern? I've seen some repos use just 1 client for everything and I think it's a mistake. Curious to hear others' approach.
```

### Notas
- Este post es **más técnico** que el de r/nextjs (la audiencia de r/supabase es más developer)
- No vendas aquí — solo comparte arquitectura. El link del repo al final es suficiente.
- Si la comunidad lo valora, algunos comprarán sin que tengas que empujar.

---

## 📌 Post 3 — r/SideProject (90k members)

### Título
```
Launched a $50 SaaS boilerplate with 0 users, 0 MRR, 0 Discord. Here's the honest pitch.
```

### Cuerpo

```
I'll be brutally honest: my starter kit has 0 users, 0 MRR, and no Discord.

But I think that's the right way to sell it.

## The pitch

Next.js 16 + Supabase + Stripe + Resend boilerplate. 22 features, 38 tests, 173 files, 4 docs premium. $50 one-time, lifetime updates.

## Why I'm not doing the "standard" launch

Most boilerplate sellers do:
- Demo hosted on custom domain
- Discord community with 200+ members
- Video walkthroughs
- "Save $200 if you buy today!" countdowns
- Twitter threads with fake revenue screenshots

I'm doing the opposite:
- ❌ No demo (you deploy yourself, I give you the guide)
- ❌ No Discord (use GitHub Issues + email)
- ❌ No videos (screenshots + written docs are better for devs)
- ✅ Just code + 4 docs + email support

## The honest numbers

- Code: 5,000+ lines TypeScript
- Tests: 38 passing
- Files: 173
- Price: $50 (vs $105 value = 52% off)
- Time to deploy: 1-3 days
- Refund: 14 days, no questions

## What's actually in it

22 features. The 3 that differentiate from $199 boilerplates:

1. **Idempotent Stripe webhook** — no double emails on retries (most boilerplates ignore this)
2. **i18n ES/EN/PT actually wired** — others claim i18n but ship hardcoded English
3. **Analytics dashboard with Recharts** — MRR, churn, growth. None of the $50-89 boilerplates have this.

## Why $50

No overhead = lower price. If I add demo + Discord + onboarding, price goes to $89. Early buyers get $50 + lifetime updates.

## Links

- Repo (public, review before buying): https://github.com/di3go04/nextjs-supabase-starter-kit
- Buy: https://gumroad.com/l/starter-kit-di3go04

## Ask

What would make YOU pay $99 for this? What's missing?

Genuinely curious about feedback from this community.
```

### Notas
- r/SideProject es MUY receptivo a historias honestas ("0 users, 0 MRR")
- **NO mientas** sobre números. Si te preguntan "how many sales?", di "0 so far, just launched today"
- Responde cada comentario en 1h

---

## 📅 Calendario de posting (no todos el mismo día)

| Día | Subreddit | Hora ET | Razón |
|-----|-----------|---------|-------|
| Lunes | r/nextjs | 9am | Inicio de semana, alta actividad |
| Miércoles | r/SideProject | 10am | Día medio, audiencia fresca |
| Viernes | r/supabase | 11am | Audiencia técnica, viernes relajado |

**No postees en 3 subreddits el mismo día** — Reddit lo detecta como spam. Espera 2 días entre cada uno.

## 🚫 Qué NO hacer en Reddit

1. **No postear link posts** — son auto-baneados en muchos subs. Usa text posts.
2. **No upvote tu propio post** con cuentas falsas — baneo permanente.
3. **No responder agresivo** a críticas — gracias y aprende.
4. **No promocionar en comentarios** de otros posts sin contexto — ban.
5. **No postear viernes después de 2pm** — engagement cae 70%.
