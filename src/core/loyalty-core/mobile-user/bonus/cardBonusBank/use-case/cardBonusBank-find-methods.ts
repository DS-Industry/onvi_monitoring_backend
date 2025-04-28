import { Injectable } from '@nestjs/common';
import { CardBonusBank } from '@loyalty/mobile-user/bonus/cardBonusBank/domain/cardBonusBank';
import { ICardBonusBankRepository } from '@loyalty/mobile-user/bonus/cardBonusBank/interface/cardBonusBank';
import { CardBonusBankFindByFilterDto } from '@loyalty/mobile-user/bonus/cardBonusBank/use-case/dto/cardBonusBank-find-by-filter.dto';

@Injectable()
export class FindMethodsCardBonusBankUseCase {
  constructor(
    private readonly cardBonusBankRepository: ICardBonusBankRepository,
  ) {}

  async getById(id: number): Promise<CardBonusBank> {
    return await this.cardBonusBankRepository.findOneById(id);
  }

  async getAllByFilter(
    input: CardBonusBankFindByFilterDto,
  ): Promise<CardBonusBank[]> {
    return await this.cardBonusBankRepository.findAllByFilter(
      input.cardId,
      input.expiryAt,
      input.startAccrualAt,
      input.startExpiryAt,
    );
  }
}
