import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_CACHE_HOST'),
      port: this.configService.get<number>('REDIS_CACHE_PORT'),
      password: this.configService.get<string>('REDIS_CACHE_PASSWORD'),
      retryStrategy: (times) => Math.min(times * 100, 3000),
    });

    this.client.on('connect', () => {
      console.log('✅ Redis cache connected successfully');
    });

    this.client.on('error', (err) => {
      console.error('❌ Redis cache connection error:', err);
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds = 3600): Promise<void> {
    await this.client.setex(key, ttlSeconds, value);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async scan(cursor: string, ...args: any[]): Promise<[string, string[]]> {
    const result = await this.client.scan(cursor, ...args);
    return result;
  }

  async delMultiple(...keys: string[]): Promise<void> {
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  async delByPattern(pattern: string): Promise<string[]> {
    const deletedKeys: string[] = [];
    let cursor = '0';

    do {
      const [nextCursor, keys] = await this.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );
      cursor = nextCursor;
      if (keys && keys.length > 0) {
        await this.delMultiple(...keys);
        deletedKeys.push(...keys);
      }
    } while (cursor !== '0');

    return deletedKeys;
  }
}
