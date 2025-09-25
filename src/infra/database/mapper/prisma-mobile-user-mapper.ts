import { Client } from '@loyalty/mobile-user/client/domain/client';
import { ClientMeta } from '@loyalty/mobile-user/client/domain/clientMeta';
import {
  LTYUser as PrismaMobileUser,
  LTYUserMeta as PrismaMobileUserMeta,
  Prisma,
  LTYCard,
} from '@prisma/client';

export class PrismaMobileUserMapper {
  static toDomain(
    entity: PrismaMobileUser & { meta?: PrismaMobileUserMeta, card?: LTYCard },
  ): Client {
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
      contractType: entity.contractType,
      comment: entity.comment,
      placementId: entity.placementId,
      refreshTokenId: entity.refreshTokenId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      meta: entity.meta ? this.toDomainClientMeta(entity.meta) : undefined,
      cardId: entity.card?.id,
    });
  }

  static toPrisma(client: Client): Prisma.LTYUserUncheckedCreateInput {
    return {
      id: client?.id,
      name: client.name,
      birthday: client?.birthday,
      phone: client.phone,
      email: client?.email,
      gender: client?.gender,
      status: client?.status,
      avatar: client?.avatar,
      contractType: client.contractType,
      comment: client?.comment,
      placementId: client?.placementId,
      refreshTokenId: client?.refreshTokenId,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }

  static toDomainClientMeta(entity: PrismaMobileUserMeta): ClientMeta {
    if (!entity) {
      return null;
    }
    return new ClientMeta({
      id: entity.id,
      clientId: entity.clientId,
      deviceId: entity.deviceId,
      model: entity.model,
      name: entity.name,
      platform: entity.platform,
    });
  }

  static toPrismaClientMeta(
    clientMeta: ClientMeta,
  ): Prisma.LTYUserMetaUncheckedCreateInput {
    return {
      id: clientMeta?.id,
      clientId: clientMeta.clientId,
      deviceId: clientMeta.deviceId,
      model: clientMeta.model,
      name: clientMeta.name,
      platform: clientMeta.platform,
    };
  }
}
