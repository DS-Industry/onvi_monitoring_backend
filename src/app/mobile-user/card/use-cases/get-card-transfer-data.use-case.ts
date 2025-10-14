import { Injectable } from '@nestjs/common';
import { CardRepository } from '../infrastructure/card.repository';

@Injectable()
export class GetCardTransferDataUseCase {
  constructor(
    private readonly cardRepository: CardRepository,
  ) {}

  async execute(devNomer: string): Promise<{
    cardId: number;
    balance: number;
  }> {
    const card = await this.cardRepository.findOneByUnqNumber(devNomer);
    
    if (!card) {
      throw new Error(`Card with number ${devNomer} not found`);
    }

    if (!card.isCardActive()) {
      throw new Error('Card is deleted and cannot be transferred');
    }
    
    if (card.isCardLocked()) {
      throw new Error('Card is locked and cannot be transferred');
    }

    return {
      cardId: card.id,
      balance: card.balance,
    };
  }
}
