import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con service_role key.
 * Omite RLS — SOLO usar en el servidor (route handlers, webhooks, server actions críticas).
 * NUNCA exponer al cliente.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY",
      );
    }
  }

  return createClient(url ?? "", serviceKey ?? "", {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
