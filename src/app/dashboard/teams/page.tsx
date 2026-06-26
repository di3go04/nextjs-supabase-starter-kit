import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { TeamsListClient } from "./teams-list-client";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard/teams");

  const { data: teams } = await supabase
    .from("teams")
    .select(
      `
      id, name, slug, created_at,
      team_members!inner(role)
    `,
    )
    .eq("team_members.user_id", user.id)
    .order("created_at", { ascending: false });

  // Contar miembros por equipo
  const teamsWithCount = await Promise.all(
    (teams ?? []).map(async (t: any) => {
      const { count } = await supabase
        .from("team_members")
        .select("id", { count: "exact", head: true })
        .eq("team_id", t.id);
      return { ...t, membersCount: count ?? 0 };
    }),
  );

  return <TeamsListClient teams={teamsWithCount ?? []} />;
}
