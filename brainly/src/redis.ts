// src/redis.ts
import Redis, { type RedisOptions } from "ioredis";
import { ENV } from "./env";

const baseOpts: RedisOptions = {
  lazyConnect: false,
  // allow commands to run even if a reconnection is in progress
  maxRetriesPerRequest: null,
};

// Prefer REDIS_URL if provided, otherwise default to localhost:6379
export const redis =
  ENV.REDIS_URL && ENV.REDIS_URL.trim().length > 0
    ? new Redis(ENV.REDIS_URL, baseOpts)
    : new Redis({ host: "127.0.0.1", port: 6379, ...baseOpts });

redis.on("connect", () => {
  console.log("[redis] connected");
});
redis.on("error", (e) => {
  console.error("[redis] error", e);
});

export async function pingRedis() {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}
