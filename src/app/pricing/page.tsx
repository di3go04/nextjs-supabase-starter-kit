"use client";

import Link from "next/link";
import { Check, Zap, Code2, FileText, Github, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const INCLUDED = [
  "Full source code (Next.js 16 + Supabase + Stripe + Resend)",
  "Auth Magic Link + OAuth (Google/GitHub)",
  "RBAC middleware (user/free/premium/admin)",
  "Stripe Checkout + idempotent webhook",
  "Admin panel with MRR/churn metrics",
  "Teams/Organizations + invitations",
  "8 React Email templates",
  "i18n ES/EN/PT",
  "Vitest + Playwright tests (20 passing)",
  "Dockerfile + docker-compose + CI/CD",
  "Sentry + Posthog + pino logger",
  "Rate limiting + security headers",
  "Lifetime updates (v1, v2, v3...)",
  "MIT + Commercial license (1 project)",
  "Email support (72h response)",
  "Self-serve docs (README + deploy guide)",
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

const FAQ = [
  {
    q: "¿Por qué $29 y no $89?",
    a: "Porque no incluyo demo en vivo ni Discord de soporte. Tú deployas tú mismo con la guía incluida. El código vale $89+, pero al no tener overhead de soporte, te lo paso a $29.",
  },
  {
    q: "¿Necesito saber programar?",
    a: "Sí. Esto es para developers. Si no sabes Next.js/Supabase, contrata a uno o usa un no-code builder como Bubble.",
  },
  {
    q: "¿Cuánto tarda en estar listo?",
    a: "1-3 días si sigues docs/deploy.md. Necesitas: cuenta gratis en Vercel + Supabase + Stripe + Resend. Todo tiene free tier.",
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
    a: "La licencia $29 cubre 1 proyecto comercial. Para multi-proyecto, compra 2 licencias o contáctame por la Team License.",
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
                Código completo.
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Sin suscripciones. Sin Discord. Sin overhead. Solo código production-ready.
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
                <CardDescription>Para 1 proyecto comercial</CardDescription>
                <div className="mt-6">
                  <span className="text-6xl font-bold">$29</span>
                  <span className="text-lg text-muted-foreground ml-2">USD</span>
                  <p className="text-xs text-muted-foreground mt-2 line-through">$89 precio normal</p>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-semibold mb-3 text-emerald-600">✅ Todo incluido</p>
                    <ul className="space-y-2 text-sm">
                      {INCLUDED.slice(0, 8).map((f) => (
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
                      {INCLUDED.slice(8).map((f) => (
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
                    <Zap className="mr-2 h-4 w-4" /> Comprar $29 — Lifetime access
                  </a>
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Garantía 14 días · Email de soporte · Sin subscripción
                </p>
              </CardFooter>
            </Card>

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
                      el precio sube a $89. Los que compren ahora a $29 reciben el mismo código y todas las actualizaciones futuras gratis.
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
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <Code2 className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-base">Código fuente</CardTitle>
                  <CardDescription>Acceso al repo GitHub privado de por vida</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mb-2" />
                  <CardTitle className="text-base">Documentación</CardTitle>
                  <CardDescription>README + deploy.md + CHANGELOG + ROADMAP</CardDescription>
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
              $29 · Pago único · Garantía 14 días · Updates de por vida
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="secondary">
                <a href="https://gumroad.com/l/starter-kit-di3go04" target="_blank" rel="noopener noreferrer">
                  <Zap className="mr-2 h-4 w-4" /> Comprar ahora
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Ver demo gratis
              </Link>
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
