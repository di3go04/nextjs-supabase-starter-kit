"use client";

import { use, useEffect, useState } from "react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Crown, DollarSign, TrendingDown, Activity, Calendar } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { getAnalyticsData, type AnalyticsData } from "@/app/actions/analytics";

const COLORS = ["#10b981", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6"];

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalyticsData().then((d) => {
      setData(d);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[1,2,3,4].map((i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No tienes permisos para ver analytics.
        </CardContent>
      </Card>
    );
  }

  const metrics: Array<{ key: keyof AnalyticsData; label: string; icon: typeof Users; color: string }> = [
    { key: "totalUsers", label: "Usuarios totales", icon: Users, color: "text-blue-600" },
    { key: "premiumUsers", label: "Premium activos", icon: Crown, color: "text-amber-600" },
    { key: "mrr", label: "MRR (USD)", icon: DollarSign, color: "text-emerald-600" },
    { key: "churnRate", label: "Churn %", icon: TrendingDown, color: "text-rose-600" },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => {
          const value = data[m.key];
          const display =
            m.key === "mrr" ? `$${value}` :
            m.key === "churnRate" ? `${Number(value).toFixed(1)}%` :
            String(value);
          return (
            <Card key={m.key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {m.label}
                </CardTitle>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{display}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Users growth */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5" /> Nuevos usuarios (30 días)
            </CardTitle>
            <CardDescription>Registros por día</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={data.usersByDay}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area type="monotone" dataKey="count" stroke="#10b981" fill="url(#colorUsers)" name="Usuarios" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by month */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5" /> Revenue mensual
            </CardTitle>
            <CardDescription>Últimos 6 meses (MRR proyectado)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                  formatter={(v) => [`$${v}`, "Revenue"]}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Users by plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="h-5 w-5" /> Distribución por plan
            </CardTitle>
            <CardDescription>Free vs Pro vs Enterprise</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data.usersByPlan}
                  dataKey="count"
                  nameKey="plan"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(e) => `${e.plan}: ${e.count}`}
                >
                  {data.usersByPlan.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Users by role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" /> Distribución por rol
            </CardTitle>
            <CardDescription>user / free / premium / admin</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.usersByRole} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis dataKey="role" type="category" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="h-5 w-5" /> Eventos recientes (30 días)
          </CardTitle>
          <CardDescription>Top 10 acciones más frecuentes</CardDescription>
        </CardHeader>
        <CardContent>
          {data.recentEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Sin eventos. Inserta eventos en <code>usage_events</code> para ver datos.
            </p>
          ) : (
            <div className="space-y-2">
              {data.recentEvents.map((e) => (
                <div key={e.event_type} className="flex items-center justify-between text-sm p-2 rounded bg-muted/30">
                  <code className="text-xs">{e.event_type}</code>
                  <Badge variant="secondary">{e.count}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
