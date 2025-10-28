import { Injectable } from '@nestjs/common';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { FindMethodsLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-find-methods';
import { AccountNotFoundExceptions } from '@mobile-user/client/exceptions/account-not-found.exceptions';

@Injectable()
export class GetCardTariffUseCase {
  constructor(
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly findMethodsLoyaltyTierUseCase: FindMethodsLoyaltyTierUseCase,
  ) {}

  async execute(user: any): Promise<any> {
    const clientId = user.props.id;
    
    const card = await this.findMethodsCardUseCase.getByClientId(clientId);
    
    if (!card) {
      throw new AccountNotFoundExceptions(`Client ${clientId}`);
    }

    let tariffInfo: any = {
      cardId: card.id,
      balance: card.balance,
      devNumber: card.devNumber,
      number: card.number,
      monthlyLimit: card.monthlyLimit,
    };

    if (card.loyaltyCardTierId) {
      const tier = await this.findMethodsLoyaltyTierUseCase.getOneById(card.loyaltyCardTierId);
      
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

