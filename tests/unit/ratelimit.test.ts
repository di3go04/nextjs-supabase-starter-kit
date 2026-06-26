import { describe, it, expect, vi, beforeEach } from "vitest";
import { rateLimit } from "@/lib/ratelimit";

// Mock Upstash Redis (no credentials in test env)
vi.mock("@upstash/redis", () => ({
  Redis: vi.fn(),
}));

describe("rateLimit", () => {
  beforeEach(() => {
    // Reset in-memory state between tests
    vi.resetModules();
  });

  it("allows first request within limit", async () => {
    const result = await rateLimit("test-user-1", 5, 60);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks after exceeding limit", async () => {
    const id = "test-spammer";
    // 5 requests OK
    for (let i = 0; i < 5; i++) {
      const r = await rateLimit(id, 5, 60);
      expect(r.success).toBe(true);
    }
    // 6th should fail
    const result = await rateLimit(id, 5, 60);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("tracks remaining correctly", async () => {
    const id = "test-counter";
    await rateLimit(id, 3, 60);
    await rateLimit(id, 3, 60);
    const result = await rateLimit(id, 3, 60);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("different identifiers are independent", async () => {
    await rateLimit("user-a", 1, 60);
    const result = await rateLimit("user-b", 1, 60);
    expect(result.success).toBe(true);
  });
});
