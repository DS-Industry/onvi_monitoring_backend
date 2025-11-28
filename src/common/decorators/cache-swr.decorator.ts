import { SetMetadata } from '@nestjs/common';

export const CACHE_SWR_KEY = 'cache_swr';
export const CacheSWR = (ttl: number = 3600, keyPrefix?: string) =>
  SetMetadata(CACHE_SWR_KEY, { ttl, keyPrefix });
