"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

const CreateTeamSchema = z.object({
  name: z.string().min(2, "Nombre muy corto").max(80, "Máximo 80 caracteres"),
  slug: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(40, "Máximo 40 caracteres")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
});

const InviteSchema = z.object({
  teamId: z.string().uuid(),
  email: z.string().email("Email inválido"),
  role: z.enum(["member", "admin"]).default("member"),
});

export type TeamActionState = {
  ok: boolean;
  error?: string;
  teamId?: string;
};

/**
 * Crea un equipo y hace owner al usuario.
 */
export async function createTeam(
  _prev: TeamActionState,
  formData: FormData,
): Promise<TeamActionState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const parsed = CreateTeamSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  const { data, error } = await supabase.rpc("create_team", {
    p_name: parsed.data.name,
    p_slug: parsed.data.slug,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Ese slug ya está en uso" };
    }
    logger.error({ msg: "createTeam failed", error: error.message });
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/teams");
  return { ok: true, teamId: data as string };
}

/**
 * Invita a un usuario por email a un equipo.
 * Genera un token único con expiración de 7 días.
 */
export async function inviteToTeam(
  _prev: TeamActionState,
  formData: FormData,
): Promise<TeamActionState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const parsed = InviteSchema.safeParse({
    teamId: formData.get("teamId"),
    email: formData.get("email"),
    role: formData.get("role") ?? "member",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  const { error } = await supabase.from("invitations").insert({
    team_id: parsed.data.teamId,
    email: parsed.data.email,
    role: parsed.data.role,
    invited_by: user.id,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/dashboard/teams/${parsed.data.teamId}`);
  return { ok: true };
}

/**
 * Acepta una invitación usando el token.
 */
export async function acceptInvitation(token: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("accept_invitation", { p_token: token });
  if (error) {
    redirect(`/dashboard?error=${encodeURIComponent(error.message)}`);
  }
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

/**
 * Elimina un miembro del equipo.
 */
export async function removeTeamMember(teamId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("team_id", teamId)
    .eq("user_id", userId);

  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/teams/${teamId}`);
  return { ok: true };
}
