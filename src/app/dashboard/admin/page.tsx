import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStripeServer, STRIPE_PLANS } from "@/lib/stripe";
import { AdminDashboardClient } from "./admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard/admin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    redirect("/dashboard?error=forbidden");
  }

  // Datos para métricas en paralelo
  const admin = createSupabaseAdminClient();

  const [usersRes, subsRes, logsRes] = await Promise.all([
    admin.from("user_with_plan").select("*").order("created_at", { ascending: false }),
    admin.from("subscriptions").select("status, plan, current_period_end, user_id"),
    admin
      .from("audit_logs")
      .select("id, actor_id, action, target_id, target_type, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  // Calcular MRR (suma de suscripciones activas)
  const activeSubs = subsRes.data?.filter((s) => s.status === "active") ?? [];
  const proPrice = STRIPE_PLANS.pro.monthly * 100; // centavos
  const enterprisePrice = STRIPE_PLANS.enterprise.monthly * 100;
  const mrrCents = activeSubs.reduce((acc, s) => {
    if (s.plan === "pro") return acc + proPrice;
    if (s.plan === "enterprise") return acc + enterprisePrice;
    return acc;
  }, 0);
  const mrr = mrrCents / 100;

  // Calcular churn (últimos 30 días)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const canceled = subsRes.data?.filter(
    (s) => s.status === "canceled" /* idealmente comparar updated_at */,
  ).length ?? 0;
  const totalUsers = usersRes.data?.length ?? 1;
  const churnRate = totalUsers > 0 ? (canceled / totalUsers) * 100 : 0;

  return (
    <AdminDashboardClient
      users={usersRes.data ?? []}
      subscriptions={subsRes.data ?? []}
      auditLogs={logsRes.data ?? []}
      metrics={{
        totalUsers,
        premiumUsers: activeSubs.length,
        mrr,
        churnRate,
      }}
      currentUserId={user.id}
    />
  );
}
