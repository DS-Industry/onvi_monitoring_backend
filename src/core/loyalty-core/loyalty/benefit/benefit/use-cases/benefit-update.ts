import { Injectable } from '@nestjs/common';
import { IBenefitRepository } from '@loyalty/loyalty/benefit/benefit/interface/benefit';
import { UpdateDto } from '@loyalty/loyalty/benefit/benefit/use-cases/dto/update.dto';
import { Benefit } from '@loyalty/loyalty/benefit/benefit/domain/benefit';

@Injectable()
export class UpdateBenefitUseCase {
  constructor(private readonly benefitRepository: IBenefitRepository) {}

  async execute(input: UpdateDto, oldBenefit: Benefit): Promise<Benefit> {
    const { name, benefitType, bonus } = input;

    oldBenefit.name = name ? name : oldBenefit.name;
    oldBenefit.bonus = bonus ? bonus : oldBenefit.bonus;
    oldBenefit.benefitType = benefitType ? benefitType : oldBenefit.benefitType;

    return await this.benefitRepository.update(oldBenefit);
  }
}
