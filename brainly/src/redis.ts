import { createClient } from "redis";
import { env } from "./env.js";
import { logger } from "./logger.js";

export const redis = createClient({ url: env.REDIS_URL });

redis.on("error", (err) => logger.error({ err }, "Redis error"));
redis.on("connect", () => logger.info("Redis connecting..."));
redis.on("ready", () => logger.info("Redis ready"));

export async function initRedis() {
  if (!redis.isOpen) await redis.connect();
}
