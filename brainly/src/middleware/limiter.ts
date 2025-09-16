// src/middleware/limiter.ts
import type { RequestHandler } from 'express';
import { redis } from '../redis';

function limiter(points: number, windowSec: number, prefix: string): RequestHandler {
  return async (req, res, next) => {
    const key = `${prefix}:${req.ip ?? 'unknown'}`;
    try {
      const count = await redis.incr(key);
      if (count === 1) {
        await redis.expire(key, windowSec);
      }
      if (count > points) {
        return res.status(429).json({ error: 'Too many requests' });
      }
      next();
    } catch (e) {
      // fail-open if redis hiccups
      next();
    }
  };
}

export const authLimiter = limiter(10, 60, 'rl:auth');
export const contentLimiter = limiter(60, 60, 'rl:content');
