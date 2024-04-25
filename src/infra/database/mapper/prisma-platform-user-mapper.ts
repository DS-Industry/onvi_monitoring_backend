import { User } from '@platform-user/user/domain/user';
import { User as PrismaPlatformUser, Prisma } from '@prisma/client';

export class PrismaPlatformUserMapper {
  static toDomain(entity: PrismaPlatformUser): User {
    if (!entity) {
      return null;
    }
    return new User({
      id: entity.id,
      userRoleId: entity.userRoleId,
      name: entity.name,
      surname: entity.surname,
      middlename: entity.middlename,
      birthday: entity.birthday,
      phone: entity.phone,
      email: entity.email,
      gender: entity.gender,
      status: entity.status,
      avatar: entity.avatar,
      country: entity.country,
      countryCode: entity.countryCode,
      timezone: entity.timezone,
      refreshTokenId: entity.refreshTokenId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user?.id,
      userRoleId: user.userRoleId,
      name: user.name,
      surname: user.surname,
      middlename: user?.middlename,
      birthday: user?.birthday,
      phone: user?.phone,
      email: user.email,
      gender: user.gender,
      status: user?.status,
      avatar: user?.avatar,
      country: user.country,
      countryCode: user.countryCode,
      timezone: user.timezone,
      refreshTokenId: user?.refreshTokenId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
