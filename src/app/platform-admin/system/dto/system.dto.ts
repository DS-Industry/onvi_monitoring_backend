export interface CacheInvalidationRequest {
  path: string;
}

export interface CacheInvalidationResponse {
  success: boolean;
  message: string;
  invalidatedPaths: string[];
}

export interface SystemStatusResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
}


