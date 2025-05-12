import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IDeviceApiKeyRepository } from '@platform-device/auth/interfaces/api-key';
import { DeviceApiKey } from '@platform-device/auth/domain/api-key';

@Injectable()
export class ValidateApiKeyStrategyUseCase {
  constructor(
    private readonly deviceApiKeyRepository: IDeviceApiKeyRepository,
  ) {}

  async execute(apiKey: string): Promise<DeviceApiKey> {
    const deviceApiKey = await this.deviceApiKeyRepository.findByKey(apiKey);

    if (!deviceApiKey || deviceApiKey.expiryAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired API key');
    }

    return deviceApiKey;
  }
}
