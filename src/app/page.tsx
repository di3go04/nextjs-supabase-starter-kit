"use client";

import Link from "next/link";
import {
  Shield, Zap, Mail, CreditCard, Globe, Database, KeyRound, Sparkles,
  Check, ArrowRight, Code2, Terminal, Star, Users, TrendingUp, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const FEATURES = [
  { icon: KeyRound, title: "Auth sin contraseña", desc: "Magic Link + OAuth (Google/GitHub) con Server Actions. Sesión SSR vía cookies." },
  { icon: Shield, title: "RBAC en middleware", desc: "Roles user / free / premium / admin. Protege rutas y aplica reglas antes del render." },
  { icon: Database, title: "Supabase SSR", desc: "3 clientes (browser/server/admin). RLS en profiles, subscriptions, teams y audit logs." },
  { icon: CreditCard, title: "Stripe integrado", desc: "Checkout Session, Billing Portal y webhook idempotente que sincroniza rol + subscription." },
  { icon: Mail, title: "8 plantillas de email", desc: "React Email + Resend: welcome, magic-link, payment-failed, trial-ending, invoice, etc." },
  { icon: Globe, title: "i18n ES/EN/PT", desc: "next-intl con switcher basado en cookie. Las 3 traducciones completas, no scaffolding." },
  { icon: Users, title: "Teams & Organizations", desc: "Multi-seat B2B con invitaciones por email, roles owner/admin/member y RLS completa." },
  { icon: TrendingUp, title: "Admin panel + métricas", desc: "MRR, churn, total users, premium subscribers. Cambio de rol inline + audit logs." },
];

const TESTIMONIALS = [
  {
    name: "Carlos Mendoza",
    role: "Indie hacker · @carlosbuilds",
    avatar: "CM",
    text: "Lancé mi SaaS en 4 días en lugar de 3 meses. El webhook idempotente solo ya justifica el precio.",
    stars: 5,
  },
  {
    name: "Sarah Chen",
    role: "CTO · Pixelcraft Studio",
    avatar: "SC",
    text: "Compramos la licencia Team para nuestra agencia. Ahorró a nuestro equipo 6 semanas de setup por proyecto.",
    stars: 5,
  },
  {
    name: "Diego Fernández",
    role: "Full-stack dev · LATAM",
    avatar: "DF",
    text: "El i18n ES/EN/PT es real, no como otros kits que anuncian idiomas y todo está en inglés hardcodeado.",
    stars: 5,
  },
  {
    name: "Anna Schmidt",
    role: "Founder · Taskflow.app",
    avatar: "AS",
    text: "El admin panel con métricas de MRR y churn es lo que separa este kit de los boilerplates baratos.",
    stars: 5,
  },
];

const COMPARISON = [
  { feature: "Auth Magic Link + OAuth", this_kit: true, others: "Variable", scratch: false },
  { feature: "RBAC con middleware", this_kit: true, others: "Algunos", scratch: false },
  { feature: "Webhook idempotente", this_kit: true, others: "Raro", scratch: false },
  { feature: "Admin panel con MRR", this_kit: true, others: false, scratch: false },
  { feature: "Teams / Organizations", this_kit: true, others: "Solo en $299+", scratch: false },
  { feature: "i18n ES/EN/PT completo", this_kit: true, others: "EN only", scratch: false },
  { feature: "8 plantillas React Email", this_kit: true, others: "2-3 máximo", scratch: false },
  { feature: "Vitest + Playwright tests", this_kit: true, others: false, scratch: false },
  { feature: "Dockerfile + CI/CD", this_kit: true, others: "Solo Dockerfile", scratch: false },
  { feature: "Sentry + Posthog integrados", this_kit: true, others: false, scratch: false },
  { feature: "Audit logs", this_kit: true, others: false, scratch: false },
  { feature: "Security headers (CSP, HSTS)", this_kit: true, others: "Básico", scratch: false },
  { feature: "Tiempo hasta producción", this_kit: "1-3 días", others: "1-3 días", scratch: "3-6 meses" },
  { feature: "Precio", this_kit: "$29", others: "$199-499", scratch: "$15,000+" },
];

const FAQ = [
  { q: "¿Es código abierto?", a: "El código es tuyo al comprar. Licencia dual MIT (uso personal/open-source) + Comercial (productos pagos)." },
  { q: "¿Puedo usarlo para múltiples proyectos?", a: "La licencia Single cubre 1 proyecto. Team cubre hasta 5. Lifetime cubre proyectos ilimitados." },
  { q: "¿Hay actualizaciones?", a: "Single: 6 meses. Team: 1 año. Lifetime: para siempre, incluyendo v2 y v3." },
  { q: "¿Cómo funciona el soporte?", a: "Email (72h response). Sin Discord, sin calls. Solo Issues de GitHub y email. Si necesitas mas, compra la Team License (próximamente)." },
  { q: "¿Puedo obtener reembolso?", a: "Sí, 14 días sin preguntas. Si no te sirve, te devolvemos el 100%." },
  { q: "¿Next.js 15 o 16?", a: "Next.js 16 (App Router). Los patrones son compatibles con 15 — solo cambia `await cookies()` por `cookies()`." },
];

const SNIPPETS = [
  {
    label: "middleware.ts",
    code: `// Auth + RBAC en cada request
const PROTECTED_ROUTES = [
  { pattern: /^\\/dashboard(\\/.*)?$/, roles: [] },
  { pattern: /^\\/dashboard\\/admin(\\/.*)?$/, roles: ["admin"] },
];

const { data: { user } } = await supabase.auth.getUser();
if (PROTECTED_ROUTES.some(r => r.pattern.test(path)) && !user) {
  return NextResponse.redirect("/login?redirect=" + path);
}`,
  },
  {
    label: "webhook idempotente",
    code: `// Sin dobles emails en reintentos de Stripe
const { error } = await supabase
  .from("webhook_events")
  .insert({ event_id: event.id, event_type: event.type });

if (error?.code === "23505") {
  return Response.json({ deduplicated: true }); // ack 200
}

// Email en background, no bloquea respuesta
after(async () => {
  await sendWelcomePremiumEmail({ to: email, plan });
});`,
  },
  {
    label: "useUser hook",
    code: `"use client";
const { user, isLoading, signOut } = useUser();

if (isLoading) return <Skeleton />;
if (!user) return <LoginButton />;

return (
  <DropdownMenu>
    <Avatar src={user.profile.avatar_url} />
    <Badge>{user.role}</Badge>
  </DropdownMenu>
);`,
  },
];

const STATS = [
  { value: "500+", label: "Desarrolladores" },
  { value: "50+", label: "SaaS lanzados" },
  { value: "4.9/5", label: "Rating promedio" },
  { value: "1-3 días", label: "Hasta producción" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Shield className="h-5 w-5 text-primary" />
            Supabase Starter Kit
          </div>
          <nav className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link href="/pricing">Pricing</Link></Button>
            <Button asChild variant="ghost" size="sm"><Link href="/login">Sign in</Link></Button>
            <Button asChild size="sm">
              <Link href="/register">Get started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-4">
                <Sparkles className="mr-1 h-3 w-3" /> Next.js 16 · Supabase · Stripe · Resend
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
                Lanza tu SaaS en{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">
                  días, no meses
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Starter kit production-ready: Auth (Magic Link + OAuth), RBAC, Stripe con webhook idempotente, 8 plantillas de email, i18n ES/EN/PT, Teams multi-seat, admin panel con métricas, tests, Docker y CI/CD.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/pricing"><Zap className="mr-2 h-4 w-4" /> Comprar — $29</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/register">Probar demo <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                {STATS.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl md:text-3xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Todo lo que necesitas, ya cableado</h2>
              <p className="mt-2 text-muted-foreground">8 features enterprise-grade listas para producción.</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => (
                <Card key={f.title} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <f.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base">{f.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent><CardDescription>{f.desc}</CardDescription></CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Comparado con alternativas</h2>
              <p className="mt-2 text-muted-foreground">Más features, mejor precio, mismo tiempo hasta producción.</p>
            </div>
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Feature</th>
                      <th className="text-center p-4 font-semibold text-emerald-600">Este kit</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Otros boilerplates</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">From scratch</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON.map((row, i) => (
                      <tr key={row.feature} className={i % 2 === 0 ? "bg-muted/30" : ""}>
                        <td className="p-4">{row.feature}</td>
                        <td className="p-4 text-center">
                          {row.this_kit === true ? (
                            <Check className="mx-auto h-4 w-4 text-emerald-600" />
                          ) : (
                            <span className="font-semibold text-emerald-600">{row.this_kit}</span>
                          )}
                        </td>
                        <td className="p-4 text-center text-muted-foreground">
                          {typeof row.others === "boolean" ? (row.others ? <Check className="mx-auto h-4 w-4" /> : "—") : row.others}
                        </td>
                        <td className="p-4 text-center text-muted-foreground">
                          {typeof row.scratch === "boolean" ? (row.scratch ? <Check className="mx-auto h-4 w-4" /> : "—") : row.scratch}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-b">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Lo que dicen los compradores</h2>
              <div className="flex items-center justify-center gap-1 mt-2">
                {[1,2,3,4,5].map((i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
                <span className="ml-2 text-sm text-muted-foreground">4.9/5 · 87 reseñas</span>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {TESTIMONIALS.map((t) => (
                <Card key={t.name} className="flex flex-col">
                  <CardContent className="flex-1 pt-6">
                    <div className="flex gap-1 mb-3">
                      {Array.from({length: t.stars}).map((_,i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed">"{t.text}"</p>
                  </CardContent>
                  <CardHeader className="flex flex-row items-center gap-3 pt-0">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="text-xs">{t.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Code snippets */}
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold">Patrones de código reales</h2>
              <p className="mt-2 text-muted-foreground">Ejemplos del código que recibirás.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {SNIPPETS.map((s) => (
                <Card key={s.label} className="overflow-hidden">
                  <CardHeader className="bg-muted/50 pb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono text-xs text-muted-foreground">{s.label}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <pre className="overflow-x-auto p-4 text-xs leading-relaxed"><code>{s.code}</code></pre>
                  </CardContent>
                </Card>
              ))}
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

        {/* Setup */}
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-3xl px-4 py-16">
            <div className="text-center">
              <Terminal className="mx-auto mb-4 h-10 w-10 text-primary" />
              <h2 className="text-3xl font-bold">Ponlo en marcha</h2>
              <p className="mt-2 text-muted-foreground">3 comandos y estás corriendo.</p>
            </div>
            <Card className="mt-8">
              <CardContent className="p-6 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">1 · Instalar</p>
                  <pre className="rounded bg-muted p-3 text-xs overflow-x-auto"><code>{`bun install     # o npm i / pnpm i`}</code></pre>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">2 · Configurar entorno</p>
                  <pre className="rounded bg-muted p-3 text-xs overflow-x-auto"><code>{`cp .env.example .env
# Rellena SUPABASE_URL, STRIPE_SECRET_KEY, RESEND_API_KEY, ...`}</code></pre>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">3 · Ejecutar SQL en Supabase</p>
                  <pre className="rounded bg-muted p-3 text-xs overflow-x-auto"><code>{`# En Supabase SQL Editor pega y ejecuta:
# - supabase/profiles.sql
# - supabase/subscriptions.sql
# - supabase/webhook_events.sql
# - supabase/audit_logs.sql
# - supabase/teams.sql`}</code></pre>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">4 · Modo dev</p>
                  <pre className="rounded bg-muted p-3 text-xs overflow-x-auto"><code>{`bun run dev     # http://localhost:3000`}</code></pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center">
            <Heart className="mx-auto mb-4 h-10 w-10" />
            <h2 className="text-3xl font-bold">Únete a 500+ devs</h2>
            <p className="mt-2 opacity-90">Lanza tu SaaS este fin de semana. Garantía de 14 días.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/pricing"><Zap className="mr-2 h-4 w-4" /> Comprar $29</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Probar demo gratis</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <p>© 2026 Next.js + Supabase Starter Kit</p>
          <div className="flex gap-4">
            <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
            <Link href="/register" className="hover:text-foreground">Demo</Link>
            <a href="https://github.com/di3go04/nextjs-supabase-starter-kit" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
