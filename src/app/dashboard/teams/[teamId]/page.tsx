import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TeamDetailClient } from "./team-detail-client";

export const dynamic = "force-dynamic";

export default async function TeamDetailPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verificar acceso (debe ser miembro del team)
  const { data: team } = await supabase
    .from("teams")
    .select(
      `
      id, name, slug, created_at,
      team_members!inner(role, user_id)
    `,
    )
    .eq("id", teamId)
    .eq("team_members.user_id", user.id)
    .maybeSingle();

  if (!team) notFound();

  // Cargar miembros + invitaciones pendientes
  const [membersRes, invitationsRes] = await Promise.all([
    supabase
      .from("team_members")
      .select("id, role, user_id, created_at, profiles(email, full_name, avatar_url)")
      .eq("team_id", teamId)
      .order("created_at"),
    supabase
      .from("invitations")
      .select("id, email, role, expires_at, created_at")
      .eq("team_id", teamId)
      .is("accepted_at", null)
      .order("created_at"),
  ]);

  const myRole = team.team_members[0]?.role ?? "member";

  return (
    <TeamDetailClient
      team={{
        id: team.id,
        name: team.name,
        slug: team.slug,
        myRole,
      }}
      members={membersRes.data ?? []}
      invitations={invitationsRes.data ?? []}
      currentUserId={user.id}
    />
  );
}
