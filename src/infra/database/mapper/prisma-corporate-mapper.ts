import { LTYCorporate as PrismaCorporate, Prisma } from '@prisma/client';
import { Corporate } from '@loyalty/mobile-user/corporate/domain/corporate';

export class PrismaCorporateMapper {
  static toDomain(entity: PrismaCorporate): Corporate {
    if (!entity) {
      return null;
    }
    return new Corporate({
      id: entity.id,
      name: entity.name,
      inn: entity.inn,
      address: entity.address,
      ownerId: entity.ownerId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
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
    };
  }
}
