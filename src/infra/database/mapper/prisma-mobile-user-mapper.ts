import { Client } from '@loyalty/mobile-user/client/domain/client';
import { ClientMeta } from '@loyalty/mobile-user/client/domain/clientMeta';
import {
  LTYUser as PrismaMobileUser,
  LTYUserMeta as PrismaMobileUserMeta,
  Prisma,
  LTYCard,
} from '@prisma/client';
import { EnumMapper } from './enum-mapper';

export class PrismaMobileUserMapper {
  static toDomain(
    entity: PrismaMobileUser & { meta?: PrismaMobileUserMeta; card?: LTYCard },
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
      status: entity.status
        ? EnumMapper.toDomainStatusUser(entity.status)
        : undefined,
      avatar: entity.avatar,
      contractType: EnumMapper.toDomainContractType(entity.contractType),
      comment: entity.comment,
      placementId: entity.placementId,
      refreshTokenId: entity.refreshTokenId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      is_notifications_enabled: entity.is_notifications_enabled,
      meta: entity.meta ? this.toDomainClientMeta(entity.meta) : undefined,
      cardId: entity.card?.id,
      cardUnqNumber: entity.card?.unqNumber,  
      cardNumber: entity.card?.number,     
      cardBalance: entity.card?.balance,   
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
      status: client?.status
        ? EnumMapper.toPrismaStatusUser(client.status)
        : undefined,
      avatar: client?.avatar,
      contractType: EnumMapper.toPrismaContractType(client.contractType),
      comment: client?.comment,
      placementId: client?.placementId,
      refreshTokenId: client?.refreshTokenId,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      is_notifications_enabled: client.is_notifications_enabled,
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
