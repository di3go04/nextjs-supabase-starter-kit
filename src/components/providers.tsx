"use client";

import { useState, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PHProvider } from "@/components/posthog-provider";

/**
 * Providers globales de la app.
 * Se monta una sola vez en el root layout.
 *
 * - ThemeProvider: dark mode con next-themes
 * - QueryClientProvider: cache de server state con React Query
 * - TooltipProvider: necesario para los tooltips de shadcn/ui
 * - PHProvider: Posthog analytics (no-op si no hay API key)
 */
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <PHProvider>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
        </PHProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
