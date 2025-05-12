import { Injectable } from '@nestjs/common';
import { IDeviceApiKeyRepository } from '../interfaces/api-key';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceApiKey } from '../domain/api-key';
import { PrismaDeviceApiKeyMapper } from '@db/mapper/prisma-device-api-key-mapper';

@Injectable()
export class DeviceApiKeyRepository extends IDeviceApiKeyRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(input: DeviceApiKey): Promise<DeviceApiKey> {
    const deviceApiKeyPrismaEntity = PrismaDeviceApiKeyMapper.toPrisma(input);
    const deviceApiKey = await this.prisma.deviceApiKey.create({
      data: deviceApiKeyPrismaEntity,
    });
    return PrismaDeviceApiKeyMapper.toDomain(deviceApiKey);
  }

  async findByKey(key: string): Promise<DeviceApiKey | null> {
    const deviceApiKey = await this.prisma.deviceApiKey.findFirst({
      where: { key },
    });

    return deviceApiKey
      ? PrismaDeviceApiKeyMapper.toDomain(deviceApiKey)
      : null;
  }
}
