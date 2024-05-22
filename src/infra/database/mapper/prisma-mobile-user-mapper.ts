import { Client } from '@mobile-user/client/domain/client';
import { MobileUser as PrismaMobileUser, Prisma } from '@prisma/client';

export class PrismaMobileUserMapper {
  static toDomain(entity: PrismaMobileUser): Client {
    if (!entity) {
      return null;
    }
    return new Client({
      id: entity.id,
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
      loyaltyCardId: entity.loyaltyCardId,
      mobileUserRoleId: entity.mobileUserRoleId,
    });
  }

  static toPrisma(client: Client): Prisma.MobileUserUncheckedCreateInput {
    return {
      id: client?.id,
      name: client.name,
      surname: client?.surname,
      middlename: client?.middlename,
      birthday: client?.birthday,
      phone: client.phone,
      email: client?.email,
      gender: client?.gender,
      status: client?.status,
      avatar: client?.avatar,
      country: client?.country,
      countryCode: client?.countryCode,
      timezone: client?.timezone,
      refreshTokenId: client?.refreshTokenId,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      loyaltyCardId: client?.loyaltyCardId,
      mobileUserRoleId: client?.mobileUserRoleId,
    };
  }
}
