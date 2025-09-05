import { Injectable } from '@nestjs/common';
import { ILoyaltyTierHistRepository } from '@loyalty/loyalty/loyaltyTierHist/interface/loyaltyTierHist';
import { LoyaltyTierHist } from '@loyalty/loyalty/loyaltyTierHist/domain/loyaltyTierHist';

@Injectable()
export class FindMethodsLoyaltyTierHistUseCase {
  constructor(
    private readonly loyaltyTierHistRepository: ILoyaltyTierHistRepository,
  ) {}

  async getOneById(id: number): Promise<LoyaltyTierHist> {
    return await this.loyaltyTierHistRepository.findOneById(id);
  }

  async getAllByFilter(data: {
    cardId?: number;
    transitionDateStart?: Date;
    transitionDateEnd?: Date;
    oldCardTierId?: number;
    newCardTierId?: number;
  }): Promise<LoyaltyTierHist[]> {
    return await this.loyaltyTierHistRepository.findAllByFilter(
      data.cardId,
      data.transitionDateStart,
      data.transitionDateEnd,
      data.oldCardTierId,
      data.newCardTierId,
    );
  }
}
