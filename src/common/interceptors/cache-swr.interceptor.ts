import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '../../infra/cache/redis.service';
import { CACHE_SWR_KEY } from '../decorators/cache-swr.decorator';

@Injectable()
export class CacheSWRInterceptor implements NestInterceptor {
  constructor(
    private readonly redisService: RedisService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    try {
      const cacheConfig = this.reflector.get(
        CACHE_SWR_KEY,
        context.getHandler(),
      );

      if (!cacheConfig) {
        return next.handle();
      }

      const request = context.switchToHttp().getRequest();
      const { method, url, headers, user } = request;

      // Only cache GET requests
      if (method !== 'GET' || !user || !user.id) {
        return next.handle();
      }

      // Generate cache key
      const keyPrefix = cacheConfig.keyPrefix || 'swr';
      const cacheKey = `${keyPrefix}:${user.id}:${url}`;

      // Check cache control headers from React
      const cacheControl = headers['cache-control'];
      const shouldInvalidate =
        cacheControl === 'no-cache' || headers['x-invalidate-cache'] === 'true';
      const shouldSkipCache =
        cacheControl === 'no-store' || headers['x-skip-cache'] === 'true';

      // Invalidate cache if requested
      if (shouldInvalidate) {
        await this.redisService.del(cacheKey);
      }

      // Skip cache entirely if requested
      if (shouldSkipCache) {
        return next.handle();
      }

      // Try to get cached data (unless we're skipping cache entirely)
      if (!shouldSkipCache && !shouldInvalidate) {
        const cachedData = await this.redisService.get(cacheKey);

        if (cachedData) {
          return of(JSON.parse(cachedData));
        }
      }

      // Execute request and cache the result
      return next.handle().pipe(
        tap(async (data) => {
          if (data) {
            await this.redisService.set(
              cacheKey,
              JSON.stringify(data),
              cacheConfig.ttl,
            );
          }
        }),
      );
    } catch (error) {
      // If Redis fails, proceed without caching
      console.error('Cache error:', error);
      return next.handle();
    }
  }
}
