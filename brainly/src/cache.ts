import { redis } from "./redis.js";

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  return data ? JSON.parse(data) as T : null;
}
export async function setCache<T>(key: string, value: T, ttlSeconds = 60) {
  await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
}
export async function delPrefix(prefix: string) {
  const iter = redis.scanIterator({ MATCH: `${prefix}*` });
  for await (const key of iter) await redis.del(String(key));
}
