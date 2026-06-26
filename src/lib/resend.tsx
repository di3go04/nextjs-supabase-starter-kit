import { Resend } from "resend";
import { WelcomeEmail } from "@/emails/welcome";
import { SubscriptionSuccessEmail } from "@/emails/subscription-success";
import { MagicLinkEmail } from "@/emails/magic-link";
import { PaymentFailedEmail } from "@/emails/payment-failed";
import { TrialEndingEmail } from "@/emails/trial-ending";
import { InvoiceReceiptEmail } from "@/emails/invoice-receipt";
import { PasswordResetEmail } from "@/emails/password-reset";
import { AccountDeletedEmail } from "@/emails/account-deleted";
import { logger } from "@/lib/logger";

/**
 * Cliente de Resend. Si no hay API key, las funciones son no-op
 * (devuelven { skipped: true }) para no romper flujos en dev.
 */
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      logger.warn({ msg: "RESEND_API_KEY no configurada" });
    }
    return null;
  }
  return new Resend(key);
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

interface EmailResult {
  id?: string;
  skipped?: boolean;
  error?: string;
}

async function send(
  to: string,
  subject: string,
  react: React.ReactElement,
): Promise<EmailResult> {
  const resend = getResend();
  if (!resend) return { skipped: true };

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to,
      subject,
      react,
    });
    if (error) {
      logger.error({ msg: "Resend send failed", error: error.message });
      return { error: error.message };
    }
    return { id: data?.id };
  } catch (err) {
    logger.error({
      msg: "Resend exception",
      error: err instanceof Error ? err.message : String(err),
    });
    return { error: String(err) };
  }
}

// =====================================================
//  Plantillas
// =====================================================

export async function sendWelcomeEmail({
  to,
  name,
  loginUrl,
}: {
  to: string;
  name?: string;
  loginUrl?: string;
}) {
  return send(to, "¡Bienvenido al Starter Kit! 🎉", (
    <WelcomeEmail name={name} loginUrl={loginUrl} />
  ) as React.ReactElement);
}

export async function sendWelcomePremiumEmail({
  to,
  name,
  plan,
  locale,
  dashboardUrl,
}: {
  to: string;
  name?: string;
  plan: string;
  locale?: string;
  dashboardUrl?: string;
}) {
  const subject =
    locale === "en"
      ? `Your ${plan} subscription is active!`
      : `¡Tu suscripción ${plan} está activa!`;
  return send(to, subject, (
    <SubscriptionSuccessEmail
      name={name}
      plan={plan}
      dashboardUrl={dashboardUrl}
    />
  ) as React.ReactElement);
}

export async function sendMagicLinkEmail({
  to,
  url,
  expiresIn,
}: {
  to: string;
  url: string;
  expiresIn?: string;
}) {
  return send(to, "Tu link mágico ✨", (
    <MagicLinkEmail email={to} url={url} expiresIn={expiresIn} />
  ) as React.ReactElement);
}

export async function sendPaymentFailedEmail({
  to,
  name,
  attempt,
  updateUrl,
}: {
  to: string;
  name?: string;
  attempt: number;
  updateUrl?: string;
}) {
  const subject =
    attempt >= 3
      ? "⚠️ Último intento: actualiza tu método de pago"
      : "Tu pago falló";
  return send(to, subject, (
    <PaymentFailedEmail name={name} attempt={attempt} updateUrl={updateUrl} />
  ) as React.ReactElement);
}

export async function sendTrialEndingEmail({
  to,
  name,
  daysLeft,
  upgradeUrl,
}: {
  to: string;
  name?: string;
  daysLeft?: number;
  upgradeUrl?: string;
}) {
  return send(to, `⏰ Tu trial termina en ${daysLeft ?? 3} días`, (
    <TrialEndingEmail
      name={name}
      daysLeft={daysLeft}
      upgradeUrl={upgradeUrl}
    />
  ) as React.ReactElement);
}

export async function sendInvoiceReceiptEmail({
  to,
  name,
  amount,
  currency,
  invoiceUrl,
  period,
}: {
  to: string;
  name?: string;
  amount: number;
  currency?: string;
  invoiceUrl?: string;
  period?: string;
}) {
  return send(to, "Recibo de pago 📄", (
    <InvoiceReceiptEmail
      name={name}
      amount={amount}
      currency={currency}
      invoiceUrl={invoiceUrl}
      period={period}
    />
  ) as React.ReactElement);
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
  expiresIn,
}: {
  to: string;
  resetUrl: string;
  expiresIn?: string;
}) {
  return send(to, "Restablece tu contraseña", (
    <PasswordResetEmail email={to} resetUrl={resetUrl} expiresIn={expiresIn} />
  ) as React.ReactElement);
}

export async function sendAccountDeletedEmail({
  to,
  name,
  reactivateUrl,
}: {
  to: string;
  name?: string;
  reactivateUrl?: string;
}) {
  return send(to, "Tu cuenta fue eliminada", (
    <AccountDeletedEmail name={name} reactivateUrl={reactivateUrl} />
  ) as React.ReactElement);
}
