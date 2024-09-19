import { DevicePermission } from '@platform-device/device-permissions/domain/device-permission';
import {
  DevicePermissions as PrismaDevicePermissions,
  Prisma,
} from '@prisma/client';

export class PrismaDevicePermissionMapper {
  static toPrisma(
    devicePermission: DevicePermission,
  ): Prisma.DevicePermissionsUncheckedCreateInput {
    return {
      id: devicePermission?.id,
      action: devicePermission.action,
      objectId: devicePermission.objectId,
    };
  }

  static toDomain(entity: PrismaDevicePermissions): DevicePermission {
    if (!entity) {
      return null;
    }
    return new DevicePermission({
      id: entity.id,
      action: entity.action,
      objectId: entity.objectId,
    });
  }
}
