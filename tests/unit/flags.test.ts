import { describe, it, expect } from "vitest";
import { getFlag, FLAGS, isFlagEnabled } from "@/lib/flags";

// Mock Edge Config to return null (no EDGE_CONFIG in test env)
describe("flags", () => {
  describe("getFlag", () => {
    it("returns default value when EDGE_CONFIG is not set", async () => {
      const result = await getFlag("non-existent", "default");
      expect(result).toBe("default");
    });

    it("returns boolean default", async () => {
      const result = await getFlag("test-flag", false);
      expect(result).toBe(false);
    });

    it("returns true when default is true", async () => {
      const result = await getFlag("test-flag", true);
      expect(result).toBe(true);
    });
  });

  describe("FLAGS constant", () => {
    it("has expected flag keys", () => {
      expect(FLAGS.NEW_ONBOARDING).toBe("new-onboarding");
      expect(FLAGS.TEAMS_ENABLED).toBe("teams-enabled");
      expect(FLAGS.AI_FEATURES).toBe("ai-features");
      expect(FLAGS.BETA_ADMIN).toBe("beta-admin");
    });
  });

  describe("isFlagEnabled", () => {
    it("returns false when EDGE_CONFIG is not set", async () => {
      const result = await isFlagEnabled(FLAGS.TEAMS_ENABLED);
      expect(result).toBe(false);
    });
  });
});
