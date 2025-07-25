import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';
import { LTYCardTier as PrismaLoyaltyTier, Prisma } from '@prisma/client';

export class PrismaLoyaltyTierMapper {
  static toDomain(entity: PrismaLoyaltyTier): LoyaltyTier {
    if (!entity) {
      return null;
    }
    return new LoyaltyTier({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      loyaltyProgramId: entity.ltyProgramId,
      limitBenefit: entity.limitBenefit,
    });
  }

  static toPrisma(
    loyaltyTier: LoyaltyTier,
  ): Prisma.LTYCardTierUncheckedCreateInput {
    return {
      id: loyaltyTier?.id,
      name: loyaltyTier.name,
      description: loyaltyTier?.description,
      ltyProgramId: loyaltyTier.loyaltyProgramId,
      limitBenefit: loyaltyTier.limitBenefit,
    };
  }
}
