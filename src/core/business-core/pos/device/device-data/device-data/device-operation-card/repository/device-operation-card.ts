import { Injectable } from '@nestjs/common';
import { IDeviceOperationCardRepository } from '@pos/device/device-data/device-data/device-operation-card/interface/device-operation-card';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceOperationCard } from '@pos/device/device-data/device-data/device-operation-card/domain/device-operation-card';
import { PrismaCarWashDeviceOperCardMapper } from '@db/mapper/prisma-car-wash-device-oper-card-mapper';

@Injectable()
export class DeviceOperationCardRepository extends IDeviceOperationCardRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: DeviceOperationCard,
  ): Promise<DeviceOperationCard> {
    const deviceOperationCardEntity =
      PrismaCarWashDeviceOperCardMapper.toPrisma(input);
    const deviceOperationCard =
      await this.prisma.carWashDeviceOperationsCardEvent.create({
        data: deviceOperationCardEntity,
      });
    return PrismaCarWashDeviceOperCardMapper.toDomain(deviceOperationCard);
  }

  public async findAllByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceOperationCard[]> {
    const deviceOperationCards =
      await this.prisma.carWashDeviceOperationsCardEvent.findMany({
        where: {
          carWashDeviceId,
        },
      });
    return deviceOperationCards.map((item) =>
      PrismaCarWashDeviceOperCardMapper.toDomain(item),
    );
  }

  public async findOneById(id: number): Promise<DeviceOperationCard> {
    const deviceOperationCard =
      await this.prisma.carWashDeviceOperationsCardEvent.findFirst({
        where: {
          id,
        },
      });
    return PrismaCarWashDeviceOperCardMapper.toDomain(deviceOperationCard);
  }
}
