"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/ratelimit";
import { z } from "zod";

const EmailSchema = z.object({
  email: z.string().email("Email inválido"),
});

export type AuthActionState = {
  ok: boolean;
  message?: string;
  error?: string;
};

/**
 * Obtiene el IP del cliente desde los headers de Next.js.
 */
async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "anonymous"
  );
}

/**
 * Magic Link: envía un correo con un link que inicia sesión al hacer clic.
 * Rate limitado a 5 peticiones por minuto por IP.
 */
export async function signInWithMagicLink(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  // 1) Rate limiting
  const ip = await getClientIp();
  const rl = await rateLimit(`magic-link:${ip}`, 5, 60);
  if (!rl.success) {
    return {
      ok: false,
      error: "Demasiadas peticiones. Inténtalo de nuevo en un minuto.",
    };
  }

  // 2) Validar input
  const parsed = EmailSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  // 3) Enviar Magic Link
  const supabase = await createSupabaseServerClient();
  const headersList = await headers();
  const origin =
    `${headersList.get("x-forwarded-proto") ?? "https"}://` +
    `${headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000"}`;

  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  return {
    ok: true,
    message: "Revisa tu correo: te enviamos un link mágico para entrar.",
  };
}

/**
 * OAuth: redirige al proveedor (Google / GitHub).
 * Rate limitado para prevenir abuso.
 */
export async function signInWithOAuth(
  provider: "google" | "github",
  redirectPath = "/dashboard",
) {
  const ip = await getClientIp();
  const rl = await rateLimit(`oauth:${ip}`, 10, 60);
  if (!rl.success) {
    redirect(`/login?error=${encodeURIComponent("Demasiadas peticiones. Inténtalo más tarde.")}`);
  }

  const supabase = await createSupabaseServerClient();
  const headersList = await headers();
  const origin =
    `${headersList.get("x-forwarded-proto") ?? "https"}://` +
    `${headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000"}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  if (data?.url) {
    redirect(data.url);
  }
}

/**
 * Logout desde un Server Component / Server Action.
 */
export async function signOutServer() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
