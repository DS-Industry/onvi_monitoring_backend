import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@pos/device/device-data/device-data/device-program/device-program/interface/device-program';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import { PrismaCarWashDeviceProgramMapper } from '@db/mapper/prisma-car-wash-device-program-mapper';
import { accessibleBy } from '@casl/prisma';
import {
  DeviceProgramFullDataResponseDto
} from "@pos/device/device-data/device-data/device-program/device-program/use-case/dto/device-program-full-data-response.dto";

@Injectable()
export class DeviceProgramRepository extends IDeviceProgramRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: DeviceProgram): Promise<DeviceProgram> {
    const deviceProgramEntity =
      PrismaCarWashDeviceProgramMapper.toPrisma(input);
    const deviceProgram = await this.prisma.carWashDeviceProgramsEvent.create({
      data: deviceProgramEntity,
    });
    return PrismaCarWashDeviceProgramMapper.toDomain(deviceProgram);
  }

  public async findOneById(id: number): Promise<DeviceProgram> {
    const deviceProgram =
      await this.prisma.carWashDeviceProgramsEvent.findFirst({
        where: {
          id,
        },
      });
    return PrismaCarWashDeviceProgramMapper.toDomain(deviceProgram);
  }

  public async findAllByFilter(
    ability?: any,
    organizationId?: number,
    posId?: number,
    carWashDeviceId?: number,
    dateStart?: Date,
    dateEnd?: Date,
    programCode?: string,
    isPaid?: number,
    skip?: number,
    take?: number,
  ): Promise<DeviceProgramFullDataResponseDto[]> {
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
      where.beginDate = {
        gte: dateStart,
        lte: dateEnd,
      };
    }

    if (organizationId !== undefined) {
      where.carWashDevice = {
        carWasPos: {
          pos: {
            organizationId,
          },
        },
      };
    }

    if (isPaid !== undefined) {
      where.isPaid = isPaid;
    }

    if (programCode !== undefined) {
      where.carWashDeviceProgramsType = {
        code: programCode,
      };
    }

    const finalWhere = ability
      ? {
          AND: [
            {
              carWashDevice: {
                carWasPos: {
                  pos: accessibleBy(ability).Pos,
                },
              },
            },
            where,
          ],
        }
      : where;

    const devicePrograms =
      await this.prisma.carWashDeviceProgramsEvent.findMany({
        skip: skip ?? undefined,
        take: take ?? undefined,
        where: finalWhere,
        include: {
          carWashDeviceProgramsType: true,
          carWashDevice: {
            include: {
              carWasPos: {
                select: {
                  pos: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          beginDate: 'asc',
        },
      });
    return devicePrograms.map((item) =>
      PrismaCarWashDeviceProgramMapper.toDomainWithPos(item),
    );
  }

  public async findLastProgramByPosId(
    carWashPosId: number,
  ): Promise<DeviceProgram> {
    const deviceProgram =
      await this.prisma.carWashDeviceProgramsEvent.findFirst({
        where: {
          carWashDevice: {
            carWashPosId,
          },
        },
        orderBy: {
          beginDate: 'desc',
        },
      });
    return PrismaCarWashDeviceProgramMapper.toDomain(deviceProgram);
  }

  public async findLastProgramByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceProgram> {
    const deviceProgram =
      await this.prisma.carWashDeviceProgramsEvent.findFirst({
        where: {
          carWashDeviceId,
        },
        orderBy: {
          beginDate: 'desc',
        },
      });
    return PrismaCarWashDeviceProgramMapper.toDomain(deviceProgram);
  }

  public async findProgramForCheckCar(
    carWashDeviceId: number,
    dateStart: Date,
    carWashDeviceProgramsTypeId: number,
  ): Promise<Date> {
    const deviceProgram =
      await this.prisma.carWashDeviceProgramsEvent.findFirst({
        where: {
          carWashDeviceId,
          carWashDeviceProgramsTypeId,
          beginDate: { lt: dateStart },
        },
        orderBy: {
          beginDate: 'desc',
        },
      });
    if (!deviceProgram) {
      return null;
    }
    return deviceProgram.beginDate;
  }

  public async countAllByDeviceIdAndDateProgram(
    deviceId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<number> {
    return this.prisma.carWashDeviceProgramsEvent.count({
      where: {
        carWashDeviceId: deviceId,
        beginDate: { gte: dateStart, lte: dateEnd },
      },
    });
  }
}
