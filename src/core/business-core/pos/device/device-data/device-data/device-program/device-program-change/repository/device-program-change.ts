import { Injectable } from '@nestjs/common';
import { IDeviceProgramChangeRepository } from '@pos/device/device-data/device-data/device-program/device-program-change/interface/device-program-change';
import { PrismaService } from '@db/prisma/prisma.service';
import { DeviceProgramChange } from '@pos/device/device-data/device-data/device-program/device-program-change/domain/device-program-change';
import { PrismaDeviceProgramChangeMapper } from '@db/mapper/prisma-device-program-change-mapper';

@Injectable()
export class DeviceProgramChangeRepository extends IDeviceProgramChangeRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(
    input: DeviceProgramChange,
  ): Promise<DeviceProgramChange> {
    const deviceProgramChangeEntity =
      PrismaDeviceProgramChangeMapper.toPrisma(input);
    const deviceProgramChange = await this.prisma.programChange.create({
      data: deviceProgramChangeEntity,
    });
    return PrismaDeviceProgramChangeMapper.toDomain(deviceProgramChange);
  }

  public async findOneById(id: number): Promise<DeviceProgramChange> {
    const deviceProgramChange = await this.prisma.programChange.findFirst({
      where: {
        id,
      },
    });
    return PrismaDeviceProgramChangeMapper.toDomain(deviceProgramChange);
  }

  public async findOneByDeviceIdAndFromId(
    deviceId: number,
    fromId: number,
  ): Promise<DeviceProgramChange> {
    const deviceProgramChange = await this.prisma.programChange.findFirst({
      where: {
        carWashDeviceId: deviceId,
        carWashDeviceProgramsTypeFromId: fromId,
      },
    });
    return PrismaDeviceProgramChangeMapper.toDomain(deviceProgramChange);
  }

  public async update(
    input: DeviceProgramChange,
  ): Promise<DeviceProgramChange> {
    const deviceProgramChangeEntity =
      PrismaDeviceProgramChangeMapper.toPrisma(input);
    const deviceProgramChange = await this.prisma.programChange.update({
      where: {
        id: input.id,
      },
      data: deviceProgramChangeEntity,
    });
    return PrismaDeviceProgramChangeMapper.toDomain(deviceProgramChange);
  }
}
