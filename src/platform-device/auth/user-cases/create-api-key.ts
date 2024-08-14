import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IDeviceApiKeyRepository } from '../interfaces/api-key';
import { DeviceApiKey } from '../domain/api-key';
import { CreateDeviceApiKeyDto } from '../controller/dto/create-api-key-dto';

@Injectable()
export class CreateDeviceApiKeyUseCase {
  constructor(
    private readonly deviceApiKeyRepository: IDeviceApiKeyRepository,
  ) {}

  async execute(input: CreateDeviceApiKeyDto): Promise<DeviceApiKey> {
    const key = uuidv4();
    const issuedAt = new Date();
    const expiryAt = new Date(issuedAt.getTime() + 24 * 60 * 60 * 1000);

    const deviceApiKey = new DeviceApiKey({
      key,
      issuedAt,
      expiryAt,
      organizationId: input.organizationId,
    });

    return await this.deviceApiKeyRepository.create(deviceApiKey);
  }
}
