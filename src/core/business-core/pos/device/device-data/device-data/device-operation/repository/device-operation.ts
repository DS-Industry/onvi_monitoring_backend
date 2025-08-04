import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@pos/device/device-data/device-data/device-operation/interface/device-operation';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';
import { PrismaCarWashDeviceOperMapper } from '@db/mapper/prisma-car-wash-device-oper-mapper';
import { CurrencyType } from '@prisma/client';
import { accessibleBy } from "@casl/prisma";

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

  public async findOneById(id: number): Promise<DeviceOperation> {
    const deviceOperation =
      await this.prisma.carWashDeviceOperationsEvent.findFirst({
        where: {
          id,
        },
      });
    return PrismaCarWashDeviceOperMapper.toDomain(deviceOperation);
  }
  public async findAllByFilter(
    ability?: any,
    organizationId?: number,
    posId?: number,
    carWashDeviceId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    currencyType?: CurrencyType,
    skip?: number,
    take?: number,
  ): Promise<DeviceOperation[]> {
    const where: any = {};

    if (organizationId !== undefined) {
      where.carWashDevice = {
        carWasPos: {
          pos: {
            organizationId,
          },
        },
      };
    }

    if (posId !== undefined) {
      where.carWashDevice = {
        carWasPos: {
          posId,
        },
      };
    }

    if (carWashDeviceId !== undefined) {
      where.carWashDeviceId = carWashDeviceId;
    }

    if (dateStart !== undefined && dateEnd !== undefined) {
      where.operDate = {
        gte: dateStart,
        lte: dateEnd,
      };
    }

    if (currencyType !== undefined) {
      where.currency = {
        currencyType,
      };
    }

    const finalWhere = ability
      ? { AND: [accessibleBy(ability).CarWashDeviceOperationsEvent, where] }
      : where;

    const deviceOperations =
      await this.prisma.carWashDeviceOperationsEvent.findMany({
        skip: skip ?? undefined,
        take: take ?? undefined,
        where: finalWhere,
        orderBy: {
          operDate: 'asc',
        },
      });
    return deviceOperations.map((item) =>
      PrismaCarWashDeviceOperMapper.toDomain(item),
    );
  }

  public async findLastOperByPosId(
    carWashPosId: number,
  ): Promise<DeviceOperation> {
    const deviceOperation =
      await this.prisma.carWashDeviceOperationsEvent.findFirst({
        where: {
          carWashDevice: {
            carWashPosId,
          },
        },
        orderBy: {
          operDate: 'desc',
        },
      });
    return PrismaCarWashDeviceOperMapper.toDomain(deviceOperation);
  }

  public async findLastOperByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceOperation> {
    const deviceOperation =
      await this.prisma.carWashDeviceOperationsEvent.findFirst({
        where: {
          carWashDeviceId,
        },
        orderBy: {
          operDate: 'desc',
        },
      });
    return PrismaCarWashDeviceOperMapper.toDomain(deviceOperation);
  }

  public async countAllByDeviceIdAndDateOper(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    return this.prisma.carWashDeviceOperationsEvent.count({
      where: {
        carWashDeviceId: deviceId,
        operDate: { gte: dateStart, lte: dateEnd },
      },
    });
  }
}
