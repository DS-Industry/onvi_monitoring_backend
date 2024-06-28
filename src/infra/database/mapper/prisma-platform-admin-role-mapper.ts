import { AdminRole } from '@platform-admin/admin-role/domain/admin-role';
import {
  PlatformUserRole as PrismaPlatformAdminRole,
  Prisma,
} from '@prisma/client';

export class PrismaPlatformAdminRoleMapper {
  static toDomain(entity: PrismaPlatformAdminRole): AdminRole {
    if (!entity) {
      return null;
    }
    return new AdminRole({
      id: entity.id,
      name: entity.name,
    });
  }

  static toPrisma(
    role: AdminRole,
  ): Prisma.PlatformUserRoleUncheckedCreateInput {
    return {
      id: role?.id,
      name: role.name,
    };
  }
}
