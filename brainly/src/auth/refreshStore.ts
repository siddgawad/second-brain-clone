// src/auth/refreshStore.ts
import { redis } from '../redis';

/** ======== JTI <-> user mapping (for rotation) ======== */
export async function putRefreshJti(jti: string, userId: string, ttlSeconds: number) {
  // ioredis signature uses positional args: 'EX', ttl
  await redis.set(`rt:${jti}`, userId, 'EX', ttlSeconds);
}

export function getRefreshUserId(jti: string) {
  return redis.get(`rt:${jti}`);
}

export function delRefreshJti(jti: string) {
  return redis.del(`rt:${jti}`);
}

/** ======== Per-user refresh version (global logout) ======== */
/** Current version for a user. Default 0 if unset. */
export async function getVersion(userId: string): Promise<number> {
  const v = await redis.get(`rv:${userId}`);
  return v ? parseInt(v, 10) : 0;
}

/** Set an explicit version (rarely needed). */
export async function setVersion(userId: string, ver: number): Promise<void> {
  await redis.set(`rv:${userId}`, String(ver));
}

/** Atomically increment version to invalidate all existing refresh tokens. */
export async function bumpVersion(userId: string): Promise<number> {
  return redis.incr(`rv:${userId}`);
}
