import { Injectable } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { CardUpdateDto } from '@loyalty/mobile-user/card/use-case/dto/card-update.dto';

@Injectable()
export class UpdateCardUseCase {
  constructor(private readonly cardRepository: ICardRepository) {}

  async execute(input: CardUpdateDto, oldCard: Card): Promise<Card> {
    const { 
      balance, 
      monthlyLimit, 
      loyaltyCardTierId, 
      mobileUserId,
      status,
    } = input;

    oldCard.balance = balance !== undefined ? balance : oldCard.balance;
    oldCard.monthlyLimit =
      monthlyLimit !== undefined ? monthlyLimit : oldCard.monthlyLimit;
    oldCard.loyaltyCardTierId =
      loyaltyCardTierId !== undefined
      ? loyaltyCardTierId 
      : oldCard.loyaltyCardTierId;
    oldCard.mobileUserId = mobileUserId !== undefined 
      ? mobileUserId 
      : oldCard.mobileUserId;

    if (status) {
      oldCard.status = status;
    }
    
    oldCard.updatedAt = new Date(Date.now());
    return await this.cardRepository.update(oldCard);
  }
}
