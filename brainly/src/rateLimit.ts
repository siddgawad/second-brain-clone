import type { Request, Response, NextFunction } from "express";
import { redis } from "./redis.js";

type RLConfig = {
  keyPrefix: string;
  points: number;   // allowed requests in window
  duration: number; // window seconds
};

function clientIp(req: Request) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.socket.remoteAddress || "unknown";
}

export function buildLimiter(cfg: RLConfig) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = clientIp(req);
    const key = `${cfg.keyPrefix}:${ip}`;

    try {
      const current = await redis.incr(key);
      if (current === 1) {
        // set TTL only on first increment in window
        await redis.expire(key, cfg.duration);
      }

      if (current > cfg.points) {
        const ttl = await redis.ttl(key);
        if (ttl > 0) res.setHeader("Retry-After", String(ttl));
        return res.status(429).json({ message: "Too many requests" });
      }

      res.setHeader("X-RateLimit-Limit", String(cfg.points));
      res.setHeader("X-RateLimit-Remaining", String(Math.max(cfg.points - current, 0)));
      next();
    } catch {
      // Fail-open on Redis problems
      next();
    }
  };
}

export const authLimiter = buildLimiter({ keyPrefix: "rl:auth", points: 10, duration: 60 });
export const contentLimiter = buildLimiter({ keyPrefix: "rl:cw", points: 60, duration: 60 });

// Back-compat helper so existing imports still work
export const rateLimit = (limiter: ReturnType<typeof buildLimiter>) => limiter;
