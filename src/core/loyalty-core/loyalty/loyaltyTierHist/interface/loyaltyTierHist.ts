import { LoyaltyTierHist } from '@loyalty/loyalty/loyaltyTierHist/domain/loyaltyTierHist';

export abstract class ILoyaltyTierHistRepository {
  abstract create(input: LoyaltyTierHist): Promise<LoyaltyTierHist>;
  abstract createMany(input: LoyaltyTierHist[]): Promise<LoyaltyTierHist[]>;
  abstract findOneById(id: number): Promise<LoyaltyTierHist>;
  abstract findAllByFilter(
    cardId?: number,
    transitionDateStart?: Date,
    transitionDateEnd?: Date,
    oldCardTierId?: number,
    newCardTierId?: number,
  ): Promise<LoyaltyTierHist[]>;
}
