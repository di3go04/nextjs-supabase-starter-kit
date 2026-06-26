<div align="center">

# Next.js + Supabase Starter Kit

**Lanza tu SaaS en días, no meses.** Auth, RBAC, Stripe, emails, i18n, teams, admin panel, tests y deploy en 1 clic.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-SSR-3ECF8E?logo=supabase)](https://supabase.com)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout-635BFF?logo=stripe)](https://stripe.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tests](https://img.shields.io/badge/Tests-20%20passing-brightgreen)](#)
[![License](https://img.shields.io/badge/License-MIT%20%2B%20Commercial-blue)](./LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](./CHANGELOG.md)

**[🛒 Comprar $29](https://gumroad.com/l/starter-kit-di3go04)** · [⭐ Star en GitHub](https://github.com/di3go04/nextjs-supabase-starter-kit) · [📚 Documentación](./docs/deploy.md)

</div>

---

## 📸 Screenshots

<table>
  <tr>
    <td width="50%" align="center"><b>Landing page</b></td>
    <td width="50%" align="center"><b>Login (Magic Link + OAuth)</b></td>
  </tr>
  <tr>
    <td><img src="./screenshots/01-landing.png" alt="Landing"/></td>
    <td><img src="./screenshots/02-login.png" alt="Login"/></td>
  </tr>
  <tr>
    <td align="center"><b>Pricing — $29 single payment</b></td>
    <td align="center"><b>i18n EN/ES/PT funcional</b></td>
  </tr>
  <tr>
    <td><img src="./screenshots/04-pricing.png" alt="Pricing"/></td>
    <td><img src="./screenshots/05-i18n-english.png" alt="i18n English"/></td>
  </tr>
</table>

---

## 💰 Precio honesto: $29

Sin demo hosteada. Sin Discord. Sin soporte premium. Solo **código production-ready** + docs.

**¿Por qué $29 y no $89?**

| Lo que SÍ incluye | Lo que NO incluye |
|-------------------|-------------------|
| ✅ Código completo (159 archivos) | ❌ Demo en vivo hosteada por mí |
| ✅ Documentación paso a paso | ❌ Discord / soporte prioritario |
| ✅ Updates de por vida (v1, v2, v3) | ❌ Onboarding calls |
| ✅ Email de soporte (72h) | ❌ Customizaciones a medida |
| ✅ MIT + Commercial license (1 proyecto) | ❌ Multi-project license |

Si en el futuro añado demo + Discord, el precio sube a $89. **Los que compran ahora a $29 reciben el mismo código y todas las actualizaciones futuras gratis.**

---

## 🎯 Por qué este kit

Construir un SaaS desde cero toma 3-6 meses solo para tener auth + pagos + emails funcionando. Este kit te da todo eso en 1-3 días, con patrones de producción (no demos):

- ✅ **Webhook de Stripe idempotente** (la mayoría de boilerplates lo ignoran → bug de dobles emails en producción).
- ✅ **i18n ES/EN/PT realmente cableado** (otros kits anuncian i18n pero toda la UI está en inglés hardcoded).
- ✅ **Admin panel con MRR/churn** (no solo "lista de usuarios").
- ✅ **Teams/Organizations** multi-seat (la mayoría de kits a $89 no lo incluyen).
- ✅ **8 plantillas de email** (no 2-3 como otros).
- ✅ **Tests reales** (Vitest + Playwright, no solo "tests passing" en README).
- ✅ **Dockerfile multi-stage + CI/CD** (la mayoría incluyen solo Dockerfile básico).
- ✅ **Sentry + Posthog + pino logger** integrados (otros: nada).
- ✅ **Security headers** (CSP, HSTS, X-Frame-Options) en next.config.

## ⚡ Quick start

```bash
git clone https://github.com/di3go04/nextjs-supabase-starter-kit.git
cd nextjs-supabase-starter-kit
bun install     # o npm install
cp .env.local.example .env.local  # rellena credenciales
bun run dev
```

## 📊 Lo que recibes

```
159 archivos · 5.000+ líneas de código TypeScript

src/
├── app/
│   ├── (auth)/{login,register,auth/callback}        # Auth pública
│   ├── dashboard/{page,profile,billing,admin,teams} # App privada
│   ├── pricing/                                     # Landing de venta
│   ├── api/webhooks/stripe/                         # Webhook idempotente
│   ├── actions/{auth,profile,billing,admin,teams}.ts # Server Actions
│   └── {error,loading,not-found,sitemap,robots,manifest}.tsx
├── components/{dashboard,providers,language-switcher,theme-toggle}
├── context/user-context.tsx                         # useUser hook
├── emails/                                          # 8 plantillas React Email
├── i18n/ + messages/{es,en,pt}.json                 # i18n completo
├── lib/{supabase,stripe,resend,rbac,flags,logger,ratelimit,site,types}.ts
└── middleware.ts                                    # Auth + RBAC

supabase/                  # 5 SQL migrations
├── profiles.sql           # Tabla + RLS + triggers + bucket avatars
├── subscriptions.sql      # Sincronizada con Stripe
├── webhook_events.sql     # Idempotencia
├── audit_logs.sql         # Trazabilidad admin
├── teams.sql              # Multi-seat B2B
└── seed.sql               # 6 usuarios demo

Dockerfile + docker-compose.yml + .github/workflows/ci.yml
tests/unit/ (20 tests) + tests/e2e/ (3 specs)
```

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

## 🔧 Setup (5 pasos · todo con free tier)

### 1. Clonar e instalar

```bash
git clone https://github.com/di3go04/nextjs-supabase-starter-kit.git
cd nextjs-supabase-starter-kit
bun install     # o npm install
cp .env.local.example .env.local
```

### 2. Configurar Supabase (gratis)

1. Crea proyecto en [supabase.com](https://supabase.com) (free tier: 500MB DB, 50k MAU).
2. Copia URL + anon key + service_role a `.env.local`.
3. En SQL Editor, ejecuta en orden:
   - `supabase/profiles.sql`
   - `supabase/subscriptions.sql`
   - `supabase/webhook_events.sql`
   - `supabase/audit_logs.sql`
   - `supabase/teams.sql`
   - (opcional) `supabase/seed.sql` para datos demo
4. Habilita Google y GitHub en Authentication → Providers.
5. Añade `http://localhost:3000/auth/callback` a las URLs de redirección.

### 3. Configurar Stripe (test mode gratis)

1. Copia `sk_test_xxx` y `pk_test_xxx` a `.env.local`.
2. Crea productos Pro ($19) y Enterprise ($99), pega los `price_xxx`.
3. Para webhook local: `bun run stripe:listen` (copia el `whsec_xxx` a `.env.local`).

### 4. Configurar Resend (3.000 emails/mes gratis)

```bash
# Mientras verificas dominio, usa onboarding@resend.dev
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### 5. Run

```bash
bun run dev     # http://localhost:3000
```

## 🚀 Deploy en Vercel (free tier)

```bash
./deploy-vercel.sh
```

El script sube las variables automáticamente y hace deploy. Ver [`docs/deploy.md`](./docs/deploy.md) para guía completa.

**Costos**: Vercel free (hobby) + Supabase free + Stripe (solo comisiones por venta) + Resend free = **$0/mes** hasta que tengas tráfico real.

## 🧪 Tests

```bash
bun run test           # Vitest unit (20 tests)
bun run test:e2e       # Playwright e2e
bun run test:coverage  # Coverage report
```

## 🐳 Docker

```bash
docker compose --profile dev up   # app + redis + stripe-cli
docker build -t starter-kit .     # producción
```

## 📦 Comprar

| Plan | Precio | Incluye |
|------|--------|---------|
| **Developer License** | **$29** | 1 proyecto commercial, updates de por vida, email soporte |
| Team License (próximamente) | $99 | 5 proyectos, soporte prioritario |
| Lifetime License (próximamente) | $199 | Proyectos ilimitados |

👉 **[Comprar $29 en Gumroad](https://gumroad.com/l/starter-kit-di3go04)**

Garantía 14 días. Si no te sirve, te devuelvo el 100% sin preguntas.

## 📜 Licencia

Dual license: **MIT** (uso personal/open-source) + **Commercial** (productos pagos).

Ver [`LICENSE`](./LICENSE) para detalle.

## 💬 Soporte

- 🐛 [GitHub Issues](https://github.com/di3go04/nextjs-supabase-starter-kit/issues) — Bugs y feature requests
- 💡 [GitHub Discussions](https://github.com/di3go04/nextjs-supabase-starter-kit/discussions) — Preguntas técnicas
- 📧 Email: `support@di3go04.dev` (72h response)

## 🙏 Créditos

Construido con [Next.js](https://nextjs.org), [Supabase](https://supabase.com), [Stripe](https://stripe.com), [Resend](https://resend.com), [shadcn/ui](https://ui.shadcn.com), [Tailwind CSS](https://tailwindcss.com).

---

<div align="center">

**[🛒 Comprar $29](https://gumroad.com/l/starter-kit-di3go04)** · Garantía 14 días · Updates de por vida

</div>
