import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@device/device-operation/interface/device-operation';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceOperation } from '@device/device-operation/domain/device-operation';
import { PrismaCarWashDeviceOperMapper } from '@db/mapper/prisma-car-wash-device-oper-mapper';

@Injectable()
export class DeviceOperationRepository extends IDeviceOperationRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: DeviceOperation): Promise<DeviceOperation> {
    const deviceOperationEntity = PrismaCarWashDeviceOperMapper.toPrisma(input);
    const deviceOperation =
      await this.prisma.carWashDeviceOperationsEvent.create({
        data: deviceOperationEntity,
      });
    return PrismaCarWashDeviceOperMapper.toDomain(deviceOperation);
  }

  public async findAllByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceOperation[]> {
    const deviceOperations =
      await this.prisma.carWashDeviceOperationsEvent.findMany({
        where: {
          carWashDeviceId,
        },
      });
    return deviceOperations.map((item) =>
      PrismaCarWashDeviceOperMapper.toDomain(item),
    );
  }

  public async findOneById(id: number): Promise<DeviceOperation> {
    const deviceOperation =
      await this.prisma.carWashDeviceOperationsEvent.findFirst({
        where: {
          id,
        },
      });
    return PrismaCarWashDeviceOperMapper.toDomain(deviceOperation);
  }
}
