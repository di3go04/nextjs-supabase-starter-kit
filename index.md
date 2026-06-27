---
layout: default
title: Next.js + Supabase Starter Kit
description: Lanza tu SaaS en días. Auth, RBAC, Stripe, emails, i18n, teams, admin panel.
---

<div style="text-align: center; margin-bottom: 2rem;">

# 🚀 Next.js + Supabase Starter Kit

### Lanza tu SaaS en días, no meses.

Auth · RBAC · Stripe · Emails · i18n · Teams · Admin Panel · Tests · Docker · CI/CD

<p>
  <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js"></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-SSR-3ECF8E?logo=supabase" alt="Supabase"></a>
  <a href="https://stripe.com"><img src="https://img.shields.io/badge/Stripe-Checkout-635BFF?logo=stripe" alt="Stripe"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript"></a>
  <img src="https://img.shields.io/badge/Tests-38%20passing-brightgreen" alt="Tests">
  <img src="https://img.shields.io/badge/License-MIT%20%2B%20Commercial-blue" alt="License">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
</p>

<p>
  <a href="https://gumroad.com/l/starter-kit-di3go04" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">🛒 Comprar $50</a>
  &nbsp;
  <a href="https://github.com/di3go04/nextjs-supabase-starter-kit" style="background: #24292e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">⭐ Ver en GitHub</a>
</p>

</div>

---

## 📸 Screenshots

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 2rem 0;">

<div>

**Landing page**

![Landing](https://raw.githubusercontent.com/di3go04/nextjs-supabase-starter-kit/main/screenshots/01-landing.png)

</div>

<div>

**Pricing — $50 single payment**

![Pricing](https://raw.githubusercontent.com/di3go04/nextjs-supabase-starter-kit/main/screenshots/02-pricing.png)

</div>

<div>

**Login (Magic Link + OAuth)**

![Login ES](https://raw.githubusercontent.com/di3go04/nextjs-supabase-starter-kit/main/screenshots/03-login-es.png)

</div>

<div>

**i18n EN/ES/PT funcional**

![Login EN](https://raw.githubusercontent.com/di3go04/nextjs-supabase-starter-kit/main/screenshots/04-login-en.png)

</div>

</div>

---

## 💰 Precio honesto: $50

Sin demo hosteada. Sin Discord. Sin soporte premium. Solo **código production-ready** + docs.

**¿Por qué $50 y no $89?**

| Lo que SÍ incluye | Lo que NO incluye |
|-------------------|-------------------|
| ✅ Código completo (199 archivos) | ❌ Demo en vivo hosteada |
| ✅ Documentación paso a paso | ❌ Discord / soporte prioritario |
| ✅ Updates de por vida (v1, v2, v3) | ❌ Onboarding calls |
| ✅ Email de soporte (72h) | ❌ Customizaciones a medida |
| ✅ MIT + Commercial license (1 proyecto) | ❌ Multi-project license |

---

## 🎯 Por qué este kit

Construir un SaaS desde cero toma 3-6 meses solo para tener auth + pagos + emails funcionando. Este kit te da todo eso en 1-3 días, con patrones de producción (no demos):

- ✅ **Webhook de Stripe idempotente** (la mayoría de boilerplates lo ignoran → bug de dobles emails en producción)
- ✅ **i18n ES/EN/PT realmente cableado** (otros kits anuncian i18n pero toda la UI está en inglés hardcoded)
- ✅ **Admin panel con MRR/churn** (no solo "lista de usuarios")
- ✅ **Teams/Organizations** multi-seat (la mayoría de kits a $50 no lo incluyen)
- ✅ **8 plantillas de email** (no 2-3 como otros)
- ✅ **Tests reales** (Vitest + Playwright, no solo "tests passing" en README)
- ✅ **Dockerfile multi-stage + CI/CD** (la mayoría incluyen solo Dockerfile básico)
- ✅ **Sentry + Posthog + pino logger** integrados (otros: nada)
- ✅ **Security headers** (CSP, HSTS, X-Frame-Options) en next.config

---

## ⚡ Quick start

```bash
git clone https://github.com/di3go04/nextjs-supabase-starter-kit.git
cd nextjs-supabase-starter-kit
bun install     # o npm install
cp .env.local.example .env.local  # rellena credenciales
bun run dev
```

---

## 📊 Lo que recibes

- **199 archivos** · **12,089 líneas de código TypeScript**
- **38 tests pasando** (Vitest + Playwright)
- **9 SQL migrations** para Supabase
- **12 docs premium** (Architecture, Monetization, Deploy, Selling Guide, etc.)
- **22 features** completas
- **7 screenshots** profesionales

---

## 🛠️ Stack

| Capa | Tech |
|------|------|
| Framework | Next.js 16 (App Router, RSC, Server Actions, Turbopack) |
| Lenguaje | TypeScript 5 (strict mode) |
| Auth | Supabase SSR + Magic Link + OAuth (Google/GitHub) |
| DB / Storage | Supabase (Postgres + RLS + Storage) |
| Pagos | Stripe Checkout + Billing Portal + Webhooks idempotentes |
| Emails | Resend + React Email (8 plantillas) |
| i18n | next-intl (ES/EN/PT) |
| UI | Tailwind CSS 4 + shadcn/ui (45+ componentes) |
| Estado | React Query + Zustand |
| Validación | Zod |
| Tests | Vitest + Playwright + Testing Library |
| Observabilidad | Sentry + Posthog + pino |
| DevOps | Dockerfile multi-stage + GitHub Actions CI |

---

## 🚀 Deploy en Vercel (free tier)

```bash
./deploy-vercel.sh
```

**Costos**: Vercel free (hobby) + Supabase free + Stripe (solo comisiones por venta) + Resend free = **$0/mes** hasta que tengas tráfico real.

---

## 🧪 Tests

```bash
bun run test           # Vitest unit (38 tests)
bun run test:e2e       # Playwright e2e
bun run test:coverage  # Coverage report
```

---

## 🐳 Docker

```bash
docker compose --profile dev up   # app + redis + stripe-cli
docker build -t starter-kit .     # producción
```

---

## 📦 Comprar

| Plan | Precio | Incluye |
|------|--------|---------|
| **Developer License** | **$50** | 1 proyecto commercial, updates de por vida, email soporte |
| Team License (próximamente) | $99 | 5 proyectos, soporte prioritario |
| Lifetime License (próximamente) | $199 | Proyectos ilimitados |

👉 **[Comprar $50 en Gumroad](https://gumroad.com/l/starter-kit-di3go04)**

Garantía 14 días. Si no te sirve, te devuelvo el 100% sin preguntas.

---

## 📜 Licencia

Dual license: **MIT** (uso personal/open-source) + **Commercial** (productos pagos).

Ver [LICENSE](https://github.com/di3go04/nextjs-supabase-starter-kit/blob/main/LICENSE) para detalle.

---

## 💬 Soporte

- 🐛 [GitHub Issues](https://github.com/di3go04/nextjs-supabase-starter-kit/issues) — Bugs y feature requests
- 💡 [GitHub Discussions](https://github.com/di3go04/nextjs-supabase-starter-kit/discussions) — Preguntas técnicas
- 📧 Email: `support@di3go04.dev` (72h response)

---

## 📚 Documentación

- [Architecture decisions](https://github.com/di3go04/nextjs-supabase-starter-kit/blob/main/docs/ARCHITECTURE.md)
- [Monetization guide](https://github.com/di3go04/nextjs-supabase-starter-kit/blob/main/docs/MONETIZATION.md)
- [Deploy guide](https://github.com/di3go04/nextjs-supabase-starter-kit/blob/main/docs/deploy.md)
- [Selling guide](https://github.com/di3go04/nextjs-supabase-starter-kit/blob/main/docs/SELLING-GUIDE.md)
- [30 platforms to sell](https://github.com/di3go04/nextjs-supabase-starter-kit/blob/main/docs/30-platforms-list.md)
- [30 products to build](https://github.com/di3go04/nextjs-supabase-starter-kit/blob/main/docs/30-products-to-build.md)

---

<div style="text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e1e4e8;">

**[🛒 Comprar $50](https://gumroad.com/l/starter-kit-di3go04)** · Garantía 14 días · Updates de por vida

Hecho con ❤️ para devs que quieren lanzar rápido.

</div>
