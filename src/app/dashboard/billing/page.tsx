"use client";

import { useState, use } from "react";
import { useTranslations } from "next-intl";
import { Check, Loader2, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/context/user-context";
import { createCheckoutSession, createBillingPortalSession } from "@/app/actions/billing";
import { STRIPE_PLANS, type PlanId } from "@/lib/stripe";

const PLANS_UI: Array<{
  id: PlanId;
  monthly: number;
  highlight?: boolean;
  icon: typeof Sparkles;
}> = [
  {
    id: "pro",
    monthly: STRIPE_PLANS.pro.monthly,
    icon: Sparkles,
    highlight: true,
  },
  {
    id: "enterprise",
    monthly: STRIPE_PLANS.enterprise.monthly,
    icon: Crown,
  },
];

export default function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const params = use(searchParams);
  const t = useTranslations("billing");
  const { user } = useUser();
  const [loading, setLoading] = useState<PlanId | "portal" | null>(null);

  const currentPlan = user?.role === "premium" ? "premium" : "free";

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <Badge
          variant="secondary"
          className={
            currentPlan === "premium"
              ? "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
              : ""
          }
        >
          {t("currentPlan")}: {currentPlan}
        </Badge>
      </div>

      {params.success === "1" && (
        <Alert>
          <AlertDescription>{t("success")}</AlertDescription>
        </Alert>
      )}
      {params.canceled === "1" && (
        <Alert variant="destructive">
          <AlertDescription>{t("canceled")}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {PLANS_UI.map((plan) => {
          const Icon = plan.icon;
          const planT = t.raw(`plans.${plan.id}`) as { name: string; features: string[] };
          return (
            <Card
              key={plan.id}
              className={plan.highlight ? "border-primary shadow-md" : undefined}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {planT.name}
                  </CardTitle>
                  {plan.highlight && (
                    <Badge variant="default" className="bg-primary">
                      ★
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  <span className="text-2xl font-bold text-foreground">
                    ${plan.monthly}
                  </span>
                  <span className="text-sm text-muted-foreground">/mes</span>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2 text-sm">
                  {planT.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlight ? "default" : "outline"}
                  disabled={loading !== null}
                  onClick={async () => {
                    setLoading(plan.id);
                    try {
                      await createCheckoutSession(plan.id);
                    } finally {
                      setLoading(null);
                    }
                  }}
                >
                  {loading === plan.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {t("plans.upgradeTo")} {planT.name}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {currentPlan === "premium" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("manage.title")}</CardTitle>
            <CardDescription>{t("manage.desc")}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button
              variant="outline"
              disabled={loading !== null}
              onClick={async () => {
                setLoading("portal");
                try {
                  await createBillingPortalSession();
                } finally {
                  setLoading(null);
                }
              }}
            >
              {loading === "portal" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t("manage.cta")}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
