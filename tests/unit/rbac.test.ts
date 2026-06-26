import { describe, it, expect } from "vitest";
import { hasRole, ROLE_HIERARCHY, ROLE_LABELS } from "@/lib/rbac";

describe("rbac", () => {
  describe("hasRole", () => {
    it("allows any authenticated role when '*' is required", () => {
      expect(hasRole("user", "*")).toBe(true);
      expect(hasRole("admin", "*")).toBe(true);
      expect(hasRole("premium", "*")).toBe(true);
    });

    it("denies when user has no role", () => {
      expect(hasRole(null, "*")).toBe(false);
      expect(hasRole(undefined, "*")).toBe(false);
    });

    it("allows admin to access admin-only routes", () => {
      expect(hasRole("admin", ["admin"])).toBe(true);
    });

    it("denies user to access admin-only routes", () => {
      expect(hasRole("user", ["admin"])).toBe(false);
      expect(hasRole("free", ["admin"])).toBe(false);
      expect(hasRole("premium", ["admin"])).toBe(false);
    });

    it("allows higher role to satisfy lower role requirements", () => {
      // premium (level 2) satisfies requirement of free (level 1)
      expect(hasRole("premium", ["free"])).toBe(true);
      // admin satisfies anything
      expect(hasRole("admin", ["user", "free", "premium"])).toBe(true);
    });

    it("denies lower role to access higher role requirement", () => {
      expect(hasRole("user", ["premium"])).toBe(false);
      expect(hasRole("free", ["premium"])).toBe(false);
    });

    it("handles empty required array", () => {
      expect(hasRole("user", [])).toBe(true);
    });

    it("handles multiple required roles (OR logic)", () => {
      expect(hasRole("free", ["admin", "free"])).toBe(true);
      expect(hasRole("user", ["admin", "free"])).toBe(false);
    });
  });

  describe("ROLE_HIERARCHY", () => {
    it("has admin as the highest level", () => {
      expect(ROLE_HIERARCHY.admin).toBeGreaterThan(ROLE_HIERARCHY.premium);
      expect(ROLE_HIERARCHY.admin).toBeGreaterThan(ROLE_HIERARCHY.free);
      expect(ROLE_HIERARCHY.admin).toBeGreaterThan(ROLE_HIERARCHY.user);
    });

    it("orders roles correctly: user < free < premium < admin", () => {
      expect(ROLE_HIERARCHY.user).toBeLessThan(ROLE_HIERARCHY.free);
      expect(ROLE_HIERARCHY.free).toBeLessThan(ROLE_HIERARCHY.premium);
      expect(ROLE_HIERARCHY.premium).toBeLessThan(ROLE_HIERARCHY.admin);
    });
  });

  describe("ROLE_LABELS", () => {
    it("has labels for all roles", () => {
      expect(ROLE_LABELS.user).toBeDefined();
      expect(ROLE_LABELS.free).toBeDefined();
      expect(ROLE_LABELS.premium).toBeDefined();
      expect(ROLE_LABELS.admin).toBeDefined();
    });
  });
});
