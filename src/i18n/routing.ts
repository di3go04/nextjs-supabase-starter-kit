import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["es", "en", "pt"] as const,
  defaultLocale: "es",
  localePrefix: "as-needed",
  // Solo detectar locale por path o cookie, no por Accept-Language.
  // Esto evita redirecciones sorpresivas basadas en el idioma del navegador.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  es: "Español",
  en: "English",
  pt: "Português",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  es: "🇪🇸",
  en: "🇺🇸",
  pt: "🇧🇷",
};

// Exporta los helpers de navegación tipados.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
