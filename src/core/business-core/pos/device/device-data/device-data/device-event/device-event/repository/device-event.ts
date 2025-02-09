import { Injectable } from '@nestjs/common';
import { IDeviceEventRepository } from '@pos/device/device-data/device-data/device-event/device-event/interface/device-event';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceEvent } from '@pos/device/device-data/device-data/device-event/device-event/domain/device-event';
import { PrismaCarWashDeviceEventMapper } from '@db/mapper/prisma-car-wash-device-event-mapper';

@Injectable()
export class DeviceEventRepository extends IDeviceEventRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: DeviceEvent): Promise<DeviceEvent> {
    const deviceEventEntity = PrismaCarWashDeviceEventMapper.toPrisma(input);
    const deviceEvent = await this.prisma.carWashDeviceEvent.create({
      data: deviceEventEntity,
    });
    return PrismaCarWashDeviceEventMapper.toDomain(deviceEvent);
  }

  public async findOneById(id: number): Promise<DeviceEvent> {
    const deviceEvent = await this.prisma.carWashDeviceEvent.findFirst({
      where: {
        id,
      },
    });
    return PrismaCarWashDeviceEventMapper.toDomain(deviceEvent);
  }

  public async findLastEventByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceEvent> {
    const deviceEvent = await this.prisma.carWashDeviceEvent.findFirst({
      where: {
        carWashDeviceId,
      },
      orderBy: {
        eventDate: 'desc',
      },
    });
    return PrismaCarWashDeviceEventMapper.toDomain(deviceEvent);
  }
}
