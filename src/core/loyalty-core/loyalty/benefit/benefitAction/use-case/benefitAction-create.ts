import { Injectable } from '@nestjs/common';
import { IBenefitActionRepository } from '@loyalty/loyalty/benefit/benefitAction/interface/benefitAction';
import { BenefitAction } from '@loyalty/loyalty/benefit/benefitAction/domain/benefitAction';

@Injectable()
export class CreateBenefitActionUseCase {
  constructor(
    private readonly benefitActionRepository: IBenefitActionRepository,
  ) {}

  async execute(name: string, description?: string): Promise<BenefitAction> {
    const benefitAction = new BenefitAction({
      name: name,
      description: description,
    });
    return await this.benefitActionRepository.create(benefitAction);
  }
}
