import { Injectable } from '@nestjs/common';
import { ILoyaltyTierHistRepository } from '@loyalty/loyalty/loyaltyTierHist/interface/loyaltyTierHist';
import { LoyaltyTierHist } from '@loyalty/loyalty/loyaltyTierHist/domain/loyaltyTierHist';
import { CreateDto } from '@loyalty/loyalty/loyaltyTierHist/use-case/dto/create.dto';

@Injectable()
export class CreateLoyaltyTierHistUseCase {
  constructor(
    private readonly loyaltyTierHistRepository: ILoyaltyTierHistRepository,
  ) {}

  async execute(data: CreateDto): Promise<LoyaltyTierHist> {
    const loyaltyTierHist = new LoyaltyTierHist({
      cardId: data.cardId,
      transitionDate: data.transitionDate,
      oldCardTierId: data.oldCardTierId,
      newCardTierId: data.newCardTierId,
    });

    return await this.loyaltyTierHistRepository.create(loyaltyTierHist);
  }

  async executeMany(data: CreateDto[]): Promise<void> {
    const loyaltyTierHists = data.map(
      (item) =>
        new LoyaltyTierHist({
          cardId: item.cardId,
          transitionDate: item.transitionDate,
          oldCardTierId: item.oldCardTierId,
          newCardTierId: item.newCardTierId,
        }),
    );

    await this.loyaltyTierHistRepository.createMany(loyaltyTierHists);
  }
}
