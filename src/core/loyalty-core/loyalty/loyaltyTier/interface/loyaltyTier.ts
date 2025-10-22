import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';
import { LoyaltyTierUpdateInfoResponseDto } from '@loyalty/loyalty/loyaltyTier/use-cases/dto/loyaltyTier-update-info-response.dto';

export abstract class ILoyaltyTierRepository {
  abstract create(input: LoyaltyTier): Promise<LoyaltyTier>;
  abstract findOneById(id: number): Promise<LoyaltyTier>;
  abstract findAllByLoyaltyProgramId(
    ltyProgramId: number,
    onlyWithoutChildren?: boolean,
  ): Promise<LoyaltyTier[]>;
  abstract findAllByLoyaltyProgramIds(
    ltyProgramIds: number[],
  ): Promise<LoyaltyTier[]>;
  abstract findCardsForTierUpdate(
    dateStart: Date,
    dateEnd: Date,
  ): Promise<LoyaltyTierUpdateInfoResponseDto[]>;
  abstract update(input: LoyaltyTier): Promise<LoyaltyTier>;
  abstract updateConnectionBenefit(
    loyaltyTierId: number,
    addBenefitIds: number[],
    deleteBenefitIds: number[],
  ): Promise<any>;
  abstract delete(loyaltyTierId: number): Promise<void>;
}
