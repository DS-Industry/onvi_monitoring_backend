import { UserPermission as PrismaUserPermission, Prisma } from '@prisma/client';
import { UserPermission } from '@platform-user/permissions/user-permissions/domain/user-permissions';

export class PrismaPlatformUserPermissionMapper {
  static toDomain(entity: PrismaUserPermission): UserPermission {
    if (!entity) return null;
    return new UserPermission({
      id: entity.id,
      action: entity.action,
      objectId: entity.objectId,
    });
  }

  static toPrisma(
    permission: UserPermission,
  ): Prisma.UserPermissionUncheckedCreateInput {
    return {
      id: permission?.id,
      action: permission?.action,
      objectId: permission?.objectId,
    };
  }
}
