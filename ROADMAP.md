# Roadmap

Public roadmap for the Next.js + Supabase Starter Kit. Vote on issues you want prioritized.

## ✅ v1.0 (Shipped)

- [x] Auth Magic Link + OAuth (Google/GitHub)
- [x] RBAC with middleware + RLS
- [x] Stripe Checkout + Webhook (idempotent)
- [x] Admin panel with MRR/churn metrics
- [x] Teams / Organizations + invitations
- [x] i18n ES/EN/PT
- [x] 8 email templates with Resend
- [x] Vitest + Playwright tests
- [x] Docker + CI/CD
- [x] Sentry + Posthog + pino logger
- [x] Feature flags with Edge Config

## 🚀 v1.1 (Next 30 days)

- [ ] **API Keys UI** — let users generate/revoke personal API tokens
- [ ] **Usage tracking** — enforce "10k API calls / month" quota per plan
- [ ] **2FA / MFA** — wire up Supabase MFA enrollment + verification flow
- [ ] **Email verification** banner for unverified accounts
- [ ] **Password reset** flow (currently only Magic Link)
- [ ] **A/B testing** via Posthog Experiments integration

## 🎯 v1.2 (Next 60 days)

- [ ] **Webhooks out** — let users register their own webhook endpoints
- [ ] **Audit log filters** — date range, action type, actor search
- [ ] **Admin impersonation** — admin can "log in as" a user for support
- [ ] **Subscription pause/resume** — Stripe supports it, need UI
- [ ] **Coupon / promo codes** — Stripe Coupon API integration
- [ ] **Affiliate program** — let users earn commission referring others

## 🌟 v1.3 (Next 90 days)

- [ ] **Native mobile** — React Native (Expo) client sharing the Supabase schema
- [ ] **Chrome extension** template for browser-based SaaS
- [ ] **AI features** — RAG chatbot, embeddings search (using Supabase pgvector)
- [ ] **Multi-currency** — let users pay in EUR/GBP/BRL
- [ ] **EU VAT** — automatic VAT handling for EU customers
- [ ] **Webhook retries UI** — show failed webhook deliveries in admin

## 💡 Under Consideration

- Prisma ORM option (instead of Supabase JS client)
- Drizzle ORM option
- Auth.js alternative (in addition to Supabase Auth)
- CouchDB / MongoDB adapter
- Self-hosted deployment guide (Coolify, Dokploy, CapRover)
- Edge runtime for billing endpoints

## ❌ Not Planned

These are intentionally out of scope:

- **GraphQL** — we use Server Actions and tRPC would add complexity
- **CSS-in-JS** — we use Tailwind, that's it
- **Redux** — React Query + Zustand cover all state needs
- **Vue/Svelte** — Next.js only
- **Pages Router** — App Router only

## Voting

Open an issue with the `enhancement` label and add 👍 reactions. Issues with >10 reactions move to the top of the next milestone.
