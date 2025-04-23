import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';

export abstract class ILoyaltyTierRepository {
  abstract create(input: LoyaltyTier): Promise<LoyaltyTier>;
  abstract findOneById(id: number): Promise<LoyaltyTier>;
  abstract findAllByLoyaltyProgramId(
    loyaltyProgramId: number,
  ): Promise<LoyaltyTier[]>;
  abstract findAllByLoyaltyProgramIds(
    loyaltyProgramIds: number[],
  ): Promise<LoyaltyTier[]>;
  abstract update(input: LoyaltyTier): Promise<LoyaltyTier>;
  abstract updateConnectionBenefit(
    loyaltyTierId: number,
    addBenefitIds: number[],
    deleteBenefitIds: number[],
  ): Promise<any>;
}
