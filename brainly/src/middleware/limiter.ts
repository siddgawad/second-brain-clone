import type { RequestHandler } from "express";
import { redis } from "../redis";

export function limiter(points: number, seconds: number, keyPrefix: string): RequestHandler {
  return async (req, res, next) => {
    try {
      const key = `${keyPrefix}:${req.ip ?? "unknown"}`;
      const tx = redis.multi();
      tx.incr(key);
      tx.expire(key, seconds, "NX");
      const [count] = (await tx.exec()) ?? [];
      const n = Array.isArray(count) ? (count[1] as number) : (count as number);
      if (Number(n) > points) {
        return res.status(429).json({ error: "Too many requests" });
      }
      next();
    } catch (e) {
      // fail-open
      next();
    }
  };
}

export const authLimiter = limiter(10, 60, "auth");
export const contentLimiter = limiter(60, 60, "content");
