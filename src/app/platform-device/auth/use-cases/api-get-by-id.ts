import { Injectable } from '@nestjs/common';
import { IDeviceApiKeyRepository } from '../interfaces/api-key';
import { DeviceApiKey } from '../domain/api-key';

@Injectable()
export class FindDeviceApiKeysByKeyUseCase {
  constructor(
    private readonly deviceApiKeyRepository: IDeviceApiKeyRepository,
  ) {}

  async execute(key: string): Promise<DeviceApiKey | null> {
    return this.deviceApiKeyRepository.findByKey(key);
  }
}
