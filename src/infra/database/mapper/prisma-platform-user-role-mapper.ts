import { UserRole } from '@platform-user/permissions/user-role/domain/user-role';
import { UserRole as PrismaUserRole, Prisma } from '@prisma/client';

export class PrismaUserRoleMapper {
  static toDomain(entity: PrismaUserRole): UserRole {
    if (!entity) {
      return null;
    }
    return new UserRole({
      id: entity.id,
      name: entity.name,
    });
  }

  static toPrisma(role: UserRole): Prisma.UserRoleUncheckedCreateInput {
    return {
      id: role?.id,
      name: role.name,
    };
  }
}
