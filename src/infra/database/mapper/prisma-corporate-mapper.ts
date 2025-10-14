import { LTYCorporate as PrismaCorporate, Prisma, LTYUser, LTYCorporateStatus } from '@prisma/client';
import { Corporate } from '@loyalty/mobile-user/corporate/domain/corporate';

export class PrismaCorporateMapper {
  static toDomain(entity: PrismaCorporate & {owner?: LTYUser}): Corporate {
    if (!entity) {
      return null;
    }
    return new Corporate({
      id: entity.id,
      name: entity.name,
      inn: entity.inn,
      address: entity.address,
      ownerId: entity.ownerId,
      ownerPhone: entity.owner?.phone,
      ownerName: entity.owner?.name,
      ownerEmail: entity.owner?.email,
      ownerAvatar: entity.owner?.avatar,
      status: entity.status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      organizationId: entity.organizationId,
    });
  }

  static toPrisma(
    corporate: Corporate,
  ): Prisma.LTYCorporateUncheckedCreateInput {
    return {
      id: corporate?.id,
      name: corporate.name,
      inn: corporate.inn,
      address: corporate.address,
      ownerId: corporate?.ownerId,
      createdAt: corporate?.createdAt,
      updatedAt: corporate?.updatedAt,
      organizationId: corporate?.organizationId,
      status: corporate?.status as LTYCorporateStatus,
    };
  }
}
