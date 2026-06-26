"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";

/**
 * Provider de Posthog para product analytics.
 * Solo se inicializa si NEXT_PUBLIC_POSTHOG_KEY está configurado.
 *
 * Enrutamos a través de /ingest (path proxy) para evitar bloqueos
 * de ad-blockers y simplificar CSP.
 */
export function PHProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    posthog.init(key, {
      api_host: "/ingest",
      ui_host: "https://app.posthog.com",
      capture_pageview: true,
      capture_exceptions: true,
      persistence: "localStorage",
      person_profiles: "identified_only",
      loaded: (ph) => {
        if (process.env.NODE_ENV === "development") ph.debug();
      },
    });
  }, []);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
