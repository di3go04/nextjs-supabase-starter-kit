"use client";

import Link from "next/link";
import { Check, X, Sparkles, Crown, Building2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const PLANS = [
  {
    id: "single",
    name: "Single Developer",
    price: 89,
    period: "one-time",
    description: "Para devs individuales lanzando su propio SaaS.",
    icon: Zap,
    highlight: false,
    features: [
      { text: "Full source code (Next.js + Supabase + Stripe)", included: true },
      { text: "1 commercial project (closed source OK)", included: true },
      { text: "6 months of updates", included: true },
      { text: "Email support (48h response)", included: true },
      { text: "Discord community access", included: true },
      { text: "Attribution required", included: true },
      { text: "Priority support", included: false },
      { text: "Multi-project license", included: false },
    ],
    cta: "Buy now",
    href: "https://gumroad.com/l/your-starter-kit",
  },
  {
    id: "team",
    name: "Team",
    price: 249,
    period: "one-time",
    description: "Para equipos pequeños construyendo SaaS juntos.",
    icon: Sparkles,
    highlight: true,
    badge: "Most popular",
    features: [
      { text: "Full source code (Next.js + Supabase + Stripe)", included: true },
      { text: "Up to 5 commercial projects", included: true },
      { text: "1 year of updates", included: true },
      { text: "Priority email support (24h response)", included: true },
      { text: "Private Discord channel", included: true },
      { text: "No attribution required", included: true },
      { text: "Onboarding call (1h)", included: true },
      { text: "Custom feature requests", included: false },
    ],
    cta: "Get Team license",
    href: "https://gumroad.com/l/your-starter-kit-team",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: 499,
    period: "one-time",
    description: "Para agencias y empresas que venden SaaS repetidamente.",
    icon: Crown,
    highlight: false,
    features: [
      { text: "Full source code (Next.js + Supabase + Stripe)", included: true },
      { text: "Unlimited commercial projects", included: true },
      { text: "Lifetime updates (including v2, v3...)", included: true },
      { text: "Priority email + Slack support", included: true },
      { text: "Private Discord + direct line", included: true },
      { text: "No attribution required", included: true },
      { text: "Quarterly onboarding calls (4h/year)", included: true },
      { text: "Custom feature requests (1 per quarter)", included: true },
    ],
    cta: "Get Lifetime license",
    href: "https://gumroad.com/l/your-starter-kit-lifetime",
  },
];

const FAQ = [
  {
    q: "¿What does 'commercial use' mean?",
    a: "Selling this kit, a derivative product, or using it as the foundation of a paid SaaS where the source is not openly published. Personal learning and open-source projects are free under MIT.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes — 14-day no-questions-asked refund. If the kit doesn't work for you, email refunds@your-starter-kit.com.",
  },
  {
    q: "Do you offer student / nonprofit discounts?",
    a: "Yes! 50% off for verified students and registered nonprofits. Email us with proof.",
  },
  {
    q: "What's included in support?",
    a: "Single: email (48h). Team: priority email + Discord (24h). Lifetime: Slack + quarterly calls.",
  },
  {
    q: "Can I upgrade my license later?",
    a: "Yes — pay the difference anytime within the first 12 months. Email billing@your-starter-kit.com.",
  },
  {
    q: "Is the code mine after purchase?",
    a: "Yes. You receive a perpetual license to use, modify, and distribute derivative products according to your license tier.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Sparkles className="h-5 w-5 text-primary" />
            Starter Kit
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">← Volver</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Probar demo</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <Badge variant="secondary" className="mb-4">
              <Zap className="mr-1 h-3 w-3" /> One-time payment · No subscription
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Lanza tu SaaS en{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                días, no meses
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Un solo pago. Licencia perpetua. Código completo. Sin regalías.
            </p>
          </div>
        </section>

        {/* Pricing cards */}
        <section className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="grid gap-6 md:grid-cols-3">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                return (
                  <Card
                    key={plan.id}
                    className={`relative flex flex-col ${
                      plan.highlight ? "border-primary shadow-lg ring-1 ring-primary" : ""
                    }`}
                  >
                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">
                          {plan.badge}
                        </Badge>
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle>{plan.name}</CardTitle>
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-sm text-muted-foreground ml-2">{plan.period}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1">
                      <Separator className="mb-4" />
                      <ul className="space-y-2.5 text-sm">
                        {plan.features.map((f) => (
                          <li key={f.text} className="flex items-start gap-2">
                            {f.included ? (
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                            )}
                            <span className={f.included ? "" : "text-muted-foreground/60 line-through"}>
                              {f.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter>
                      <Button
                        asChild
                        className="w-full"
                        variant={plan.highlight ? "default" : "outline"}
                      >
                        <a href={plan.href} target="_blank" rel="noopener noreferrer">
                          {plan.cta}
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            <p className="text-center text-xs text-muted-foreground mt-8">
              Precios en USD. Pagos procesados por Gumroad. IVA no incluido para clientes EU.
            </p>
          </div>
        </section>

        {/* Comparison */}
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 py-16">
            <h2 className="text-3xl font-bold text-center mb-2">¿Por qué este kit?</h2>
            <p className="text-center text-muted-foreground mb-12">
              Comparado con construir desde cero o comprar otros boilerplates.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">From scratch</CardTitle>
                  <CardDescription>3-6 meses de desarrollo</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-rose-600">$15,000+</p>
                  <p className="text-xs text-muted-foreground mt-1">en tiempo de desarrollo</p>
                </CardContent>
              </Card>
              <Card className="border-primary">
                <CardHeader>
                  <CardTitle className="text-base">This kit</CardTitle>
                  <CardDescription>1-3 días para lanzar</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-emerald-600">$89</p>
                  <p className="text-xs text-muted-foreground mt-1">pago único</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Otros boilerplates</CardTitle>
                  <CardDescription>Calidad variable</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-amber-600">$199-499</p>
                  <p className="text-xs text-muted-foreground mt-1">con menos features</p>
                </CardContent>
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
            <h2 className="text-3xl font-bold">¿Listo para lanzar?</h2>
            <p className="mt-2 opacity-90">
              Únete a 500+ desarrolladores que ya están construyendo con este kit.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="secondary">
                <a href="https://gumroad.com/l/your-starter-kit" target="_blank" rel="noopener noreferrer">
                  <Building2 className="mr-2 h-4 w-4" /> Comprar licencia
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Probar demo gratis</Link>
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
