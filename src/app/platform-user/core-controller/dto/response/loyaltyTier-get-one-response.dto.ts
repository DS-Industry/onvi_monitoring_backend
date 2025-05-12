export class LoyaltyTierGetOneResponseDto{
  id: number;
  name: string;
  description?: string;
  loyaltyProgramId: number;
  limitBenefit: number;
  benefitIds: number[]
}