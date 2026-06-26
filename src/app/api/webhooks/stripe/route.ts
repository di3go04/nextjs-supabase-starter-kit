import { NextResponse, type NextRequest } from "next/server";
import { after } from "next/server";
import type Stripe from "stripe";
import { getStripeServer, stripeWebhookSecret } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sendWelcomePremiumEmail, sendPaymentFailedEmail } from "@/lib/resend";
import { logger } from "@/lib/logger";

/**
 * Webhook de Stripe — IDEMPOTENTE.
 *
 * Eventos manejados:
 *  - checkout.session.completed        → upsert subscription + role=premium + email
 *  - customer.subscription.updated     → sync status/plan
 *  - customer.subscription.deleted     → status=canceled + role=free
 *  - invoice.payment_failed           → dunning email (attempt_count)
 *
 * Idempotencia: tabla webhook_events deduplica por event.id.
 * Emails: se envían en background con `after()` para no bloquear la respuesta.
 *
 * Importante: usa service_role (admin) para saltar RLS.
 */
export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!sig) {
    return NextResponse.json({ error: "Falta stripe-signature" }, { status: 400 });
  }

  const stripe = getStripeServer();
  const secret = stripeWebhookSecret();
  if (!secret) {
    logger.error({ msg: "STRIPE_WEBHOOK_SECRET no configurado" });
    return NextResponse.json({ error: "Webhook secret no configurado" }, { status: 500 });
  }

  // 1) Verificar firma
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Error desconocido";
    logger.error({ msg: "Stripe webhook signature failed", error: msg });
    return NextResponse.json({ error: `Webhook Error: ${msg}` }, { status: 400 });
  }

  const supabase = createSupabaseAdminClient();

  // 2) IDEMPOTENCIA: insertar event.id. Si hay conflict (23505), ya fue procesado.
  const { error: insertErr } = await supabase.from("webhook_events").insert({
    event_id: event.id,
    event_type: event.type,
    payload: event.data.object as unknown as Record<string, unknown>,
  });

  if (insertErr) {
    if (insertErr.code === "23505") {
      // Ya procesado — ack 200 para que Stripe no reintente.
      logger.info({ msg: "Webhook deduplicado", eventId: event.id });
      return NextResponse.json({ received: true, deduplicated: true });
    }
    logger.error({ msg: "No se pudo insertar webhook_event", error: insertErr.message });
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  // 3) Procesar evento
  let processingError: string | null = null;
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      }
      case "customer.subscription.updated": {
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      }
      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      }
      case "invoice.payment_failed": {
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      }
      default:
        // Eventos no manejados: ack 200.
        break;
    }
  } catch (err) {
    processingError = err instanceof Error ? err.message : "Unknown error";
    logger.error({ msg: "Webhook handler error", eventId: event.id, error: processingError });
  }

  // 4) Marcar como procesado (o failed) en la tabla — fire-and-forget.
  await supabase
    .from("webhook_events")
    .update({
      status: processingError ? "failed" : "processed",
      attempts: 1,
      last_error: processingError,
      processed_at: new Date().toISOString(),
    })
    .eq("event_id", event.id);

  // 5) Si hubo error, devolver 500 para que Stripe reintente.
  if (processingError) {
    return NextResponse.json({ error: processingError }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// =====================================================
//  Handlers
// =====================================================

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.supabase_user_id;
  const plan = (session.metadata?.plan ?? "pro") as "pro" | "enterprise";
  const locale = session.metadata?.locale ?? "es";
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id ?? null;

  if (!userId) {
    logger.warn({ msg: "checkout.session.completed sin supabase_user_id", sessionId: session.id });
    return;
  }

  const supabase = createSupabaseAdminClient();

  // Upsert subscription
  const { error: subErr } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        status: "active",
        plan,
      },
      { onConflict: "user_id" },
    );

  if (subErr) throw new Error(`upsert subscription: ${subErr.message}`);

  // Subir rol a premium
  const { error: roleErr } = await supabase
    .from("profiles")
    .update({ role: "premium" })
    .eq("id", userId);

  if (roleErr) throw new Error(`update role: ${roleErr.message}`);

  // Enviar email en BACKGROUND (no bloquea la respuesta a Stripe)
  after(async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .maybeSingle();

    if (profile?.email) {
      try {
        await sendWelcomePremiumEmail({
          to: profile.email,
          name: profile.full_name ?? undefined,
          plan,
          locale,
        });
      } catch (err) {
        logger.error({ msg: "Email send failed (welcome premium)", error: String(err) });
      }
    }
  });
}

async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const userId = sub.metadata?.supabase_user_id;
  if (!userId) return;

  const plan = (sub.metadata?.plan ?? "pro") as "pro" | "enterprise";
  const supabase = createSupabaseAdminClient();

  // Stripe v22+: current_period_end está en sub.items.data[0].current_period_end
  // pero para compatibilidad lo leemos del objeto plano.
  const periodEnd = (sub as unknown as { current_period_end?: number | null })
    .current_period_end;

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: sub.status,
      plan,
      stripe_subscription_id: sub.id,
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
    })
    .eq("user_id", userId);

  if (error) throw new Error(`subscription update: ${error.message}`);

  if (sub.status === "active" || sub.status === "trialing") {
    const { error: roleErr } = await supabase
      .from("profiles")
      .update({ role: "premium" })
      .eq("id", userId);
    if (roleErr) throw new Error(`role update: ${roleErr.message}`);
  }
}

async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const userId = sub.metadata?.supabase_user_id;
  if (!userId) return;

  const supabase = createSupabaseAdminClient();

  const { error: subErr } = await supabase
    .from("subscriptions")
    .update({ status: "canceled", plan: "free" })
    .eq("user_id", userId);

  if (subErr) throw new Error(`subscription cancel: ${subErr.message}`);

  const { error: roleErr } = await supabase
    .from("profiles")
    .update({ role: "free" })
    .eq("id", userId);
  if (roleErr) throw new Error(`role downgrade: ${roleErr.message}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const userId = invoice.metadata?.supabase_user_id;
  if (!userId) return;

  const supabase = createSupabaseAdminClient();

  // Marcar suscripción como past_due
  await supabase
    .from("subscriptions")
    .update({ status: "past_due" })
    .eq("user_id", userId);

  // Email de dunning en background
  after(async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .maybeSingle();

    if (profile?.email) {
      try {
        await sendPaymentFailedEmail({
          to: profile.email,
          name: profile.full_name ?? undefined,
          attempt: invoice.attempt_count ?? 1,
        });
      } catch (err) {
        logger.error({ msg: "Email send failed (payment failed)", error: String(err) });
      }
    }
  });
}
