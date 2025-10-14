import { Injectable, Inject } from '@nestjs/common';
import { ICardRepository } from '../domain/card.repository.interface';

@Injectable()
export class GetCardTariffUseCase {
  constructor(@Inject('ICardRepository') private readonly cardRepository: ICardRepository) {}

  async execute(user: any): Promise<{ cashBack: number }> {
    const card = await this.cardRepository.findFirstByClientIdWithCardTierAndBenefits(user.clientId);

    if (!card || !card.cardTier) {
      throw new Error('Card or card tier not found');
    }

    let cashBack = 0;
    
    if (card.cardTier.benefits && card.cardTier.benefits.length > 0) {
      const cashbackBenefit = card.cardTier.benefits.find(
        benefit => benefit.benefitType === 'CASHBACK'
      );
      
      if (cashbackBenefit) {
        cashBack = cashbackBenefit.bonus;
      }
    }

    return { cashBack };
  }
}
