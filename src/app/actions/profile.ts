"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_AVATAR_MB = 2;

const ProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(80, "Máximo 80 caracteres")
    .optional()
    .or(z.literal("")),
  username: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(40, "Máximo 40 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Solo letras, números, _ y -")
    .optional()
    .or(z.literal("")),
});

export type ProfileActionState = {
  ok: boolean;
  message?: string;
  error?: string;
  avatarUrl?: string;
};

/**
 * Actualiza `full_name` y `username` del profile del usuario autenticado.
 */
export async function updateProfile(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "No autenticado" };
  }

  const parsed = ProfileSchema.safeParse({
    full_name: formData.get("full_name"),
    username: formData.get("username"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }

  const update: Record<string, string | null> = {};
  if (parsed.data.full_name !== undefined) update.full_name = parsed.data.full_name || null;
  if (parsed.data.username !== undefined) update.username = parsed.data.username || null;

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Ese username ya está en uso" };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");

  return { ok: true, message: "Perfil actualizado correctamente" };
}

/**
 * Sube un avatar a Supabase Storage (bucket 'avatars', carpeta = user.id).
 * Devuelve la URL pública firmada/pública.
 */
export async function uploadAvatar(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { ok: false, error: "No autenticado" };

  const file = formData.get("avatar");
  if (!(file instanceof File)) return { ok: false, error: "No se recibió archivo" };
  if (file.size === 0) return { ok: false, error: "Archivo vacío" };
  if (file.size > MAX_AVATAR_MB * 1024 * 1024) {
    return { ok: false, error: `Máximo ${MAX_AVATAR_MB}MB` };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  if (!["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
    return { ok: false, error: "Formato no soportado" };
  }

  const path = `${user.id}/avatar-${Date.now()}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("avatars")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (upErr) return { ok: false, error: upErr.message };

  const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
  const avatarUrl = pub.publicUrl + `?t=${Date.now()}`; // cache-bust

  const { error: dbErr } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("id", user.id);

  if (dbErr) return { ok: false, error: dbErr.message };

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");

  return {
    ok: true,
    message: "Avatar actualizado",
    avatarUrl,
  };
}
