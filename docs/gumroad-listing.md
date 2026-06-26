# 📝 Copy para Gumroad — Lista para copiar/pegar

## Título del producto (max 70 chars)

```
Next.js + Supabase SaaS Boilerplate — 22 features, 38 tests
```

## Subtítulo / Tagline (max 100 chars)

```
Lanza tu SaaS en días. Auth, RBAC, Stripe, Teams, Analytics, API Keys, i18n ES/EN/PT. $50 (was $199).
```

## Precio

```
$50 USD
```

## Descripción (copia TODO este bloque)

---

🚀 **Lanza tu SaaS en días, no meses.** Production-ready Next.js 16 + Supabase + Stripe boilerplate with everything you need to ship.

Sin contraseñas. Sin boilerplate repetitivo. Sin reinventar la rueda.

## ⚡ Qué incluye (22 features)

### 🔐 Auth & Seguridad
- **Magic Link + OAuth** (Google/GitHub) via Supabase SSR
- **RBAC con middleware** — roles user / free / premium / admin
- **Security headers** — CSP, HSTS, X-Frame-Options
- **Rate limiting** en auth endpoints (Upstash Redis)
- **Zod validation** en todas las server actions

### 💳 Billing
- **Stripe Checkout** + Billing Portal integrados
- **Webhook IDEMPOTENTE** — no double emails en reintentos de Stripe
- **Dunning flow** — manejo de `invoice.payment_failed` con emails automáticos
- **Audit logs** — registro de cambios de rol y acciones admin

### 📊 Premium features (no en otros boilerplates a $50)
- **Analytics dashboard** con Recharts (MRR, churn, growth, users by plan)
- **In-app notifications** — bell + dropdown + DB table
- **API Keys management** — generate/revoke + public `/api/v1/me` endpoint
- **Teams/Organizations** — multi-seat B2B con invitations por email
- **Admin panel** con MRR/churn metrics + cambio de rol inline

### 🌍 i18n
- **ES / EN / PT** realmente cableado (no scaffolding muerto)
- **Language switcher** basado en cookie
- **Emails localizados** según locale del usuario

### 📧 Emails
- **8 plantillas React Email** + Resend:
  - Welcome, Magic Link, Subscription Success
  - Payment Failed (dunning), Trial Ending, Invoice Receipt
  - Password Reset, Account Deleted

### 🧪 Quality & DevOps
- **38 tests** pasando (Vitest unit + Playwright e2e)
- **Dockerfile** multi-stage + docker-compose
- **GitHub Actions CI** — lint, typecheck, tests, build en cada PR
- **Sentry + Posthog + pino logger** integrados
- **Feature flags** con Vercel Edge Config

### 📚 Documentation
- **README profesional** con badges, comparativa, screenshots
- **ARCHITECTURE.md** — 10 decisiones técnicas explicadas
- **MONETIZATION.md** — playbook de pricing, churn, marketing
- **DEPLOY.md** — guía paso a paso Vercel

## 📸 Screenshots

![Landing](https://github.com/di3go04/nextjs-supabase-starter-kit/releases/download/v1.0.0/01-landing.png)

![Pricing](https://github.com/di3go04/nextjs-supabase-starter-kit/releases/download/v1.0.0/02-pricing.png)

![Login ES](https://github.com/di3go04/nextjs-supabase-starter-kit/releases/download/v1.0.0/03-login-es.png)

![Login EN](https://github.com/di3go04/nextjs-supabase-starter-kit/releases/download/v1.0.0/04-login-en.png)

## 🆚 Comparativa

| Feature | Este kit ($50) | Shipfa.st ($199) | Makerkit ($299) |
|---------|:-:|:-:|:-:|
| Auth Magic Link + OAuth | ✅ | ✅ | ✅ |
| Webhook idempotente | ✅ | ❌ | ✅ |
| Analytics dashboard | ✅ | ❌ | ✅ |
| In-app notifications | ✅ | ❌ | $299+ |
| API Keys + public endpoint | ✅ | ❌ | $299+ |
| Teams / Organizations | ✅ | ❌ | $299+ |
| Admin panel con MRR | ✅ | ❌ | ✅ |
| i18n ES/EN/PT | ✅ | ❌ EN only | ❌ EN only |
| 8 React Email templates | ✅ | 3 | 5 |
| Vitest + Playwright | ✅ | ❌ | ✅ |
| Dockerfile + CI/CD | ✅ | Dockerfile | Dockerfile |
| Sentry + Posthog | ✅ | ❌ | Sentry |
| **Precio** | **$50** | **$199** | **$299** |

## 💰 Por qué $50 (no $89 ni $199)

**Honestidad radical**: no incluyo demo hosteada, ni Discord de soporte, ni video onboarding. Tú deployas tú mismo siguiendo `docs/DEPLOY.md`. El código es el mismo que cobran $199+, pero sin overhead de soporte.

**Valor total**: ~$105 (ver desglose en pricing page)
**Tu precio**: $50
**Ahorras**: $55 (52% off)

## 🚀 Quick start (5 pasos)

```bash
git clone https://github.com/di3go04/nextjs-supabase-starter-kit.git
cd nextjs-supabase-starter-kit
bun install
cp .env.local.example .env.local  # rellena credenciales
bun run dev
```

Necesitas (todo free tier):
- Vercel (gratis)
- Supabase (gratis hasta 50k MAU)
- Stripe (test mode gratis)
- Resend (3,000 emails/mes gratis)

## 📦 Qué recibes tras comprar

1. ✅ **Acceso al repo privado de GitHub** (lectura de por vida)
2. ✅ **Updates de por vida** (v2, v3, etc. gratis)
3. ✅ **4 docs premium** (Architecture + Monetization + Deploy + README)
4. ✅ **Email support** (72h response, sin Discord)
5. ✅ **Garantía 14 días** — si no te sirve, 100% reembolso

## 📜 License

Dual license: **MIT** (uso personal/open-source) + **Commercial** (1 proyecto comercial pagado).

Para multi-proyecto, compra 2 licencias o contáctame.

## ❓ FAQ

**¿Necesito saber programar?**
Sí. Esto es para developers con experiencia en React/Next.js.

**¿Cuánto tarda en estar listo?**
1-3 días siguiendo `docs/DEPLOY.md`.

**¿Hay reembolso?**
Sí, 14 días sin preguntas.

**¿Actualizaciones?**
Lifetime. Cuando saque v2, te llega el link por email.

**¿Cómo recibo el código?**
Tras pagar, recibes email con el link al repo privado de GitHub.

---

⭐ **Garantía 14 días · Pago único · Lifetime updates**

¿Preguntas antes de comprar? Email: `support@di3go04.dev`

---

## Tags (para Gumroad Discover)

```
nextjs, supabase, stripe, react, typescript, tailwindcss, shadcn-ui,
boilerplate, starter-kit, saas, resend, i18n, rbac, vercel, docker,
auth, oauth, magic-link, webhook, react-email, vitest, playwright
```

## Cupón de launch (opcional, primeros 10 compradores)

```
Código: LAUNCH50
Descuento: 50% off
Precio final: $25
Válido: 7 días desde publicación
Mensaje: "Solo para los primeros 10 compradores — después sube a $50"
```
