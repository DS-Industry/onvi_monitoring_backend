export interface LoyaltyTierUpdateDto {
  name?: string;
  description?: string;
  loyaltyProgramId?: number;
  limitBenefit?: number;
  upCardTierId?: number;
  benefitIds?: number[];
}