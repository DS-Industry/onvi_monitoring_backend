import { Injectable } from '@nestjs/common';
import { IDeviceProgramRepository } from '@device/device-program/device-program/interface/device-program';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceProgram } from '@device/device-program/device-program/domain/device-program';
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
}
