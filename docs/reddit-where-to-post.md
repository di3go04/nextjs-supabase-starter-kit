# 🔴 Reddit — Dónde y cómo publicar

## 📌 Los 5 subreddits EXACTOS dónde publicar

| # | Subreddit | Members | Tipo audiencia | Mejor día/hora (Colombia) |
|---|-----------|---------|----------------|---------------------------|
| 1 | **r/nextjs** | 95k | Devs Next.js | Martes 9am |
| 2 | **r/supabase** | 25k | Devs Supabase | Miércoles 11am |
| 3 | **r/SideProject** | 250k | Indie makers | Jueves 10am |
| 4 | **r/IndieDev** | 30k | Indie devs | Viernes 9am |
| 5 | **r/webdev** | 1.3M | Devs general | Lunes 8am (cuidado, muy estrictos) |

⚠️ **NO publiques en los 5 el mismo día**. Reddit te banea por spam. 1 subreddit cada 2 días.

---

# 📅 Calendario recomendado (2 semanas)

| Día | Subreddit | Hora ET | Razón |
|-----|-----------|---------|-------|
| Lunes | r/nextjs | 9am | Inicio de semana, alta actividad |
| Miércoles | r/SideProject | 10am | Día medio, audiencia fresca |
| Viernes | r/supabase | 11am | Audiencia técnica, viernes relajado |
| Lunes semana 2 | r/IndieDev | 9am | Si los anteriores funcionaron |
| Miércoles semana 2 | r/webdev | 8am | Último intento, más audiencia |

---

# 📝 POST 1 — r/nextjs (PUBLICA ESTE PRIMERO)

## Título

```
[Show & Tell] Built a Next.js 16 + Supabase + Stripe boilerplate. 22 features, 38 tests, $50.
```

## Cuerpo

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

## Cómo publicarlo

1. Entra a: **https://www.reddit.com/r/nextjs/submit**
2. Selecciona tipo: **"Text"** (NO "Link")
3. Pega el título y el cuerpo
4. Click **"Submit"**
5. **Monitorea comentarios cada 2h** y responde TODO en <1h

---

# 📝 POST 2 — r/SideProject (PUBLICA EL MIÉRCOLES)

## Título

```
Launched a $50 SaaS boilerplate with 0 users, 0 MRR, 0 Discord. Here's the honest pitch.
```

## Cuerpo

```
I'll be brutally honest: my starter kit has 0 users, 0 MRR, and no Discord.

But I think that's the right way to sell it.

## The pitch

Next.js 16 + Supabase + Stripe + Resend boilerplate. 22 features, 38 tests, 199 files, 4 docs premium. $50 one-time, lifetime updates.

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

- Code: 12,000+ lines TypeScript
- Tests: 38 passing
- Files: 199
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

---

# 📝 POST 3 — r/supabase (PUBLICA EL VIERNES)

## Título

```
Built a SaaS boilerplate with Supabase SSR + 3 clients pattern (browser/server/admin) + RLS on 8 tables
```

## Cuerpo

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

---

# 📝 POST 4 — r/IndieDev (PUBLICA LUNES SEMANA 2)

## Título

```
I'm 17 and built a $50 SaaS boilerplate. 22 features, 38 tests. Ask me anything.
```

## Cuerpo

```
Hi 👋 I'm 17, from Colombia, and I just published my first SaaS starter kit.

## The product

Next.js 16 + Supabase + Stripe + Resend boilerplate with:
- Auth (Magic Link + OAuth Google/GitHub)
- RBAC middleware (user/free/premium/admin)
- Stripe Checkout + idempotent webhook (no double emails)
- Teams/Organizations multi-seat
- Admin panel with MRR/churn metrics
- Analytics dashboard with Recharts
- API Keys + public endpoint
- 8 React Email templates
- i18n ES/EN/PT (actually wired)
- 38 tests passing
- Dockerfile + CI/CD

## The honest situation

- 0 users (just launched)
- 0 MRR
- No Discord (using GitHub Issues + email)
- No demo hosted (you deploy yourself)

## Why I'm posting here

1. I want to validate if my pricing is right ($50 vs Shipfa.st $199 vs Makerkit $299)
2. I want feedback on what features would make it worth $99+
3. I'm curious about other indie devs' experience selling boilerplates

## Links

- Repo (public): https://github.com/di3go04/nextjs-supabase-starter-kit
- Buy: https://gumroad.com/l/starter-kit-di3go04

## Ask me anything

Honestly curious about:
- Pricing strategy
- Marketing channels (Reddit, Twitter, IH)
- What features I should add next
- Whether to add Discord or stay lean

AMA 👇
```

---

# ⚠️ Reglas CRÍTICAS de Reddit

## ✅ SÍ debes hacer

1. **Participa primero** antes de promocionar: comenta 5-10 posts en el subreddit durante 2-3 días
2. **Responde a todos los comentarios** en <1h las primeras 24h
3. **Sé honesto**: si te preguntan "cuántas ventas?", di "0, just launched today"
4. **Agradece críticas**: si alguien dice "es muy caro", responde "gracias por el feedback, ¿qué precio te parecería justo?"
5. **Usa text posts** (no link posts) — Reddit prefiere contenido, no publicidad

## ❌ NO debes hacer

1. **NO postear link directo a Gumroad** — te banean por spam
2. **NO postear en 3 subreddits el mismo día** — baneo automático
3. **NO upvote tu propio post** con cuentas falsas — baneo permanente
4. **NO responder agresivo** a críticas — baneo temporal
5. **NO promocionar en comentarios** de otros posts sin contexto — ban
6. **NO postear viernes después de 2pm** — engagement cae 70%

---

# 📊 Métricas a esperar

| Post | Upvotes | Comentarios | Clicks al repo | Clicks a Gumroad |
|------|---------|-------------|----------------|------------------|
| r/nextjs | 5-30 | 3-15 | 100-500 | 10-50 |
| r/SideProject | 10-50 | 5-25 | 200-1000 | 20-100 |
| r/supabase | 3-20 | 2-10 | 50-300 | 5-30 |
| r/IndieDev | 5-25 | 3-15 | 100-400 | 10-40 |

## Ventas esperadas en 2 semanas

- **Pesimista**: 0 ventas
- **Realista**: 1-3 ventas = $50-150
- **Optimista**: 5-15 ventas = $250-750

---

# 🚀 Tu acción AHORA

**Empieza con r/nextjs mañana martes 9am Colombia**:

1. Entra a: **https://www.reddit.com/r/nextjs/submit**
2. Selecciona **"Text"** (no Link)
3. Título: `[Show & Tell] Built a Next.js 16 + Supabase + Stripe boilerplate. 22 features, 38 tests, $50.`
4. Pega el cuerpo del POST 1 (de arriba)
5. Click "Submit"
6. Monitorea y responde comentarios en <1h
