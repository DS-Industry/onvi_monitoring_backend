import { Injectable } from '@nestjs/common';
import { IDeviceProgramTypeRepository } from '@pos/device/device-data/device-data/device-program/device-program-type/interface/device-program-type';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceProgramType } from '@pos/device/device-data/device-data/device-program/device-program-type/domain/device-program-type';
import { PrismaCarWashDeviceProgramTypeMapper } from '@db/mapper/prisma-car-wash-device-program-type-mapper';

@Injectable()
export class DeviceProgramTypeRepository extends IDeviceProgramTypeRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: DeviceProgramType): Promise<DeviceProgramType> {
    const deviceProgramTypeEntity =
      PrismaCarWashDeviceProgramTypeMapper.toPrisma(input);
    const deviceProgramType =
      await this.prisma.carWashDeviceProgramsType.create({
        data: deviceProgramTypeEntity,
      });
    return PrismaCarWashDeviceProgramTypeMapper.toDomain(deviceProgramType);
  }

  public async findAllByCarWashDeviceTypeId(
    carWashDeviceTypeId: number,
  ): Promise<DeviceProgramType[]> {
    const deviceProgramType =
      await this.prisma.carWashDeviceProgramsType.findMany({
        where: {
          carWashDeviceTypeId,
        },
      });
    return deviceProgramType.map((item) =>
      PrismaCarWashDeviceProgramTypeMapper.toDomain(item),
    );
  }

  public async findOneById(id: number): Promise<DeviceProgramType> {
    const deviceProgramType =
      await this.prisma.carWashDeviceProgramsType.findFirst({
        where: {
          id,
        },
      });
    return PrismaCarWashDeviceProgramTypeMapper.toDomain(deviceProgramType);
  }

  public async findOneByName(name: string): Promise<DeviceProgramType> {
    const deviceProgramType =
      await this.prisma.carWashDeviceProgramsType.findFirst({
        where: {
          name,
        },
      });
    return PrismaCarWashDeviceProgramTypeMapper.toDomain(deviceProgramType);
  }

  public async findAll(): Promise<DeviceProgramType[]> {
    const deviceProgramTypes =
      await this.prisma.carWashDeviceProgramsType.findMany();
    return deviceProgramTypes.map((item) =>
      PrismaCarWashDeviceProgramTypeMapper.toDomain(item),
    );
  }

  public async connectionPos(
    deviceProgramTypeIds: number[],
    posId: number,
  ): Promise<any> {
    const updates = deviceProgramTypeIds.map((id) =>
      this.prisma.carWashDeviceProgramsType.update({
        where: { id },
        data: {
          carWashPoses: {
            connect: { posId: posId },
          },
        },
      }),
    );
    return Promise.all(updates);
  }

  public async findAllByPosId(posId: number): Promise<DeviceProgramType[]> {
    const deviceProgramTypes =
      await this.prisma.carWashDeviceProgramsType.findMany({
        where: {
          carWashPoses: {
            some: {
              posId: posId,
            },
          },
        },
      });
    return deviceProgramTypes.map((item) =>
      PrismaCarWashDeviceProgramTypeMapper.toDomain(item),
    );
  }
}
