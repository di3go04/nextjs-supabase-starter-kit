"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AnalyticsData {
  totalUsers: number;
  premiumUsers: number;
  freeUsers: number;
  newUsersLast30Days: number;
  mrr: number;
  churnRate: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  // Series temporales para gráficos
  usersByDay: Array<{ date: string; count: number }>;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  usersByPlan: Array<{ plan: string; count: number }>;
  usersByRole: Array<{ role: string; count: number }>;
  recentEvents: Array<{ event_type: string; created_at: string; count: number }>;
}

/**
 * Obtiene todos los datos para el dashboard de analytics.
 * Solo accesible para admins.
 */
export async function getAnalyticsData(): Promise<AnalyticsData | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Verificar admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.role !== "admin") return null;

  // Queries en paralelo
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [profilesRes, subsRes, recentUsersRes, eventsRes] = await Promise.all([
    supabase.from("profiles").select("role, created_at"),
    supabase.from("subscriptions").select("status, plan, current_period_end, user_id"),
    supabase
      .from("profiles")
      .select("id, created_at")
      .gte("created_at", thirtyDaysAgo),
    supabase
      .from("usage_events")
      .select("event_type, created_at")
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  const profiles = profilesRes.data ?? [];
  const subs = subsRes.data ?? [];
  const recentUsers = recentUsersRes.data ?? [];
  const events = eventsRes.data ?? [];

  // Cálculos
  const totalUsers = profiles.length;
  const premiumUsers = profiles.filter((p) => p.role === "premium").length;
  const freeUsers = profiles.filter((p) => p.role === "free" || p.role === "user").length;
  const activeSubs = subs.filter((s) => s.status === "active");
  const canceledSubs = subs.filter((s) => s.status === "canceled");
  const churnRate = totalUsers > 0 ? (canceledSubs.length / totalUsers) * 100 : 0;

  // MRR: $19/pro, $99/enterprise
  const mrr = activeSubs.reduce((acc, s) => {
    if (s.plan === "pro") return acc + 19;
    if (s.plan === "enterprise") return acc + 99;
    return acc;
  }, 0);

  // Usuarios por día (últimos 30 días)
  const usersByDay = groupByDay(recentUsers.map((u) => u.created_at));

  // Revenue por mes (últimos 6 meses — simulado basado en activeSubs)
  const revenueByMonth = simulateRevenueByMonth(mrr);

  // Usuarios por plan
  const usersByPlan = [
    { plan: "Free", count: freeUsers },
    { plan: "Pro", count: activeSubs.filter((s) => s.plan === "pro").length },
    { plan: "Enterprise", count: activeSubs.filter((s) => s.plan === "enterprise").length },
  ];

  // Usuarios por rol
  const roleCounts: Record<string, number> = {};
  profiles.forEach((p) => {
    roleCounts[p.role] = (roleCounts[p.role] ?? 0) + 1;
  });
  const usersByRole = Object.entries(roleCounts).map(([role, count]) => ({ role, count }));

  // Eventos recientes
  const eventCounts: Record<string, number> = {};
  events.forEach((e) => {
    eventCounts[e.event_type] = (eventCounts[e.event_type] ?? 0) + 1;
  });
  const recentEvents = Object.entries(eventCounts)
    .map(([event_type, count]) => ({ event_type, count, created_at: "" }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalUsers,
    premiumUsers,
    freeUsers,
    newUsersLast30Days: recentUsers.length,
    mrr,
    churnRate,
    activeSubscriptions: activeSubs.length,
    canceledSubscriptions: canceledSubs.length,
    usersByDay,
    revenueByMonth,
    usersByPlan,
    usersByRole,
    recentEvents,
  };
}

function groupByDay(dates: string[]): Array<{ date: string; count: number }> {
  const counts: Record<string, number> = {};
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    counts[key] = 0;
  }
  dates.forEach((date) => {
    const key = date.slice(0, 10);
    if (key in counts) counts[key]++;
  });
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

function simulateRevenueByMonth(currentMrr: number): Array<{ month: string; revenue: number }> {
  const months: Array<{ month: string; revenue: number }> = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const monthName = d.toLocaleDateString("es", { month: "short" });
    const factor = (6 - i) / 6;
    const revenue = Math.round(currentMrr * factor * 0.8 + currentMrr * 0.2);
    months.push({ month: monthName, revenue });
  }
  return months;
}
