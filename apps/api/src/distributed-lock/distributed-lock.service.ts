import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class DistributedLockService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async acquire(key: string, ttlMs = 30000): Promise<boolean> {
    const result = await this.redis.set(`lock:${key}`, '1', 'PX', ttlMs, 'NX');
    return result === 'OK';
  }

  async release(key: string): Promise<void> {
    await this.redis.del(`lock:${key}`);
  }

  async withLock<T>(key: string, fn: () => Promise<T>, ttlMs = 30000): Promise<T> {
    const acquired = await this.acquire(key, ttlMs);
    if (!acquired) throw new Error(`Could not acquire lock: ${key}`);
    try {
      return await fn();
    } finally {
      await this.release(key);
    }
  }
}
