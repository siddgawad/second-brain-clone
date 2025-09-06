import { redis } from "../redis";

/**
 * ---------- Refresh JTI store ----------
 * rt:<jti> -> userId (with TTL)
 * Supports both ioredis and node-redis v4 signatures.
 */
export async function putRefreshJti(jti: string, userId: string, ttlSeconds: number) {
  const r: any = redis as any;

  // Try ioredis-style: set key value "EX" ttl
  try {
    // ioredis succeeds with this signature
    await r.set(`rt:${jti}`, userId, "EX", ttlSeconds);
  } catch {
    // node-redis v4: set key value { EX: ttl }
    await r.set(`rt:${jti}`, userId, { EX: ttlSeconds });
  }
}

export async function getRefreshUserId(jti: string): Promise<string | null> {
  return (redis as any).get(`rt:${jti}`);
}

export async function delRefreshJti(jti: string): Promise<number> {
  return (redis as any).del(`rt:${jti}`);
}

/**
 * ---------- User version store ----------
 * uv:<userId> -> integer version
 * Used to invalidate older refresh tokens by bumping the version.
 */
export async function setVersion(userId: string, ver: number): Promise<void> {
  await (redis as any).set(`uv:${userId}`, String(ver));
}

export async function getVersion(userId: string): Promise<number> {
  const raw = await (redis as any).get(`uv:${userId}`);
  return raw ? Number(raw) : 0;
}

export async function bumpVersion(userId: string): Promise<number> {
  // INCR creates key with value 0 before incrementing if it doesn't exist
  const v = await (redis as any).incr(`uv:${userId}`);
  // node-redis returns number, ioredis returns number too; coerce just in case:
  return typeof v === "number" ? v : Number(v);
}
