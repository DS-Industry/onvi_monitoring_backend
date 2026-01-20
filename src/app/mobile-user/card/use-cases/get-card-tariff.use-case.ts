import { Injectable } from '@nestjs/common';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { FindMethodsLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-find-methods';
import { FindMethodsBenefitUseCase } from '@loyalty/loyalty/benefit/benefit/use-cases/benefit-find-methods';
import { AccountNotFoundExceptions } from '@mobile-user/client/exceptions/account-not-found.exceptions';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { LTYBenefitType } from '@prisma/client';

export interface CardTariffBenefit {
  bonus: number;
  benefitType: LTYBenefitType;
}

export interface CardTariffTier {
  id: number;
  name: string;
  description?: string;
  limitBenefit: number;
  benefits?: CardTariffBenefit[];
}

export interface CardTariffResponse {
  cardId: number;
  balance: number;
  devNumber: string;
  number: string;
  monthlyLimit?: number;
  tier?: CardTariffTier;
}

@Injectable()
export class GetCardTariffUseCase {
  constructor(
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly findMethodsLoyaltyTierUseCase: FindMethodsLoyaltyTierUseCase,
    private readonly findMethodsBenefitUseCase: FindMethodsBenefitUseCase,
  ) {}

  async execute(user: Client): Promise<CardTariffResponse> {
    const clientId = user.id;

    const card = await this.findMethodsCardUseCase.getByClientId(clientId);

    if (!card) {
      throw new AccountNotFoundExceptions(`Client ${clientId}`);
    }

    const tariffInfo: CardTariffResponse = {
      cardId: card.id,
      balance: card.balance,
      devNumber: card.devNumber,
      number: card.number,
      monthlyLimit: card.monthlyLimit,
    };

    if (card.loyaltyCardTierId) {
      const tier = await this.findMethodsLoyaltyTierUseCase.getOneById(
        card.loyaltyCardTierId,
      );

      if (tier) {
        const benefits = await this.findMethodsBenefitUseCase.getAllByLoyaltyTierId(
          tier.id,
        );

        tariffInfo.tier = {
          id: tier.id,
          name: tier.name,
          description: tier.description,
          limitBenefit: tier.limitBenefit,
          benefits: benefits.map((benefit) => ({
            bonus: benefit.bonus,
            benefitType: benefit.benefitType,
          })),
        };
      }
    }

    return tariffInfo;
  }
}
