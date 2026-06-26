"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useUser } from "@/context/user-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROLE_BADGE_CLASS, ROLE_LABELS } from "@/lib/rbac";
import { User, CreditCard, ShieldCheck, Sparkles } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading } = useUser();
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");

  if (isLoading) {
    return <div className="animate-pulse text-muted-foreground">{tc("loading")}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {t("welcome")}{user?.profile?.full_name ? `, ${user.profile.full_name.split(" ")[0]}` : ""} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("welcomeBack")}{" "}
          {user && (
            <Badge variant="secondary" className={ROLE_BADGE_CLASS[user.role]}>
              {ROLE_LABELS[user.role]}
            </Badge>
          )}
          .
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t("cards.profile.title")}</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>{t("cards.profile.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/profile">{t("cards.profile.cta")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t("cards.billing.title")}</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>{t("cards.billing.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/billing">{t("cards.billing.cta")}</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{t("cards.security.title")}</CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </div>
            <CardDescription>{t("cards.security.desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
              <Sparkles className="mr-1 h-3 w-3" /> {t("cards.security.badge")}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
