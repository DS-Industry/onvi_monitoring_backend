import {
  PlatformUserPermission as PrismaPlatformUserPermission,
  Prisma,
} from '@prisma/client';
import { AdminPermission } from '@platform-admin/admin-permissions/domain/admin-permission';
import { JSONObject } from '@common/types/json-type';

export class PrismaPlatformAdminPermissionMapper {
  static toDomain(entity: PrismaPlatformUserPermission): AdminPermission {
    if (!entity) return null;
    const condition = this.fromJson(entity.condition);
    return new AdminPermission({
      id: entity.id,
      action: entity.action,
      objectId: entity.objectId,
      condition: condition,
    });
  }

  static toPrisma(
    permission: AdminPermission,
  ): Prisma.PlatformUserPermissionUncheckedCreateInput {
    const condition = this.toJson(permission?.condition);
    return {
      id: permission?.id,
      action: permission?.action,
      objectId: permission?.objectId,
      condition: condition,
    };
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
