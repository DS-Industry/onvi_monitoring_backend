import { Injectable } from '@nestjs/common';
import { FindMethodsBenefitUseCase } from '@loyalty/loyalty/benefit/benefit/use-cases/benefit-find-methods';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { CardBenefitDataDto } from '@loyalty/mobile-user/card/use-case/dto/card-benefit-data.dto';
import { Benefit } from '@loyalty/loyalty/benefit/benefit/domain/benefit';
import { BenefitType } from '@prisma/client';

@Injectable()
export class GetBenefitsCardUseCase {
  constructor(
    private readonly findMethodsBenefitUseCase: FindMethodsBenefitUseCase,
  ) {}

  async execute(card: Card): Promise<CardBenefitDataDto> {
    const result: CardBenefitDataDto = {
      cashback: 0,
      discount: 0,
    };
    if (card.loyaltyCardTierId) {
      const benefits =
        await this.findMethodsBenefitUseCase.getAllByLoyaltyTierId(
          card.loyaltyCardTierId,
        );

      benefits.forEach((benefit: Benefit) => {
        if (benefit.benefitActionTypeId) {
          return;
        } else {
          if (benefit.benefitType === BenefitType.CASHBACK) {
            result.cashback = Math.max(result.cashback, benefit.bonus);
          } else if (benefit.benefitType === BenefitType.DISCOUNT) {
            result.discount = Math.max(result.discount, benefit.bonus);
          }
        }
      });
    }

    return result;
  }
}
