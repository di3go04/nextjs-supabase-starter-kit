import { describe, it, expect } from "vitest";
import { STRIPE_PLANS, type PlanId } from "@/lib/stripe";

describe("stripe config", () => {
  describe("STRIPE_PLANS", () => {
    it("defines pro plan with monthly price", () => {
      expect(STRIPE_PLANS.pro).toBeDefined();
      expect(STRIPE_PLANS.pro.name).toBe("Pro");
      expect(STRIPE_PLANS.pro.monthly).toBeGreaterThan(0);
    });

    it("defines enterprise plan more expensive than pro", () => {
      expect(STRIPE_PLANS.enterprise).toBeDefined();
      expect(STRIPE_PLANS.enterprise.monthly).toBeGreaterThan(
        STRIPE_PLANS.pro.monthly,
      );
    });

    it("has priceId field (empty in test env, populated in prod)", () => {
      expect(typeof STRIPE_PLANS.pro.priceId).toBe("string");
      expect(typeof STRIPE_PLANS.enterprise.priceId).toBe("string");
    });
  });

  describe("PlanId type", () => {
    it("allows 'pro' and 'enterprise'", () => {
      const valid: PlanId[] = ["pro", "enterprise"];
      expect(valid).toHaveLength(2);
    });
  });
});
