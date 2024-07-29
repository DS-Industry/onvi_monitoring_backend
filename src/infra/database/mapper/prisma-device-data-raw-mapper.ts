import { DeviceDataRaw as PrismaDeviceDataRaw, Prisma } from '@prisma/client';
import { DeviceDataRaw } from '@device/device-data-raw/domain/device-data-raw';

export class PrismaDeviceDataRawMapper {
  static toDomain(entity: PrismaDeviceDataRaw): DeviceDataRaw {
    if (!entity) {
      return null;
    }
    return new DeviceDataRaw({
      id: entity.id,
      data: entity.data,
      errors: entity.errors,
      status: entity.status,
      version: entity.version,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      countRow: entity.countRow,
      countError: entity.countError,
    });
  }

  static toPrisma(
    deviceDataRaw: DeviceDataRaw,
  ): Prisma.DeviceDataRawUncheckedCreateInput {
    return {
      id: deviceDataRaw?.id,
      data: deviceDataRaw.data,
      errors: deviceDataRaw?.errors,
      status: deviceDataRaw?.status,
      version: deviceDataRaw.version,
      createdAt: deviceDataRaw?.createdAt,
      updatedAt: deviceDataRaw?.updatedAt,
      countRow: deviceDataRaw?.countRow,
      countError: deviceDataRaw?.countError,
    };
  }
}
