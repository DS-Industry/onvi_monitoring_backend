import { Injectable } from '@nestjs/common';
import { ICardBonusOperRepository } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/interface/cardBonusOper';
import { CreateDto } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/use-case/dto/create.dto';
import { CardBonusOper } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/domain/cardBonusOper';
import { FindMethodsCardBonusOperTypeUseCase } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOperType/use-case/cardBonusOperType-find-methods';
import { CreateCardBonusBankUseCase } from '@loyalty/mobile-user/bonus/cardBonusBank/use-case/cardBonusBank-create';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { SignOperType } from '@prisma/client';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { FindMethodsLoyaltyProgramUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyaltyProgram-find-methods';

@Injectable()
export class CreateCardBonusOperUseCase {
  constructor(
    private readonly cardBonusOperRepository: ICardBonusOperRepository,
    private readonly findMethodsCardBonusOperTypeUseCase: FindMethodsCardBonusOperTypeUseCase,
    private readonly cardRepository: ICardRepository,
    private readonly createCardBonusBankUseCase: CreateCardBonusBankUseCase,
    private readonly findMethodsLoyaltyProgramUseCase: FindMethodsLoyaltyProgramUseCase,
  ) {}

  async execute(input: CreateDto, card: Card): Promise<CardBonusOper> {
    const operType = await this.findMethodsCardBonusOperTypeUseCase.getById(
      input.typeOperId,
    );
    if (operType.signOper == SignOperType.DEDUCTION) {
      card.adjustSum(-input.sum);
    } else {
      card.adjustSum(input.sum);
    }
    await this.cardRepository.update(card);
    if (
      card.loyaltyCardTierId &&
      operType.signOper == SignOperType.REPLENISHMENT
    ) {
      const loyaltyProgram =
        await this.findMethodsLoyaltyProgramUseCase.getOneByLoyaltyCardTierId(
          card.loyaltyCardTierId,
        );
      const expiryDate = loyaltyProgram.getCalculatedExpiryDate();
      await this.handleBonusCreation(card.id, input.sum, expiryDate);
    }
    const cardBonusOper = new CardBonusOper({
      cardMobileUserId: card.id,
      carWashDeviceId: input?.carWashDeviceId,
      typeOperId: input.typeOperId,
      operDate: input.operDate,
      loadDate: new Date(Date.now()),
      sum: input.sum,
      comment: input?.comment,
      creatorId: input?.creatorId,
      orderMobileUserId: input?.orderMobileUserId,
    });
    return await this.cardBonusOperRepository.create(cardBonusOper);
  }

  private async handleBonusCreation(
    cardId: number,
    sum: number,
    expiryDate: Date,
  ): Promise<void> {
    const finalExpiryDate = new Date(expiryDate);
    finalExpiryDate.setUTCHours(23, 59, 59, 999);

    await this.createCardBonusBankUseCase.execute({
      cardMobileUserId: cardId,
      sum: sum,
      expiryAt: finalExpiryDate,
    });
  }
}
