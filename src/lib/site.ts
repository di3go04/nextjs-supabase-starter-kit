/**
 * Configuración pública del sitio.
 * Centraliza URLs y constantes para no duplicar.
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

export const APP_NAME = "Next.js + Supabase Starter Kit";

export const SUPPORT_EMAIL = "support@your-app.com";

export const NAV_LINKS = [
  { href: "/dashboard", labelKey: "nav.dashboard" },
  { href: "/dashboard/profile", labelKey: "nav.profile" },
  { href: "/dashboard/billing", labelKey: "nav.billing" },
] as const;
