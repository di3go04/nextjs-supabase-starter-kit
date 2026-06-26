import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, setRequestLocale } from "next-intl/server";
import { AppProviders } from "@/components/providers";
import { APP_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Next.js + Supabase Starter Kit",
    template: "%s · Starter Kit",
  },
  description:
    "Starter kit SaaS con Next.js App Router, Supabase SSR, Stripe, RBAC, i18n ES/EN/PT, Resend y todo lo que necesitas para lanzar.",
  keywords: [
    "Next.js",
    "Supabase",
    "Stripe",
    "RBAC",
    "Magic Link",
    "OAuth",
    "Starter Kit",
    "Boilerplate",
    "SaaS",
  ],
  authors: [{ name: "Starter Kit" }],
  openGraph: {
    title: "Next.js + Supabase Starter Kit",
    description:
      "Auth, roles, pagos, emails, i18n y deploy en 1 clic. Sin contraseñas, sin boilerplate.",
    url: APP_URL,
    siteName: "Starter Kit",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Next.js + Supabase Starter Kit",
    description:
      "Auth, roles, pagos, emails, i18n y deploy en 1 clic. Sin contraseñas, sin boilerplate.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppProviders>
            {children}
            <Toaster />
            <SonnerToaster richColors closeButton />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
