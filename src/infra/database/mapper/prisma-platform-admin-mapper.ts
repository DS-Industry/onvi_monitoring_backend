import { Admin } from '@platform-admin/admin/domain/admin';
import { PlatformUser as PrismaPlatformUser, Prisma } from '@prisma/client';

export class PrismaPlatformAdminMapper {
  static toDomain(entity: PrismaPlatformUser): Admin {
    if (!entity) {
      return null;
    }
    return new Admin({
      id: entity.id,
      name: entity.name,
      surname: entity.surname,
      middlename: entity.middlename,
      birthday: entity.birthday,
      phone: entity.phone,
      email: entity.email,
      password: entity.password,
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

  static toPrisma(admin: Admin): Prisma.PlatformUserUncheckedCreateInput {
    return {
      id: admin?.id,
      name: admin.name,
      surname: admin.surname,
      middlename: admin?.middlename,
      birthday: admin?.birthday,
      phone: admin?.phone,
      email: admin.email,
      password: admin.password,
      gender: admin.gender,
      status: admin?.status,
      avatar: admin?.avatar,
      country: admin.country,
      countryCode: admin.countryCode,
      timezone: admin.timezone,
      refreshTokenId: admin?.refreshTokenId,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}
