// src/app/device/auth/strategies/api-key.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-headerapikey';
import { IDeviceApiKeyRepository } from '../interfaces/api-key';
import { DeviceApiKey } from '../domain/api-key';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(
    private readonly deviceApiKeyRepository: IDeviceApiKeyRepository,
  ) {
    super({ header: 'X-API-KEY', prefix: '' }, true, async (apiKey, done) => {
      return this.validate(apiKey, done);
    });
  }

  async validate(apiKey: string, done: (error: Error, data) => {}) {
    try {
      const deviceApiKey = await this.deviceApiKeyRepository.findByKey(apiKey);

      if (!deviceApiKey || deviceApiKey.expiryAt < new Date()) {
        return done(
          new UnauthorizedException('Invalid or expired API key'),
          null,
        );
      }
      done(null, deviceApiKey);
    } catch (error) {
      done(new UnauthorizedException('Unauthorized'), null);
    }
  }
}
