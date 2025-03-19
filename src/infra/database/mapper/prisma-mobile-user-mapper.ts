import { Client } from "@loyalty/mobile-user/client/domain/client";
import { MobileUser as PrismaMobileUser, Prisma } from '@prisma/client';

export class PrismaMobileUserMapper {
  static toDomain(entity: PrismaMobileUser): Client {
    if (!entity) {
      return null;
    }
    return new Client({
      id: entity.id,
      name: entity.name,
      birthday: entity.birthday,
      phone: entity.phone,
      email: entity.email,
      gender: entity.gender,
      status: entity.status,
      avatar: entity.avatar,
      type: entity.type,
      inn: entity.inn,
      comment: entity.comment,
      placementId: entity.placementId,
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
      birthday: client?.birthday,
      phone: client.phone,
      email: client?.email,
      gender: client?.gender,
      status: client?.status,
      avatar: client?.avatar,
      type: client.type,
      inn: client?.inn,
      comment: client?.comment,
      placementId: client?.placementId,
      refreshTokenId: client?.refreshTokenId,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      loyaltyCardId: client?.loyaltyCardId,
      mobileUserRoleId: client?.mobileUserRoleId,
    };
  }
}
