import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-http-bearer';
import { IDeviceApiKeyRepository } from '../interfaces/api-key';
import { DeviceApiKey } from '../domain/api-key';

@Injectable()
export class ApiKeyStrategy extends PassportStrategy(Strategy, 'api-key') {
  constructor(
    private readonly deviceApiKeyRepository: IDeviceApiKeyRepository,
  ) {
    super({
      // Extract API key from the Authorization header
      passReqToCallback: true,
    });
  }

  async validate(req: Request, apiKey: string): Promise<DeviceApiKey> {
    const deviceApiKey = await this.deviceApiKeyRepository.findByKey(apiKey);
    if (!deviceApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }
    return deviceApiKey;
  }
}
