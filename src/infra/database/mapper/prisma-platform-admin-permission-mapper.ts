import {
  PlatformUserPermission as PrismaPlatformAdminPermission,
  Prisma,
} from '@prisma/client';
import { AdminPermission } from '@platform-admin/admin-permissions/domain/admin-permission';

export class PrismaPlatformAdminPermissionMapper {
  static toDomain(entity: PrismaPlatformAdminPermission): AdminPermission {
    if (!entity) return null;
    return new AdminPermission({
      id: entity.id,
      action: entity.action,
      objectId: entity.objectId,
    });
  }

  static toPrisma(
    permission: AdminPermission,
  ): Prisma.PlatformUserPermissionUncheckedCreateInput {
    return {
      id: permission?.id,
      action: permission?.action,
      objectId: permission?.objectId,
    };
  }
}
