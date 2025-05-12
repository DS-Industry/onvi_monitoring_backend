import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { CardUpdateDto } from '@loyalty/mobile-user/card/use-case/dto/card-update.dto';

@Injectable()
export class UpdateCardUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  async execute(input: CardUpdateDto, oldCard: Card): Promise<Card> {
    const { balance, monthlyLimit, loyaltyCardTierId } = input;

    oldCard.balance = balance ? balance : oldCard.balance;
    oldCard.monthlyLimit = monthlyLimit ? monthlyLimit : oldCard.monthlyLimit;
    oldCard.loyaltyCardTierId = loyaltyCardTierId
      ? loyaltyCardTierId
      : oldCard.loyaltyCardTierId;

    oldCard.updatedAt = new Date(Date.now());
    return await this.cardRepository.update(oldCard);
  }
}
