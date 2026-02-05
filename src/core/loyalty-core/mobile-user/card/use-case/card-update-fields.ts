import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { CardStatus } from '@loyalty/mobile-user/card/domain/enums';

@Injectable()
export class UpdateCardFieldsUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  async execute(
    cardId: number,
    data: {
      cardTierId?: number;
      status?: CardStatus | null;
    },
  ): Promise<Card> {
    return await this.cardRepository.updateCardFields({
      id: cardId,
      cardTierId: data.cardTierId,
      status: data.status,
    });
  }
}
