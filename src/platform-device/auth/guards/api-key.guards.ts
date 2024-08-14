import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ApiKeyStrategy } from '../strategies/api-key.strategy';
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyStrategy: ApiKeyStrategy,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['authorization']?.replace('Bearer ', '');

    if (!apiKey) {
      throw new ForbiddenException('API key is missing');
    }

    try {
      const deviceApiKey = await this.apiKeyStrategy.validate(request, apiKey);
      request.deviceApiKey = deviceApiKey; // Attach the validated deviceApiKey to the request object
      return true;
    } catch (error) {
      throw new ForbiddenException('Invalid API key');
    }
  }
}
