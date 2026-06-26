import Stripe from "stripe";

/**
 * Cliente de Stripe con la secret key del servidor.
 * Se instancia de forma perezosa para no romper el build sin credenciales.
 */
let _stripe: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (_stripe) return _stripe;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Falta STRIPE_SECRET_KEY");
    }
     
    console.warn("[Stripe] STRIPE_SECRET_KEY no configurada — modo demo.");
  }

  _stripe = new Stripe(key ?? "sk_test_dummy", {
    typescript: true,
  });
  return _stripe;
}

export const STRIPE_PLANS = {
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRICE_ID_PRO ?? "",
    monthly: 19,
  },
  enterprise: {
    name: "Enterprise",
    priceId: process.env.STRIPE_PRICE_ID_ENTERPRISE ?? "",
    monthly: 99,
  },
} as const;

export type PlanId = keyof typeof STRIPE_PLANS;

export function stripeWebhookSecret(): string {
  return process.env.STRIPE_WEBHOOK_SECRET ?? "";
}
