import { Injectable } from '@nestjs/common';
import { IDeviceMfuRepository } from '@device/device-mfu/interface/device-mfu';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceMfy } from '@device/device-mfu/domain/device-mfu';
import { PrismaCarWashDeviceMfuMapper } from '@db/mapper/prisma-car-wash-device-mfu-mapper';

@Injectable()
export class DeviceMfuRepository extends IDeviceMfuRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: DeviceMfy): Promise<DeviceMfy> {
    const deviceMfuEntity = PrismaCarWashDeviceMfuMapper.toPrisma(input);
    const deviceMfu = await this.prisma.carWashDeviceMfuEvent.create({
      data: deviceMfuEntity,
    });
    return PrismaCarWashDeviceMfuMapper.toDomain(deviceMfu);
  }

  public async findOneById(id: number): Promise<DeviceMfy> {
    const deviceMfu = await this.prisma.carWashDeviceMfuEvent.findFirst({
      where: {
        id,
      },
    });
    return PrismaCarWashDeviceMfuMapper.toDomain(deviceMfu);
  }
}
