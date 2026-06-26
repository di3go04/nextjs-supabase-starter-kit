"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";
import type { UserRole } from "@/lib/types";

/**
 * Cambia el rol de un usuario. Solo admins pueden ejecutarlo.
 * Registra en audit_logs.
 */
export async function changeUserRole(
  targetUserId: string,
  newRole: UserRole,
): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "No autenticado" };

  // Verificar que el actor es admin
  const { data: actor } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (actor?.role !== "admin") {
    return { ok: false, error: "Forbidden" };
  }

  // No puede cambiarse a sí mismo (evitar auto-privilegio)
  if (targetUserId === user.id) {
    return { ok: false, error: "No puedes cambiar tu propio rol" };
  }

  // Cambiar rol con admin client (salta RLS)
  const admin = createSupabaseAdminClient();
  const { error: updateErr } = await admin
    .from("profiles")
    .update({ role: newRole })
    .eq("id", targetUserId);

  if (updateErr) {
    logger.error({ msg: "changeUserRole failed", error: updateErr.message });
    return { ok: false, error: updateErr.message };
  }

  // Registrar en audit_logs
  await admin.rpc("log_action", {
    p_actor: user.id,
    p_action: "role.change",
    p_target: targetUserId,
    p_target_type: "user",
    p_metadata: { new_role: newRole },
  });

  revalidatePath("/dashboard/admin");
  return { ok: true };
}
