import { Injectable } from '@nestjs/common';
import { CardBonusBank } from '@loyalty/mobile-user/bonus/cardBonusBank/domain/cardBonusBank';
import { CardBonusBankCreateDto } from '@loyalty/mobile-user/bonus/cardBonusBank/use-case/dto/cardBonusBank-create.dto';
import { ICardBonusBankRepository } from '@loyalty/mobile-user/bonus/cardBonusBank/interface/cardBonusBank';

@Injectable()
export class CreateCardBonusBankUseCase {
  constructor(
    private readonly cardBonusBankRepository: ICardBonusBankRepository,
  ) {}

  async execute(input: CardBonusBankCreateDto): Promise<CardBonusBank> {
    const cardBonusOper = new CardBonusBank({
      cardMobileUserId: input.cardMobileUserId,
      sum: input.sum,
      accrualAt: new Date(Date.now()),
      expiryAt: input.expiryAt,
    });
    return await this.cardBonusBankRepository.create(cardBonusOper);
  }
}
