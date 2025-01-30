import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@pos/device/device-data/device-data/device-program/device-program/interface/device-program';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceProgram } from '@pos/device/device-data/device-data/device-program/device-program/domain/device-program';
import { PrismaCarWashDeviceProgramMapper } from '@db/mapper/prisma-car-wash-device-program-mapper';

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

  public async findAllByDeviceId(
    carWashDeviceId: number,
  ): Promise<DeviceProgram[]> {
    const deviceProgram = await this.prisma.carWashDeviceProgramsEvent.findMany(
      {
        where: {
          carWashDeviceId,
        },
      },
    );
    return deviceProgram.map((item) =>
      PrismaCarWashDeviceProgramMapper.toDomain(item),
    );
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

  public async findAllByOrgIdAndDate(
    organizationId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgram[]> {
    const devicePrograms =
      await this.prisma.carWashDeviceProgramsEvent.findMany({
        where: {
          carWashDevice: {
            carWasPos: {
              pos: {
                organizationId,
              },
            },
          },
          beginDate: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
        orderBy: {
          beginDate: 'asc',
        },
      });
    return devicePrograms.map((item) =>
      PrismaCarWashDeviceProgramMapper.toDomain(item),
    );
  }

  public async findAllByPosIdAndDate(
    carWashPosId: number,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgram[]> {
    const devicePrograms =
      await this.prisma.carWashDeviceProgramsEvent.findMany({
        where: {
          carWashDevice: {
            carWashPosId,
          },
          beginDate: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
        include: {
          carWashDeviceProgramsType: true,
        },
        orderBy: {
          beginDate: 'asc',
        },
      });
    return devicePrograms.map((item) =>
      PrismaCarWashDeviceProgramMapper.toDomain(item),
    );
  }

  public async findAllByPosIdAndProgramCodeAndDate(
    carWashPosId: number,
    code: string,
    dateStart: Date,
    dateEnd: Date,
  ): Promise<DeviceProgram[]> {
    const devicePrograms =
      await this.prisma.carWashDeviceProgramsEvent.findMany({
        where: {
          carWashDevice: {
            carWashPosId,
          },
          carWashDeviceProgramsType: {
            code,
          },
          beginDate: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
        orderBy: {
          beginDate: 'asc',
        },
      });
    return devicePrograms.map((item) =>
      PrismaCarWashDeviceProgramMapper.toDomain(item),
    );
  }

  public async findAllByDeviceIdAndDate(
    carWashDeviceId: number,
    dateStart: Date,
    dateEnd: Date,
    skip?: number,
    take?: number,
  ): Promise<DeviceProgram[]> {
    const devicePrograms =
      await this.prisma.carWashDeviceProgramsEvent.findMany({
        skip: skip,
        take: take,
        where: {
          carWashDeviceId,
          beginDate: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
        include: {
          carWashDeviceProgramsType: true,
        },
        orderBy: {
          beginDate: 'asc',
        },
      });
    return devicePrograms.map((item) =>
      PrismaCarWashDeviceProgramMapper.toDomain(item),
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
}
