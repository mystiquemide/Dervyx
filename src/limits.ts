import { createHash } from "node:crypto";

/** Bound expensive read-only runs so a public caller cannot exhaust the process or RPC quota. */
export class LiveRunGate {
  private active = 0;

  constructor(public readonly maxConcurrent = 2) {}

  tryAcquire(): boolean {
    if (this.active >= this.maxConcurrent) return false;
    this.active += 1;
    return true;
  }

  release(): void {
    this.active = Math.max(0, this.active - 1);
  }

  get activeRuns(): number {
    return this.active;
  }
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

type RateBucket = { count: number; resetAt: number };

/** Small in-memory fixed-window limiter for public, non-authenticated routes. */
export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, RateBucket>();

  constructor(
    public readonly maxRequests: number,
    public readonly windowMs: number,
    private readonly now: () => number = () => Date.now(),
    public readonly maxKeys = 4096,
  ) {
    if (!Number.isSafeInteger(maxRequests) || maxRequests < 1) {
      throw new Error("maxRequests must be a positive integer");
    }
    if (!Number.isSafeInteger(windowMs) || windowMs < 1) {
      throw new Error("windowMs must be a positive integer");
    }
    if (!Number.isSafeInteger(maxKeys) || maxKeys < 1) {
      throw new Error("maxKeys must be a positive integer");
    }
  }

  tryConsume(key: string): RateLimitResult {
    const now = this.now();
    for (const [storedKey, bucket] of this.buckets) {
      if (now >= bucket.resetAt) this.buckets.delete(storedKey);
    }
    const current = this.buckets.get(key);
    if (!current && this.buckets.size >= this.maxKeys) {
      const oldestKey = this.buckets.keys().next().value;
      if (oldestKey !== undefined) this.buckets.delete(oldestKey);
    }
    const bucket = !current || now >= current.resetAt
      ? { count: 0, resetAt: now + this.windowMs }
      : current;

    if (bucket.count >= this.maxRequests) {
      this.buckets.set(key, bucket);
      return {
        allowed: false,
        limit: this.maxRequests,
        remaining: 0,
        retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
      };
    }

    bucket.count += 1;
    this.buckets.set(key, bucket);
    return {
      allowed: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - bucket.count,
      retryAfterSeconds: 0,
    };
  }

  get trackedKeys(): number {
    return this.buckets.size;
  }
}

/** Hash the edge-provided client identity so raw IP values are not retained by the limiter. */
export function publicClientKey(headers: { get(name: string): string | null }): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim();
  const real = headers.get("x-real-ip")?.trim();
  const identity = forwarded || real || "anonymous";
  return createHash("sha256").update(identity, "utf8").digest("hex").slice(0, 32);
}
