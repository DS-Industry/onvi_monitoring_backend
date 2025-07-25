import { Injectable } from '@nestjs/common';
import { IBenefitRepository } from '@loyalty/loyalty/benefit/benefit/interface/benefit';
import { LTYBenefitType } from '@prisma/client';
import { Benefit } from '@loyalty/loyalty/benefit/benefit/domain/benefit';

@Injectable()
export class CreateBenefitUseCase {
  constructor(private readonly benefitRepository: IBenefitRepository) {}

  async execute(
    name: string,
    bonus: number,
    benefitType: LTYBenefitType,
    benefitActionId?: number,
  ): Promise<Benefit> {
    const benefit = new Benefit({
      name: name,
      bonus: bonus,
      benefitType: benefitType,
      benefitActionTypeId: benefitActionId,
    });
    return await this.benefitRepository.create(benefit);
  }
}
