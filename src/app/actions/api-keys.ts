"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
  revoked_at: string | null;
}

export interface ApiKeyWithSecret extends ApiKey {
  /** Solo se devuelve al crear la key. Nunca se vuelve a mostrar. */
  secret: string;
}

function generateApiKey(): string {
  // Formato: sk_live_<32 chars hex>
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `sk_live_${hex}`;
}

async function sha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Crea una nueva API key para el usuario autenticado.
 * Devuelve el plaintext UNA sola vez — luego solo se guarda el hash.
 */
export async function createApiKey(name: string): Promise<ApiKeyWithSecret | { error: string }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado" };

  if (!name || name.length < 2 || name.length > 60) {
    return { error: "El nombre debe tener entre 2 y 60 caracteres" };
  }

  const secret = generateApiKey();
  const keyHash = await sha256(secret);
  const keyPrefix = secret.slice(0, 12);

  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      user_id: user.id,
      name,
      key_prefix: keyPrefix,
      key_hash: keyHash,
    })
    .select("id, name, key_prefix, last_used_at, expires_at, created_at, revoked_at")
    .single();

  if (error) {
    logger.error({ msg: "createApiKey failed", error: error.message });
    return { error: error.message };
  }

  revalidatePath("/dashboard/api-keys");
  return { ...data, secret };
}

/**
 * Lista las API keys del usuario (sin el hash).
 */
export async function listApiKeys(): Promise<ApiKey[]> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, last_used_at, expires_at, created_at, revoked_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as ApiKey[];
}

/**
 * Revoca (soft delete) una API key.
 */
export async function revokeApiKey(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("api_keys")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/api-keys");
  return { ok: true };
}

/**
 * Elimina permanentemente una API key.
 */
export async function deleteApiKey(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("api_keys")
    .delete()
    .eq("id", id);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard/api-keys");
  return { ok: true };
}
