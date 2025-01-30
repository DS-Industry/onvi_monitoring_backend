import { Injectable } from '@nestjs/common';
import { IDeviceOperationRepository } from '@pos/device/device-data/device-data/device-operation/interface/device-operation';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceOperation } from '@pos/device/device-data/device-data/device-operation/domain/device-operation';
import { PrismaCarWashDeviceOperMapper } from '@db/mapper/prisma-car-wash-device-oper-mapper';
import { CurrencyType } from '@prisma/client';

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

  public async findAllByCurTypeAndDate(
    currencyType: CurrencyType,
    carWashDeviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperation[]> {
    const deviceOperations =
      await this.prisma.carWashDeviceOperationsEvent.findMany({
        where: {
          currency: {
            currencyType,
          },
          carWashDeviceId,
          operDate: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
      });
    return deviceOperations.map((item) =>
      PrismaCarWashDeviceOperMapper.toDomain(item),
    );
  }

  public async findAllByOrgIdAndDate(
    organizationId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperation[]> {
    const deviceOperations =
      await this.prisma.carWashDeviceOperationsEvent.findMany({
        where: {
          carWashDevice: {
            carWasPos: {
              pos: {
                organizationId,
              },
            },
          },
          operDate: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
        orderBy: {
          operDate: 'asc',
        },
      });
    return deviceOperations.map((item) =>
      PrismaCarWashDeviceOperMapper.toDomain(item),
    );
  }

  public async findAllByPosIdAndDate(
    carWashPosId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceOperation[]> {
    const deviceOperations =
      await this.prisma.carWashDeviceOperationsEvent.findMany({
        where: {
          carWashDevice: {
            carWashPosId,
          },
          operDate: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
        include: {
          currency: true,
        },
        orderBy: {
          operDate: 'asc',
        },
      });
    return deviceOperations.map((item) =>
      PrismaCarWashDeviceOperMapper.toDomain(item),
    );
  }

  public async findAllByDeviceIdAndDate(
    carWashDeviceId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<DeviceOperation[]> {
    const deviceOperations =
      await this.prisma.carWashDeviceOperationsEvent.findMany({
        skip: skip ?? undefined,
        take: take ?? undefined,
        where: {
          carWashDeviceId,
          operDate: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
        include: {
          currency: true,
        },
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
}
