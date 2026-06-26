import { createBrowserClient } from "@supabase/ssr";

/**
 * True si las variables públicas de Supabase están configuradas.
 * Útil para mostrar/ocultar features en modo demo.
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Cliente de Supabase para el navegador.
 * Usa cookies automáticamente gracias a @supabase/ssr.
 *
 * En modo demo (sin credenciales) devuelve un stub con la misma API
 * para que la UI no rompa. El stub responde a getSession/getUser con null.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY",
      );
    }
    return createDemoClient();
  }

  return createBrowserClient(url, anon);
}

/**
 * Stub que imita la API pública de Supabase para que los componentes
 * 'use client' no crasheen cuando no hay credenciales configuradas.
 */
function createDemoClient(): any {
  const noop = async () => ({ data: null, error: null });
  const authStub = {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithOtp: noop,
    signInWithOAuth: noop,
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } },
    }),
    exchangeCodeForSession: noop,
  };
  const fromStub = () => ({
    select: () => ({
      eq: () => ({ maybeSingle: noop, single: noop }),
      maybeSingle: noop,
      single: noop,
    }),
    update: () => ({ eq: () => ({ error: null }) }),
    insert: () => ({ error: null }),
    upsert: () => ({ error: null }),
  });
  return {
    auth: authStub,
    from: fromStub,
    storage: {
      from: () => ({
        upload: noop,
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
      }),
    },
  };
}
