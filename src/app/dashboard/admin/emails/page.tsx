import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { render } from "@react-email/render";
import { WelcomeEmail } from "@/emails/welcome";
import { SubscriptionSuccessEmail } from "@/emails/subscription-success";
import { MagicLinkEmail } from "@/emails/magic-link";
import { PaymentFailedEmail } from "@/emails/payment-failed";
import { TrialEndingEmail } from "@/emails/trial-ending";
import { InvoiceReceiptEmail } from "@/emails/invoice-receipt";
import { PasswordResetEmail } from "@/emails/password-reset";
import { AccountDeletedEmail } from "@/emails/account-deleted";
import { EmailsPreviewClient } from "./emails-preview-client";

export const dynamic = "force-dynamic";

const TEMPLATES = [
  { id: "welcome", name: "Welcome", subject: "¡Bienvenido al Starter Kit!", render: () => render(<WelcomeEmail name="Ana" />) },
  { id: "subscription-success", name: "Subscription Success", subject: "¡Tu suscripción Pro está activa!", render: () => render(<SubscriptionSuccessEmail name="Ana" plan="pro" />) },
  { id: "magic-link", name: "Magic Link", subject: "Tu link mágico", render: () => render(<MagicLinkEmail email="ana@example.com" url="https://your-app.com/auth/callback?token=abc" />) },
  { id: "payment-failed", name: "Payment Failed", subject: "Tu pago falló", render: () => render(<PaymentFailedEmail name="Ana" attempt={2} />) },
  { id: "trial-ending", name: "Trial Ending", subject: "Tu trial termina en 3 días", render: () => render(<TrialEndingEmail name="Ana" daysLeft={3} />) },
  { id: "invoice-receipt", name: "Invoice Receipt", subject: "Recibo de pago", render: () => render(<InvoiceReceiptEmail name="Ana" amount={1900} currency="USD" period="Junio 2026" />) },
  { id: "password-reset", name: "Password Reset", subject: "Restablece tu contraseña", render: () => render(<PasswordResetEmail email="ana@example.com" resetUrl="https://your-app.com/reset?token=abc" />) },
  { id: "account-deleted", name: "Account Deleted", subject: "Tu cuenta fue eliminada", render: () => render(<AccountDeletedEmail name="Ana" />) },
];

export default async function EmailsPreviewPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/dashboard/admin/emails");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") redirect("/dashboard?error=forbidden");

  // Render all templates server-side
  const rendered = await Promise.all(
    TEMPLATES.map(async (t) => ({
      id: t.id,
      name: t.name,
      subject: t.subject,
      html: await t.render(),
    })),
  );

  return <EmailsPreviewClient templates={rendered} />;
}
