// src/redis.ts
import Redis from 'ioredis';
import { REDIS_URL } from './env';

export const redis = REDIS_URL
  ? new Redis(REDIS_URL, { lazyConnect: false, maxRetriesPerRequest: null })
  : new Redis({ host: '127.0.0.1', port: 6379, lazyConnect: false, maxRetriesPerRequest: null });

redis.on('connect', () => console.log('[redis] connected'));
redis.on('error', (e) => console.error('[redis] error', e));

export async function pingRedis() {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}
