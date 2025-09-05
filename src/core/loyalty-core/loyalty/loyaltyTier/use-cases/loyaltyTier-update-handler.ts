import { Injectable } from '@nestjs/common';
import { FindMethodsLoyaltyTierUseCase } from '@loyalty/loyalty/loyaltyTier/use-cases/loyaltyTier-find-methods';
import { CreateLoyaltyTierHistUseCase } from '@loyalty/loyalty/loyaltyTierHist/use-case/loyaltyTierHist-create';
import { LoyaltyTierUpdateInfoResponseDto } from '@loyalty/loyalty/loyaltyTier/use-cases/dto/loyaltyTier-update-info-response.dto';
import { CreateDto } from '@loyalty/loyalty/loyaltyTierHist/use-case/dto/create.dto';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';

@Injectable()
export class UpdateHandlerLoyaltyTierUseCase {
  constructor(
    private readonly findMethodsLoyaltyTierUseCase: FindMethodsLoyaltyTierUseCase,
    private readonly createLoyaltyTierHistUseCase: CreateLoyaltyTierHistUseCase,
    private readonly cardRepository: ICardRepository,
  ) {}

  async execute(): Promise<any> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
    const updateData =
      await this.findMethodsLoyaltyTierUseCase.getCardsForTierUpdate(
        startOfMonth,
        endOfMonth,
      );

    for (const update of updateData) {
      await this.cardRepository.updateTier(update.cardId, update.nextTierId);
    }

    const historyRecords = this.prepareHistoryRecords(updateData, now);
    await this.createLoyaltyTierHistUseCase.executeMany(historyRecords);
  }

  private prepareHistoryRecords(
    cardsToUpdate: LoyaltyTierUpdateInfoResponseDto[],
    transitionDate: Date,
  ): CreateDto[] {
    return cardsToUpdate.map((item) => ({
      cardId: item.cardId,
      transitionDate: transitionDate,
      oldCardTierId: item.currentTierId,
      newCardTierId: item.nextTierId,
    }));
  }
}
