import { LoyaltyTierHist } from '@loyalty/loyalty/loyaltyTierHist/domain/loyaltyTierHist';
import {
  LTYCardTierHist as PrismaLoyaltyTierHist,
  Prisma,
} from '@prisma/client';

export class PrismaLoyaltyTierHistMapper {
  static toDomain(entity: PrismaLoyaltyTierHist): LoyaltyTierHist {
    if (!entity) {
      return null;
    }
    const loyaltyTierHistProps = new LoyaltyTierHist({
      id: entity.id,
      cardId: entity.cardId,
      transitionDate: entity.transitionDate,
      oldCardTierId: entity.oldCardTierId,
      newCardTierId: entity.newCardTierId,
    });
    return <LoyaltyTierHist>loyaltyTierHistProps.getProps();
  }

  static toPrisma(
    loyaltyTierHist: LoyaltyTierHist,
  ): Prisma.LTYCardTierHistUncheckedCreateInput {
    return {
      id: loyaltyTierHist?.id,
      cardId: loyaltyTierHist.cardId,
      transitionDate: loyaltyTierHist.transitionDate,
      oldCardTierId: loyaltyTierHist.oldCardTierId,
      newCardTierId: loyaltyTierHist.newCardTierId,
    };
  }
}
