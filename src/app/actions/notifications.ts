"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

/**
 * Obtiene las últimas 20 notificaciones del usuario.
 */
export async function getNotifications(): Promise<Notification[]> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data ?? []) as Notification[];
}

/**
 * Cuenta notificaciones no leídas.
 */
export async function getUnreadCount(): Promise<number> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return count ?? 0;
}

/**
 * Marca una notificación como leída.
 */
export async function markAsRead(notificationId: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", notificationId);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  return { ok: true };
}

/**
 * Marca todas como leídas.
 */
export async function markAllAsRead() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "No autenticado" };

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/dashboard");
  return { ok: true };
}

/**
 * Helper para que otros server actions o webhooks inserten
 * notificaciones. Usa el admin client.
 */
export async function pushNotification(params: {
  userId: string;
  type: string;
  title: string;
  body?: string;
  metadata?: Record<string, unknown>;
}) {
  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("notifications").insert({
    user_id: params.userId,
    type: params.type,
    title: params.title,
    body: params.body ?? null,
    metadata: params.metadata ?? null,
  });
  return { ok: !error, error: error?.message };
}
