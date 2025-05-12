export interface LoyaltyTierUpdateDto {
  name?: string;
  description?: string;
  loyaltyProgramId?: number;
  limitBenefit?: number;
  benefitIds?: number[];
}