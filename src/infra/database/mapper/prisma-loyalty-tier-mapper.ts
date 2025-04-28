import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';
import { LoyaltyCardTier as PrismaLoyaltyTier, Prisma } from '@prisma/client';

export class PrismaLoyaltyTierMapper {
  static toDomain(entity: PrismaLoyaltyTier): LoyaltyTier {
    if (!entity) {
      return null;
    }
    return new LoyaltyTier({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      loyaltyProgramId: entity.loyaltyProgramId,
      limitBenefit: entity.limitBenefit,
    });
  }

  static toPrisma(
    loyaltyTier: LoyaltyTier,
  ): Prisma.LoyaltyCardTierUncheckedCreateInput {
    return {
      id: loyaltyTier?.id,
      name: loyaltyTier.name,
      description: loyaltyTier?.description,
      loyaltyProgramId: loyaltyTier.loyaltyProgramId,
      limitBenefit: loyaltyTier.limitBenefit,
    };
  }
}
