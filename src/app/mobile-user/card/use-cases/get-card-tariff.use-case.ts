import { Injectable } from '@nestjs/common';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { FindMethodsLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-find-methods';
import { AccountNotFoundExceptions } from '@mobile-user/client/exceptions/account-not-found.exceptions';
import { Client } from '@loyalty/mobile-user/client/domain/client';

export interface CardTariffTier {
  id: number;
  name: string;
  description?: string;
  limitBenefit: number;
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
        tariffInfo.tier = {
          id: tier.id,
          name: tier.name,
          description: tier.description,
          limitBenefit: tier.limitBenefit,
        };
      }
    }

    return tariffInfo;
  }
}
