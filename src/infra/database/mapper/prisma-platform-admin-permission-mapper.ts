import {
  PlatformUserPermission as PrismaPlatformUserPermission,
  Prisma,
} from '@prisma/client';
import { AdminPermission } from '@platform-admin/admin-permissions/domain/admin-permission';
import { Admin } from '@platform-admin/admin/domain/admin';

export class PrismaPlatformAdminPermissionMapper {
  static toDomain(entity: PrismaPlatformUserPermission): AdminPermission {
    if (!entity) return null;

    return new AdminPermission({
      id: entity.id,
      action: entity.action,
      objectId: entity.ojectId,
      condition: entity.condition,
    });
  }

  static toPrisma(
    permission: AdminPermission,
  ): Prisma.PlatformUserPermissionUncheckedCreateInput {
    return {
      id: permission?.id,
      action: permission?.action,
      ojectId: permission?.objectId,
      condition: permission?.condition,
    };
  }
}
