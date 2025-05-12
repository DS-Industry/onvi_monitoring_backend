import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IDeviceServiceRepository } from '@pos/device/device-data/device-data/device-service/interface/device-service';
import { DeviceService } from '@pos/device/device-data/device-data/device-service/domain/device-service';
import { PrismaCarWashDeviceServiceMapper } from '@db/mapper/prisma-car-wash-device-service-mapper';

@Injectable()
export class DeviceServiceRepository extends IDeviceServiceRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: DeviceService): Promise<DeviceService> {
    const deviceServiceEntity =
      PrismaCarWashDeviceServiceMapper.toPrisma(input);
    const deviceService = await this.prisma.carWashDeviceServiceEvent.create({
      data: deviceServiceEntity,
    });
    return PrismaCarWashDeviceServiceMapper.toDomain(deviceService);
  }

  public async findOneById(id: number): Promise<DeviceService> {
    const deviceService = await this.prisma.carWashDeviceServiceEvent.findFirst(
      {
        where: {
          id,
        },
      },
    );
    return PrismaCarWashDeviceServiceMapper.toDomain(deviceService);
  }
}
