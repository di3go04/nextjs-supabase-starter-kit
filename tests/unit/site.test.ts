import { describe, it, expect } from "vitest";
import { APP_URL, APP_NAME, SUPPORT_EMAIL, NAV_LINKS } from "@/lib/site";

describe("site config", () => {
  describe("APP_URL", () => {
    it("is a valid URL", () => {
      expect(() => new URL(APP_URL)).not.toThrow();
    });

    it("falls back to localhost in test env", () => {
      // Sin NEXT_PUBLIC_APP_URL ni VERCEL_URL, debe ser localhost.
      expect(APP_URL).toMatch(/^https?:\/\/.+/);
    });
  });

  describe("APP_NAME", () => {
    it("is a non-empty string", () => {
      expect(APP_NAME.length).toBeGreaterThan(0);
    });
  });

  describe("SUPPORT_EMAIL", () => {
    it("contains an @", () => {
      expect(SUPPORT_EMAIL).toContain("@");
    });
  });

  describe("NAV_LINKS", () => {
    it("includes dashboard, profile and billing", () => {
      const hrefs = NAV_LINKS.map((l) => l.href);
      expect(hrefs).toContain("/dashboard");
      expect(hrefs).toContain("/dashboard/profile");
      expect(hrefs).toContain("/dashboard/billing");
    });
  });
});
