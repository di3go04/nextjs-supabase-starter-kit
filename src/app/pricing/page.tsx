"use client";

import Link from "next/link";
import { Check, Zap, Code2, FileText, Github, Shield, BarChart3, Bell, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const INCLUDED = [
  // Core
  "Full source code (Next.js 16 + Supabase + Stripe + Resend)",
  "Auth Magic Link + OAuth (Google/GitHub)",
  "RBAC middleware (user/free/premium/admin)",
  "Stripe Checkout + idempotent webhook",
  "8 React Email templates",
  "i18n ES/EN/PT (next-intl)",
  // Premium (justifica el salto a $50)
  "📊 Analytics dashboard with Recharts (MRR, churn, growth)",
  "🔔 In-app notifications system (bell + dropdown)",
  "🔑 API Keys management + public /api/v1 endpoint",
  "👥 Teams/Organizations multi-seat + invitations",
  "🛡️ Admin panel with MRR/churn metrics + audit logs",
  // DevOps
  "Vitest + Playwright tests (38 passing)",
  "Dockerfile + docker-compose + GitHub Actions CI",
  "Sentry + Posthog + pino logger",
  "Rate limiting + security headers (CSP, HSTS)",
  // Docs
  "📚 ARCHITECTURE.md — 10 decisions explained",
  "📚 MONETIZATION.md — pricing, churn, marketing playbook",
  "📚 DEPLOY.md — Vercel 1-click guide",
  // License
  "Lifetime updates (v1, v2, v3...)",
  "MIT + Commercial license (1 project)",
  "Email support (72h response)",
  "Self-serve docs (README + 4 guides)",
];

const HONESTY = [
  { label: "❌ No incluye", value: "Demo en vivo hosteada por mí" },
  { label: "❌ No incluye", value: "Discord privado / soporte prioritario" },
  { label: "❌ No incluye", value: "Onboarding calls o consultoría" },
  { label: "❌ No incluye", value: "Customizaciones a medida" },
  { label: "✅ Sí incluye", value: "Código completo para que deployes tú" },
  { label: "✅ Sí incluye", value: "Guía paso a paso (docs/deploy.md)" },
  { label: "✅ Sí incluye", value: "GitHub Issues para preguntas" },
  { label: "✅ Sí incluye", value: "Actualizaciones de por vida" },
];

const VALUE_BREAKDOWN = [
  { item: "Auth + RBAC + middleware", value: "$15" },
  { item: "Stripe + webhook idempotente", value: "$10" },
  { item: "Analytics dashboard + Recharts", value: "$8" },
  { item: "In-app notifications system", value: "$5" },
  { item: "API Keys + public endpoint", value: "$7" },
  { item: "Teams/Organizations + invitations", value: "$10" },
  { item: "Admin panel + audit logs", value: "$8" },
  { item: "8 React Email templates", value: "$5" },
  { item: "i18n ES/EN/PT", value: "$5" },
  { item: "Tests + Docker + CI", value: "$7" },
  { item: "Sentry + Posthog + logger", value: "$5" },
  { item: "Docs premium (Architecture + Monetization)", value: "$10" },
  { item: "Lifetime updates", value: "$∞" },
];

const FAQ = [
  {
    q: "¿Por qué $50 y no $89?",
    a: "Porque no incluyo demo en vivo ni Discord de soporte. Tú deployas tú mismo con la guía incluida. El código vale $89+, pero al no tener overhead de soporte, te lo paso a $50.",
  },
  {
    q: "¿Qué diferencia hay entre $50 y otros boilerplates a $199?",
    a: "Otros incluyen demo hosteada, Discord, video onboarding y soporte prioritario. Mi kit tiene el MISMO código y features, pero tú haces el deploy. Ahorras $149.",
  },
  {
    q: "¿Necesito saber programar?",
    a: "Sí. Esto es para developers con experiencia en React/Next.js. Si no sabes TypeScript, contrata a uno.",
  },
  {
    q: "¿Cuánto tarda en estar listo?",
    a: "1-3 días siguiendo docs/deploy.md. Necesitas: cuenta gratis en Vercel + Supabase + Stripe + Resend. Todo free tier.",
  },
  {
    q: "¿Hay reembolso?",
    a: "Sí, 14 días. Si el código no te sirve, te devuelvo el 100%. Solo responde al email de compra.",
  },
  {
    q: "¿Actualizaciones?",
    a: "Lifetime. Cuando saque v2, v3, etc., te llega el link de descarga por email.",
  },
  {
    q: "¿Puedo usarlo para múltiples proyectos?",
    a: "La licencia $50 cubre 1 proyecto comercial. Para multi-proyecto, compra 2 licencias o contáctame por la Team License.",
  },
  {
    q: "¿Cómo recibo el código?",
    a: "Tras pagar, recibes un email con el link al repo privado de GitHub. Te doy acceso de lectura de por vida.",
  },
  {
    q: "¿Y si encuentro un bug?",
    a: "Abre un Issue en GitHub. Lo arreglo y subo fix en la próxima versión. Sin SLA, pero respondo todos los issues.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Shield className="h-5 w-5 text-primary" />
            Starter Kit
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link href="/">← Volver</Link></Button>
            <Button asChild size="sm"><Link href="/register">Probar demo</Link></Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <Badge variant="secondary" className="mb-4">
              <Zap className="mr-1 h-3 w-3" /> One-time payment · Lifetime updates
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Un solo pago.{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                22 features premium.
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Sin suscripciones. Sin Discord. Sin overhead. Solo código production-ready + docs premium.
            </p>
          </div>
        </section>

        {/* Pricing card */}
        <section className="border-b">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <Card className="border-primary shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-3">
                  <Badge className="bg-primary text-primary-foreground">
                    <Zap className="mr-1 h-3 w-3" /> Single Payment
                  </Badge>
                </div>
                <CardTitle className="text-2xl">Developer License</CardTitle>
                <CardDescription>Para 1 proyecto comercial · 22 features incluidas</CardDescription>
                <div className="mt-6">
                  <span className="text-6xl font-bold">$50</span>
                  <span className="text-lg text-muted-foreground ml-2">USD</span>
                  <p className="text-xs text-muted-foreground mt-2">
                    <span className="line-through">$199 valor real</span> · Ahorras $149
                  </p>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold mb-3 text-emerald-600">✅ Todo incluido</p>
                    <ul className="space-y-2 text-sm">
                      {INCLUDED.slice(0, 11).map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-3 text-emerald-600">✅ Y también</p>
                    <ul className="space-y-2 text-sm">
                      {INCLUDED.slice(11).map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-3 pt-6">
                <Button asChild size="lg" className="w-full">
                  <a href="https://gumroad.com/l/starter-kit-di3go04" target="_blank" rel="noopener noreferrer">
                    <Zap className="mr-2 h-4 w-4" /> Comprar $50 — Lifetime access
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Garantía 14 días · Email de soporte · Sin subscripción
                </p>
              </CardFooter>
            </Card>

            {/* Value breakdown */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center mb-6">Desglose de valor</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-3">
                    {VALUE_BREAKDOWN.map((v) => (
                      <div key={v.item} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                        <span className="text-muted-foreground">{v.item}</span>
                        <span className="font-mono font-semibold">{v.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t-2 border-primary text-center">
                    <p className="text-sm text-muted-foreground">Valor total ≈ <span className="line-through">$105</span></p>
                    <p className="text-2xl font-bold text-emerald-600 mt-1">Tu precio: $50</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Honestidad */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-center mb-6">Honestidad radical</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {HONESTY.map((h, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-semibold">{h.label}:</span>{" "}
                        <span className="text-muted-foreground">{h.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
                    <p>
                      💡 <strong>Precio honesto = producto honesto.</strong> Si en el futuro añado demo en vivo + Discord,
                      el precio sube a $89. Los que compren ahora a $50 reciben el mismo código y todas las actualizaciones futuras gratis.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Lo que recibes tras comprar</h2>
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader>
                  <Code2 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-base">Código fuente</CardTitle>
                  <CardDescription>170+ archivos, repo GitHub privado</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-base">Docs premium</CardTitle>
                  <CardDescription>Architecture + Monetization + Deploy</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-base">Analytics ready</CardTitle>
                  <CardDescription>Dashboard con gráficos incluido</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Github className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-base">Updates forever</CardTitle>
                  <CardDescription>Cada nuevo feature v1.x, v2, v3... gratis</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-b">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-12">Preguntas frecuentes</h2>
            <div className="space-y-6">
              {FAQ.map((item) => (
                <div key={item.q}>
                  <h3 className="font-semibold mb-2">{item.q}</h3>
                  <p className="text-muted-foreground text-sm">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <h2 className="text-3xl font-bold">¿Listo para empezar?</h2>
            <p className="mt-2 opacity-90">
              $50 · Pago único · Garantía 14 días · Updates de por vida
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="secondary">
                <a href="https://gumroad.com/l/starter-kit-di3go04" target="_blank" rel="noopener noreferrer">
                  <Zap className="mr-2 h-4 w-4" /> Comprar ahora
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Ver demo gratis</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          © 2026 Starter Kit · MIT + Commercial dual license
        </div>
      </footer>
    </div>
  );
}
