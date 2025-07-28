import { headers } from "next/headers";

interface RateLimitOptions {
  windowMs?: number; // Time window in milliseconds
  maxRequests?: number; // Maximum requests per window
  keyGenerator?: (req: Request) => string | Promise<string>; // Function to generate unique key
  message?: string; // Error message when rate limit exceeded
}

// Simple in-memory store for rate limiting
// In production, use Redis or another distributed cache
class RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>();

  increment(key: string, windowMs: number): { count: number; resetTime: number } {
    const now = Date.now();
    const existing = this.store.get(key);

    if (!existing || existing.resetTime < now) {
      const resetTime = now + windowMs;
      this.store.set(key, { count: 1, resetTime });
      return { count: 1, resetTime };
    }

    existing.count++;
    return existing;
  }

  reset(key: string) {
    this.store.delete(key);
  }

  // Clean up expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.store.entries()) {
      if (value.resetTime < now) {
        this.store.delete(key);
      }
    }
  }
}

const store = new RateLimitStore();

// Cleanup expired entries every minute
if (typeof window === 'undefined') {
  setInterval(() => store.cleanup(), 60 * 1000);
}

export function createRateLimiter(options: RateLimitOptions = {}) {
  const {
    windowMs = 60 * 1000, // 1 minute default
    maxRequests = 10, // 10 requests per minute default
    keyGenerator = defaultKeyGenerator,
    message = "Too many requests, please try again later.",
  } = options;

  return async function rateLimit(req: Request): Promise<{ allowed: boolean; message?: string; resetTime?: number }> {
    const key = await keyGenerator(req);
    const { count, resetTime } = store.increment(key, windowMs);

    if (count > maxRequests) {
      return {
        allowed: false,
        message,
        resetTime,
      };
    }

    return { allowed: true };
  };
}

// Default key generator using IP address
async function defaultKeyGenerator(req: Request): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const realIp = headersList.get("x-real-ip");
  
  const ip = forwardedFor?.split(",")[0].trim() || realIp || "unknown";
  const pathname = new URL(req.url).pathname;
  
  return `${ip}:${pathname}`;
}

// Specific rate limiters for different endpoints
export const searchRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 30, // 30 searches per minute
  message: "Too many search requests. Please wait a moment before searching again.",
});

export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 API calls per minute
  message: "API rate limit exceeded. Please try again later.",
});

// Helper function to apply rate limiting in server actions
export async function withRateLimit<T>(
  rateLimiter: ReturnType<typeof createRateLimiter>,
  fn: () => Promise<T>
): Promise<T> {
  // Create a dummy request object for server actions
  const dummyReq = new Request("http://localhost/api");
  const { allowed, message } = await rateLimiter(dummyReq);

  if (!allowed) {
    throw new Error(message);
  }

  return fn();
}