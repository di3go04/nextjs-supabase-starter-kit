import { describe, it, expect } from "vitest";
import { APP_URL, APP_NAME, SUPPORT_EMAIL, NAV_LINKS } from "@/lib/site";

describe("site config", () => {
  describe("APP_URL", () => {
    it("is a valid URL", () => {
      expect(() => new URL(APP_URL)).not.toThrow();
    });
    it("starts with http or https", () => {
      expect(APP_URL).toMatch(/^https?:\/\//);
    });
  });

  describe("APP_NAME", () => {
    it("is a non-empty string", () => {
      expect(APP_NAME.length).toBeGreaterThan(0);
    });
    it("contains 'Starter'", () => {
      expect(APP_NAME).toContain("Starter");
    });
  });

  describe("SUPPORT_EMAIL", () => {
    it("contains @", () => {
      expect(SUPPORT_EMAIL).toContain("@");
    });
    it("has a valid format", () => {
      expect(SUPPORT_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  describe("NAV_LINKS", () => {
    it("has 3 items", () => {
      expect(NAV_LINKS).toHaveLength(3);
    });
    it("includes dashboard, profile, billing", () => {
      const hrefs = NAV_LINKS.map((l) => l.href);
      expect(hrefs).toContain("/dashboard");
      expect(hrefs).toContain("/dashboard/profile");
      expect(hrefs).toContain("/dashboard/billing");
    });
    it("all have labelKey", () => {
      NAV_LINKS.forEach((l) => {
        expect(typeof l.labelKey).toBe("string");
        expect(l.labelKey.length).toBeGreaterThan(0);
      });
    });
  });
});
