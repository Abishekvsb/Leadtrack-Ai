import { NextRequest } from "next/server";

// In-memory rate limiting map keyed by namespace + identifier
const rateLimitMaps = new Map<string, Map<string, number[]>>();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  retryAfterSeconds?: number;
}

export function checkRateLimit(
  namespace: string,
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): RateLimitResult {
  if (!rateLimitMaps.has(namespace)) {
    rateLimitMaps.set(namespace, new Map());
  }
  const map = rateLimitMaps.get(namespace)!;
  const now = Date.now();
  const timestamps = (map.get(identifier) || []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    const oldest = timestamps[0];
    const retryAfterSeconds = Math.ceil((oldest + windowMs - now) / 1000);
    return { success: false, remaining: 0, retryAfterSeconds };
  }

  timestamps.push(now);
  map.set(identifier, timestamps);
  return { success: true, remaining: limit - timestamps.length };
}

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
