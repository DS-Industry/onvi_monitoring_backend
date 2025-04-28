import { Injectable } from '@nestjs/common';
import { IBenefitActionRepository } from '@loyalty/loyalty/benefit/benefitAction/interface/benefitAction';
import { BenefitAction } from '@loyalty/loyalty/benefit/benefitAction/domain/benefitAction';

@Injectable()
export class FindMethodsBenefitActionUseCase {
  constructor(
    private readonly benefitActionRepository: IBenefitActionRepository,
  ) {}

  async getOneById(id: number): Promise<BenefitAction> {
    return await this.benefitActionRepository.findOneById(id);
  }

  async getAll(): Promise<BenefitAction[]> {
    return await this.benefitActionRepository.findAll();
  }
}
