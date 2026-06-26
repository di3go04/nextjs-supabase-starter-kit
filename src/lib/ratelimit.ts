import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { logger } from "@/lib/logger";

/**
 * Rate limiting con Upstash Redis (serverless-friendly).
 *
 * Si no hay UPSTASH_REDIS_REST_URL/TOKEN configurados, cae a
 * un stub en memoria (NO usar en producción real — solo dev/demo).
 */

let _ratelimit: Ratelimit | null = null;
let _memoryMap = new Map<string, { count: number; resetAt: number }>();

function getRatelimit(): Ratelimit | null {
  if (_ratelimit) return _ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      logger.warn({ msg: "Rate limiting deshabilitado en prod sin Upstash Redis" });
    }
    return null;
  }

  _ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    analytics: true,
    prefix: "starter-kit",
  });
  return _ratelimit;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Aplica rate limiting a un identificador (IP, user_id, etc.).
 *
 * @throws Error si el límite fue excedido (caller decide qué hacer).
 */
export async function rateLimit(
  identifier: string,
  limit = 5,
  windowSeconds = 60,
): Promise<RateLimitResult> {
  const rl = getRatelimit();

  if (!rl) {
    // Fallback en memoria (solo dev)
    return memoryRateLimit(identifier, limit, windowSeconds);
  }

  const result = await rl.limit(identifier);
  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

function memoryRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number,
): RateLimitResult {
  const now = Date.now();
  const key = `${identifier}`;
  const entry = _memoryMap.get(key);

  if (!entry || entry.resetAt < now) {
    _memoryMap.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { success: true, limit, remaining: limit - 1, reset: now + windowSeconds * 1000 };
  }

  entry.count++;
  if (entry.count > limit) {
    return { success: false, limit, remaining: 0, reset: entry.resetAt };
  }

  return {
    success: true,
    limit,
    remaining: limit - entry.count,
    reset: entry.resetAt,
  };
}

/**
 * Obtiene el identificador del cliente (IP o user_id) para rate limiting.
 */
export async function getClientIdentifier(request?: Request): Promise<string> {
  // Si hay request, intentar sacar IP
  if (request) {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]!.trim();
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp;
  }
  return "anonymous";
}
