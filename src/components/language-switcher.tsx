"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Locale, LOCALE_FLAGS, LOCALE_LABELS, routing } from "@/i18n/routing";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe, Check } from "lucide-react";

/**
 * Setea la cookie NEXT_LOCALE sin disparar el lint rule de immutability.
 */
function setLocaleCookie(locale: Locale) {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=${oneYear}; samesite=lax`;
}

/**
 * Switcher de idioma basado en cookie (`NEXT_LOCALE`).
 *
 * Como NO usamos localePrefix en URLs (las rutas son /login, /dashboard),
 * cambiar de idioma setea la cookie y refresca la página para que
 * next-intl relea los messages del nuevo locale.
 */
export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const t = useTranslations("common");

  const change = (next: Locale) => {
    if (next === locale) return;
    // Setear cookie para que next-intl server config la lea.
    setLocaleCookie(next);
    // Refresh para que Server Components relean el locale.
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{LOCALE_FLAGS[locale]}</span>
          <span className="hidden md:inline">{LOCALE_LABELS[locale]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((l) => (
          <DropdownMenuItem
            key={l}
            onClick={() => change(l)}
            className="flex items-center justify-between gap-2"
          >
            <span>
              {LOCALE_FLAGS[l]} {LOCALE_LABELS[l]}
            </span>
            {l === locale && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
