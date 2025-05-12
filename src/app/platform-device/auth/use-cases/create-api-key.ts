import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { IDeviceApiKeyRepository } from '../interfaces/api-key';
import { DeviceApiKey } from '../domain/api-key';
import { CreateDeviceApiKeyDto } from '../controller/dto/create-api-key-dto';
import { ConfigService } from '@nestjs/config';
import ms = require('ms');

@Injectable()
export class CreateDeviceApiKeyUseCase {
  constructor(
    private readonly deviceApiKeyRepository: IDeviceApiKeyRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(input: CreateDeviceApiKeyDto): Promise<DeviceApiKey> {
    const key = uuidv4();
    const issuedAt = new Date();
    const expiresIn = this.configService.get<string>('apiExpirationTime');
    const expiryAt = new Date(
      new Date().getTime() + Math.floor(ms(expiresIn) / 1000) * 1000,
    );

    const deviceApiKey = new DeviceApiKey({
      key,
      issuedAt,
      expiryAt,
      organizationId: input.organizationId,
    });

    return await this.deviceApiKeyRepository.create(deviceApiKey);
  }
}
