import { DeviceObjects as PrismaDeviceObject, Prisma } from '@prisma/client';
import { DeviceObject } from '@platform-device/device-objects/domain/device-object';

export class PrismaDeviceObjectMapper {
  static toDomain(entity: PrismaDeviceObject): DeviceObject {
    if (!entity) return null;
    return new DeviceObject({
      id: entity.id,
      name: entity.name,
    });
  }

  static toPrisma(
    deviceObject: DeviceObject,
  ): Prisma.DeviceObjectsUncheckedCreateInput {
    return {
      id: deviceObject.id,
      name: deviceObject.name,
    };
  }
}
