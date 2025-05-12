import { Injectable } from '@nestjs/common';
import { ILoyaltyTierRepository } from '@loyalty/loyalty/loyaltyTier/interface/loyaltyTier';
import { LoyaltyTierUpdateDto } from '@loyalty/loyalty/loyaltyTier/use-cases/dto/loyaltyTier-update.dto';
import { LoyaltyTier } from '@loyalty/loyalty/loyaltyTier/domain/loyaltyTier';
import { FindMethodsBenefitUseCase } from '@loyalty/loyalty/benefit/benefit/use-cases/benefit-find-methods';

@Injectable()
export class UpdateLoyaltyTierUseCase {
  constructor(
    private readonly loyaltyTierRepository: ILoyaltyTierRepository,
    private readonly findMethodsBenefitUseCase: FindMethodsBenefitUseCase,
  ) {}

  async execute(
    input: LoyaltyTierUpdateDto,
    oldLoyaltyTier: LoyaltyTier,
  ): Promise<LoyaltyTier> {
    const { name, description, loyaltyProgramId, limitBenefit } = input;

    oldLoyaltyTier.name = name ? name : oldLoyaltyTier.name;
    oldLoyaltyTier.description = description
      ? description
      : oldLoyaltyTier.description;
    oldLoyaltyTier.loyaltyProgramId = loyaltyProgramId
      ? loyaltyProgramId
      : oldLoyaltyTier.loyaltyProgramId;
    oldLoyaltyTier.limitBenefit = limitBenefit
      ? limitBenefit
      : oldLoyaltyTier.limitBenefit;

    const loyaltyTier = await this.loyaltyTierRepository.update(oldLoyaltyTier);

    if (input.benefitIds) {
      const benefits =
        await this.findMethodsBenefitUseCase.getAllByLoyaltyTierId(
          loyaltyTier.id,
        );
      const existingBenefitIds = benefits.map((benefit) => benefit.id);

      const deleteBenefitIds = existingBenefitIds.filter(
        (id) => !input.benefitIds.includes(id),
      );
      const addBenefitIds = input.benefitIds.filter(
        (id) => !existingBenefitIds.includes(id),
      );
      await this.loyaltyTierRepository.updateConnectionBenefit(
        loyaltyTier.id,
        addBenefitIds,
        deleteBenefitIds,
      );
    }

    return loyaltyTier;
  }
}
