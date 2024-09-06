import { DevicePermission } from '@platform-device/device-permissions/domain/device-permission';
import {
  DevicePermissions as PrismaDevicePermissions,
  Prisma,
} from '@prisma/client';
import { JSONObject } from '@common/types/json-type';

export class PrismaDevicePermissionMapper {
  static toPrisma(
    devicePermission: DevicePermission,
  ): Prisma.DevicePermissionsUncheckedCreateInput {
    return {
      id: devicePermission?.id,
      action: devicePermission.action,
      objectId: devicePermission.objectId,
      condition: devicePermission.condition,
    };
  }

  static toDomain(entity: PrismaDevicePermissions): DevicePermission {
    if (!entity) {
      return null;
    }
    const condition = this.fromJson(entity?.condition);
    return new DevicePermission({
      id: entity.id,
      action: entity.action,
      objectId: entity.objectId,
      condition: condition,
    });
  }

  static toJson(condition: JSONObject): string {
    return JSON.stringify(condition);
  }

  static fromJson(json: Prisma.JsonValue): JSONObject {
    try {
      if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
        return json as JSONObject;
      }
    } catch (e) {
      throw new Error(e);
    }
  }
}
