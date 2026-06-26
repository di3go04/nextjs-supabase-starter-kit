"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getStripeServer, STRIPE_PLANS, type PlanId } from "@/lib/stripe";

/**
 * Crea una Checkout Session para un plan dado y redirige al usuario a Stripe.
 * - Asocia el customer_id al user_id de Supabase (metadata).
 * - Si ya existe stripe_customer_id, lo reutiliza.
 */
export async function createCheckoutSession(plan: PlanId) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/billing");
  }

  const config = STRIPE_PLANS[plan];
  if (!config?.priceId) {
    throw new Error(`No hay priceId configurado para el plan "${plan}"`);
  }

  // Buscamos si ya existe customer.
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const headersList = await headers();
  const origin =
    `${headersList.get("x-forwarded-proto") ?? "https"}://` +
    `${headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000"}`;

  const stripe = getStripeServer();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: config.priceId, quantity: 1 }],
    success_url: `${origin}/dashboard/billing?success=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/dashboard/billing?canceled=1`,
    customer: sub?.stripe_customer_id ?? undefined,
    customer_email: sub?.stripe_customer_id ? undefined : user.email ?? undefined,
    metadata: {
      supabase_user_id: user.id,
      plan,
    },
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
    },
    allow_promotion_codes: true,
  });

  if (session.url) redirect(session.url);
}

/**
 * Crea una Billing Portal Session para gestionar/cancelar la suscripción activa.
 */
export async function createBillingPortalSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!sub?.stripe_customer_id) {
    throw new Error("No tienes suscripción activa");
  }

  const headersList = await headers();
  const origin =
    `${headersList.get("x-forwarded-proto") ?? "https"}://` +
    `${headersList.get("x-forwarded-host") ?? headersList.get("host") ?? "localhost:3000"}`;

  const stripe = getStripeServer();
  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${origin}/dashboard/billing`,
  });

  if (session.url) redirect(session.url);
}
