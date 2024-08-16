import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IDeviceObjectRepository } from '../interfaces/device-object';
import { DeviceObject } from '../domain/device-object';
import { PrismaDeviceObjectMapper } from '@db/mapper/prisma-device-object-mapper';

@Injectable()
export class DeviceObjectRepository extends IDeviceObjectRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: number): Promise<DeviceObject | null> {
    const deviceObject = await this.prisma.deviceObjects.findUnique({
      where: { id },
      include: { devicePermissions: true },
    });

    return deviceObject
      ? PrismaDeviceObjectMapper.toDomain(deviceObject)
      : null;
  }
}
