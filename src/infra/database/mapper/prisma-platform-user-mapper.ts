import { User } from '@platform-user/user/domain/user';
import { User as PrismaPlatformUser, Prisma } from '@prisma/client';
export type PrismaPlatformUserWithRole = Prisma.UserGetPayload<{
  include: { userRole: true };
}>;
export class PrismaPlatformUserMapper {
  static toDomain(
    entity: PrismaPlatformUser | PrismaPlatformUserWithRole,
  ): User {
    if (!entity) {
      return null;
    }
    const roleName =
      'userRole' in entity && entity.userRole
        ? entity.userRole.name
        : undefined;

    return new User({
      id: entity.id,
      userRoleId: entity.userRoleId,
      userRoleName: roleName,
      name: entity.name,
      surname: entity.surname,
      middlename: entity.middlename,
      birthday: entity.birthday,
      phone: entity.phone,
      email: entity.email,
      password: entity.password,
      gender: entity.gender,
      position: entity.position,
      status: entity.status,
      avatar: entity.avatar,
      country: entity.country,
      countryCode: entity.countryCode,
      timezone: entity.timezone,
      refreshTokenId: entity.refreshTokenId,
      receiveNotifications: entity.receiveNotifications,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user?.id,
      userRoleId: user.userRoleId,
      name: user.name,
      surname: user?.surname,
      middlename: user?.middlename,
      birthday: user?.birthday,
      phone: user.phone,
      email: user.email,
      password: user.password,
      gender: user?.gender,
      position: user.position,
      status: user?.status,
      avatar: user?.avatar,
      country: user?.country,
      countryCode: user?.countryCode,
      timezone: user?.timezone,
      refreshTokenId: user?.refreshTokenId,
      receiveNotifications: user?.receiveNotifications,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
