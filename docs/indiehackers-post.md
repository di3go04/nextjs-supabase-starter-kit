# 🟢 IndieHackers — Post de lanzamiento

## Título del post

```
Lancé un Next.js + Supabase Starter Kit por $50 (sin usuarios, sin MRR, sin Discord)
```

## Cuerpo del post (copia TODO)

---

Hola IH 👋

Lancé hoy un **Next.js + Supabase Starter Kit** a **$50** y quiero contarte la historia honesta de por qué lo hago sin las típicas "trampas" de boilerplates caros.

## El problema

Construir un SaaS desde cero toma 3-6 meses solo para tener auth + pagos + emails + roles + i18n funcionando. Esas son las "table stakes" que TODO SaaS necesita, pero que nadie quiere programar desde cero.

Existen soluciones como:
- **Shipfa.st** ($199)
- **Makerkit** ($299)
- **Indie Boilerplate** ($89)

Pero todas asumen que quieres demo hosteada, Discord de soporte, video onboarding y otras cosas que suben el precio sin sumar al código.

## Mi enfoque: precio honesto

Voy a ser brutalmente honesto sobre lo que incluyo y lo que NO:

**✅ Sí incluye ($50):**
- 173 archivos de código TypeScript production-ready
- 22 features (Auth, RBAC, Stripe webhook idempotente, Teams, Analytics, API Keys, Admin panel, 8 emails, i18n ES/EN/PT, 38 tests, Docker, CI/CD, Sentry, Posthog)
- 4 docs premium (Architecture + Monetization + Deploy + README)
- Updates de por vida (v1, v2, v3...)
- Email support 72h
- Garantía 14 días

**❌ NO incluye:**
- Demo hosteada (tú deployas tú mismo con la guía)
- Discord de soporte (uso GitHub Issues y email)
- Video onboarding (la doc escrita es mejor)
- Customizaciones a medida

## ¿Por qué $50 y no $89?

Porque sin overhead de soporte/Discord/demo, mi costo marginal por venta es $0. No necesito cobrar $89 para ser rentable. $50 × 100 ventas/mes = $5,000 MRR equivalente.

Si en el futuro añado demo + Discord, el precio sube a $89. Los que compran ahora a $50 reciben el mismo código y todas las actualizaciones futuras gratis.

## Las 3 features que me diferencian

### 1. Webhook de Stripe IDEMPOTENTE
La mayoría de boilerplates no lo hacen. Resultado: si Stripe reintenta un webhook (que lo hace), envías 2-3 emails de bienvenida al mismo usuario. El mío usa tabla `webhook_events` con `event_id` único para deduplicar.

### 2. i18n ES/EN/PT REAL
Otros kits anuncian "i18n included" pero Toda la UI está en inglés hardcodeado. El mío usa `next-intl` con `useTranslations()` en TODA la UI, switcher basado en cookie, y los emails también están localizados.

### 3. Analytics dashboard con Recharts
Ningún boilerplate a $50 incluye esto. MRR, churn, growth, users by plan, users by role, recent events. Todo con gráficos Recharts.

## Los números honestos

- 📦 Líneas de código: ~5,000 TypeScript
- 🧪 Tests: 38 pasando (Vitest + Playwright)
- 📚 Docs: 4 archivos premium
- 💰 Precio: $50 (vs $105 valor real = 52% off)
- ⏱️ Tiempo hasta deploy: 1-3 días con docs/DEPLOY.md

## Cómo lo compro

1. Pago $50 en Gumroad: https://gumroad.com/l/starter-kit-di3go04
2. Recibo email con acceso al repo GitHub privado
3. Clono, configuro `.env`, deployo en Vercel
4. Si no me sirve en 14 días, reembolso 100%

## Lo que voy a aprender (y compartiré en IH)

Voy a documentar en IH cada semana:
- Semana 1: ¿conseguí mi primera venta?
- Semana 2-4: optimización de conversión
- Mes 2-3: ¿llego a $1,000 MRR equivalente?

Si te interesa el código o seguir el journey, aquí me ves:

🔗 **Repo público**: https://github.com/di3go04/nextjs-supabase-starter-kit
🛒 **Comprar**: https://gumroad.com/l/starter-kit-di3go04

¿Preguntas? Adelante en los comentarios 👇

---

## Categoría en IndieHackers

Publica en: **Milestones** → "I launched"

## Mejor hora para postear

- Martes o miércoles, 8-10am ET (mejor engagement en IH)
- Evita viernes tarde y fin de semana

## Después de publicar

1. **Responde a TODOS los comentarios** en las primeras 2h (algoritmo de IH)
2. **Comparte el link en Twitter** con screenshot del primer comentario
3. **Vuelve a comentar tú mismo** a las 24h con una actualización ("gracias por el feedback, ya tengo 5 estrellas en GitHub")
