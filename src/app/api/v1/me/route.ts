import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

/**
 * Endpoint público de ejemplo — valida API key y devuelve info del usuario.
 *
 * Uso:
 *   curl -H "Authorization: Bearer sk_live_xxx" https://your-app.com/api/v1/me
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header. Use: Bearer sk_live_xxx" },
      { status: 401 },
    );
  }

  const token = authHeader.slice(7);

  // SHA-256 hash del token
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const keyHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const supabase = createSupabaseAdminClient();

  const { data: apiKey, error } = await supabase
    .from("api_keys")
    .select("id, user_id, name, revoked_at, expires_at")
    .eq("key_hash", keyHash)
    .maybeSingle();

  if (error) {
    logger.error({ msg: "API key lookup failed", error: error.message });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }

  if (!apiKey || apiKey.revoked_at) {
    return NextResponse.json({ error: "Invalid or revoked API key" }, { status: 401 });
  }

  if (apiKey.expires_at && new Date(apiKey.expires_at) < new Date()) {
    return NextResponse.json({ error: "API key expired" }, { status: 401 });
  }

  // Actualizar last_used_at
  await supabase
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", apiKey.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, username, role, avatar_url")
    .eq("id", apiKey.user_id)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: profile,
    key: { name: apiKey.name, expires_at: apiKey.expires_at },
  });
}
