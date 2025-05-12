import { Injectable } from '@nestjs/common';
import { IDeviceEventTypeRepository } from '@pos/device/device-data/device-data/device-event/device-event-type/interface/device-event-type';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceEventType } from '@pos/device/device-data/device-data/device-event/device-event-type/domain/device-event-type';
import { PrismaCarWashDeviceEventTypeMapper } from '@db/mapper/prisma-car-wash-device-event-type-mapper';

@Injectable()
export class DeviceEventTypeRepository extends IDeviceEventTypeRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: DeviceEventType): Promise<DeviceEventType> {
    const deviceEventTypeEntity =
      PrismaCarWashDeviceEventTypeMapper.toPrisma(input);
    const deviceEventType = await this.prisma.carWashDeviceEventType.create({
      data: deviceEventTypeEntity,
    });
    return PrismaCarWashDeviceEventTypeMapper.toDomain(deviceEventType);
  }

  public async findOneById(id: number): Promise<DeviceEventType> {
    const deviceEventType = await this.prisma.carWashDeviceEventType.findFirst({
      where: {
        id,
      },
    });
    return PrismaCarWashDeviceEventTypeMapper.toDomain(deviceEventType);
  }

  public async findOneByName(name: string): Promise<DeviceEventType> {
    const deviceEventType = await this.prisma.carWashDeviceEventType.findFirst({
      where: {
        name,
      },
    });
    return PrismaCarWashDeviceEventTypeMapper.toDomain(deviceEventType);
  }
}
