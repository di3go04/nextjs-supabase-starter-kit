import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * True si las variables públicas de Supabase están configuradas.
 */
export function isSupabaseServerConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Cliente de Supabase para Server Components, Server Actions y Route Handlers.
 * Lee/escribe cookies automáticamente para mantener la sesión SSR.
 *
 * En modo demo (sin credenciales) devuelve un stub para que la app no rompa.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY",
      );
    }
    return createDemoServerClient();
  }

  return createServerClient(url, anon, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // La función `set` fue llamada desde un Server Component.
          // Esto se puede ignorar si hay middleware que refresque la sesión.
        }
      },
    },
  });
}

/**
 * Stub para SSR cuando no hay credenciales configuradas.
 * Devuelve user=null para que el middleware/layout redirija a /login.
 */
function createDemoServerClient(): any {
  const noop = async () => ({ data: null, error: null });
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithOtp: noop,
      signInWithOAuth: noop,
      signOut: async () => ({ error: null }),
      exchangeCodeForSession: noop,
    },
    from: () => ({
      select: () => ({
        eq: () => ({ maybeSingle: noop, single: noop }),
        maybeSingle: noop,
      }),
      update: () => ({ eq: () => ({ error: null }) }),
      insert: () => ({ error: null }),
      upsert: () => ({ error: null }),
    }),
    storage: {
      from: () => ({
        upload: noop,
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  };
}
