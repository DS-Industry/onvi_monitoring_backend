import { Injectable } from '@nestjs/common';
import { StatusDeviceDataRaw } from '@prisma/client';
import { DeviceDataRaw } from '@pos/device/device-data/device-data-raw/domain/device-data-raw';
import { PrismaDeviceDataRawMapper } from '@db/mapper/prisma-device-data-raw-mapper';
import { PrismaService } from '@db/prisma/prisma.service';
import { IDeviceDataRawRepository } from '@pos/device/device-data/device-data-raw/interface/device-data-raw';

@Injectable()
export class DeviceDataRawRepository extends IDeviceDataRawRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: DeviceDataRaw): Promise<DeviceDataRaw> {
    const postDataEntity = PrismaDeviceDataRawMapper.toPrisma(input);
    const postData = await this.prisma.deviceDataRaw.create({
      data: postDataEntity,
    });
    return PrismaDeviceDataRawMapper.toDomain(postData);
  }

  public async findAllByStatus(
    status: StatusDeviceDataRaw,
  ): Promise<DeviceDataRaw[]> {
    const postData = await this.prisma.deviceDataRaw.findMany({
      where: {
        status,
      },
    });
    return postData.map((item) => PrismaDeviceDataRawMapper.toDomain(item));
  }

  public async findOneById(id: number): Promise<DeviceDataRaw> {
    const postData = await this.prisma.deviceDataRaw.findFirst({
      where: {
        id,
      },
    });
    return PrismaDeviceDataRawMapper.toDomain(postData);
  }

  public async update(input: DeviceDataRaw): Promise<DeviceDataRaw> {
    const postDataEntity = PrismaDeviceDataRawMapper.toPrisma(input);
    const postData = await this.prisma.deviceDataRaw.update({
      where: {
        id: input.id,
      },
      data: postDataEntity,
    });
    return PrismaDeviceDataRawMapper.toDomain(postData);
  }
}
