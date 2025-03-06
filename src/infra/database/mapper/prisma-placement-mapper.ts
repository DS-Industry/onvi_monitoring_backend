import { Placement as PrismaPlacement, Prisma } from '@prisma/client';
import { Placement } from '@business-core/placement/domain/placement';

export class PrismaPlacementMapper {
  static toDomain(entity: PrismaPlacement): Placement {
    if (!entity) {
      return null;
    }
    return new Placement({
      id: entity.id,
      country: entity.country,
      region: entity.region,
      city: entity.city,
      utc: entity.utc,
    });
  }

  static toPrisma(placement: Placement): Prisma.PlacementUncheckedCreateInput {
    return {
      id: placement?.id,
      country: placement.country,
      region: placement.region,
      city: placement.city,
      utc: placement.utc,
    };
  }
}
