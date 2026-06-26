"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Crown, DollarSign, TrendingDown, ScrollText } from "lucide-react";
import { changeUserRole } from "@/app/actions/admin";
import { ROLE_BADGE_CLASS, ROLE_LABELS } from "@/lib/rbac";
import type { UserRole } from "@/lib/types";
import { toast } from "sonner";

interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  plan: string;
  subscription_status: string;
  created_at: string;
}

interface AdminSub {
  user_id: string;
  status: string;
  plan: string;
  current_period_end: string | null;
}

interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  target_id: string | null;
  target_type: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

interface Metrics {
  totalUsers: number;
  premiumUsers: number;
  mrr: number;
  churnRate: number;
}

const ROLES: UserRole[] = ["user", "free", "premium", "admin"];

export function AdminDashboardClient({
  users,
  subscriptions,
  auditLogs,
  metrics,
  currentUserId,
}: {
  users: AdminUser[];
  subscriptions: AdminSub[];
  auditLogs: AuditLog[];
  metrics: Metrics;
  currentUserId: string;
}) {
  const t = useTranslations("admin");
  const [updating, setUpdating] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, role: UserRole) => {
    setUpdating(userId);
    const res = await changeUserRole(userId, role);
    if (res.ok) {
      toast.success("Rol actualizado");
    } else {
      toast.error(res.error ?? "Error");
    }
    setUpdating(null);
  };

  const metricCards = [
    {
      label: t("metrics.users"),
      value: metrics.totalUsers.toString(),
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: t("metrics.premium"),
      value: metrics.premiumUsers.toString(),
      icon: Crown,
      color: "text-amber-600",
    },
    {
      label: t("metrics.mrr"),
      value: `$${metrics.mrr.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-600",
    },
    {
      label: t("metrics.churn"),
      value: `${metrics.churnRate.toFixed(1)}%`,
      icon: TrendingDown,
      color: "text-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {/* Métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((m) => (
          <Card key={m.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {m.label}
              </CardTitle>
              <m.icon className={`h-4 w-4 ${m.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{m.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabla de usuarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> {t("users.title")}
          </CardTitle>
          <CardDescription>
            {users.length} {t("users.title").toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              {t("users.empty")}
            </p>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("users.email")}</TableHead>
                    <TableHead>{t("users.role")}</TableHead>
                    <TableHead>{t("users.plan")}</TableHead>
                    <TableHead>{t("users.createdAt")}</TableHead>
                    <TableHead className="text-right">{t("users.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        {u.email ?? "—"}
                        {u.full_name && (
                          <p className="text-xs text-muted-foreground">{u.full_name}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={ROLE_BADGE_CLASS[u.role]}
                        >
                          {ROLE_LABELS[u.role]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{u.plan}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {u.id === currentUserId ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <Select
                            value={u.role}
                            onValueChange={(v) => handleRoleChange(u.id, v as UserRole)}
                            disabled={updating === u.id}
                          >
                            <SelectTrigger className="w-28 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLES.map((r) => (
                                <SelectItem key={r} value={r} className="text-xs">
                                  {ROLE_LABELS[r]}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" /> Audit logs
          </CardTitle>
          <CardDescription>Últimas {auditLogs.length} acciones</CardDescription>
        </CardHeader>
        <CardContent>
          {auditLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Sin actividad reciente
            </p>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-2">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 text-sm border-b pb-2"
                >
                  <Badge variant="outline" className="text-xs font-mono">
                    {log.action}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">
                      actor: <code className="text-foreground">{log.actor_id.slice(0, 8)}</code>
                      {log.target_id && (
                        <>
                          {" → "}
                          target:{" "}
                          <code className="text-foreground">{log.target_id.slice(0, 8)}</code>
                        </>
                      )}
                    </p>
                    {log.metadata && (
                      <pre className="text-xs text-muted-foreground mt-1 overflow-x-auto">
                        {JSON.stringify(log.metadata)}
                      </pre>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
