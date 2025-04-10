import { Injectable } from '@nestjs/common';
import { ILoyaltyTierRepository } from '@loyalty/loyalty/loyaltyTier/interface/loyaltyTier';
import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';

@Injectable()
export class CreateLoyaltyTierUseCase {
  constructor(private readonly loyaltyTierRepository: ILoyaltyTierRepository) {}

  async execute(
    name: string,
    loyaltyProgramId: number,
    limitBenefit: number,
    description?: string,
  ): Promise<LoyaltyTier> {
    const loyaltyTier = new LoyaltyTier({
      name: name,
      description: description,
      loyaltyProgramId: loyaltyProgramId,
      limitBenefit: limitBenefit,
    });
    return await this.loyaltyTierRepository.create(loyaltyTier);
  }
}
