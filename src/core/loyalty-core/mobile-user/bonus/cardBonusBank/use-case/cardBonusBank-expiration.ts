import { Injectable } from '@nestjs/common';
import { FindMethodsCardBonusBankUseCase } from '@loyalty/mobile-user/bonus/cardBonusBank/use-case/cardBonusBank-find-methods';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { CreateCardBonusOperUseCase } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/use-case/cardBonusOper-create';
import { EXPIRATION_BONUSES_OPER_TYPE_ID } from '@constant/constants';

@Injectable()
export class ExpirationCardBonusBankUseCase {
  constructor(
    private readonly findMethodsCardBonusBankUseCase: FindMethodsCardBonusBankUseCase,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly createCardBonusOperUseCase: CreateCardBonusOperUseCase,
  ) {}

  async execute(): Promise<void> {
    const expiryDate = new Date();
    expiryDate.setUTCHours(0, 0, 0, 0);
    const cardBonusBanks =
      await this.findMethodsCardBonusBankUseCase.getAllByFilter({
        expiryAt: expiryDate,
      });
    const uniqueCardMobileUserIds = [
      ...new Set(cardBonusBanks.map((bank) => bank.cardMobileUserId)),
    ];
    for (const cardMobileUserId of uniqueCardMobileUserIds) {
      const card = await this.findMethodsCardUseCase.getById(cardMobileUserId);
      const fireproofBonus =
        await this.findMethodsCardBonusBankUseCase.getAllByFilter({
          cardId: cardMobileUserId,
          startExpiryAt: expiryDate,
        });
      const totalFireproofBonusSum = fireproofBonus.reduce(
        (sum, bonus) => sum + bonus.sum,
        0,
      );
      if (totalFireproofBonusSum < card.balance) {
        await this.createCardBonusOperUseCase.execute(
          {
            typeOperId: EXPIRATION_BONUSES_OPER_TYPE_ID,
            operDate: new Date(Date.now()),
            sum: card.balance - totalFireproofBonusSum,
          },
          card,
        );
      }
    }
  }
}
