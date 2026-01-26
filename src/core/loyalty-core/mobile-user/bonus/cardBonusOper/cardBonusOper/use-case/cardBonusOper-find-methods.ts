import { Injectable } from '@nestjs/common';
import { ICardBonusOperRepository } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/interface/cardBonusOper';
import { CardBonusOper } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/domain/cardBonusOper';

@Injectable()
export class FindMethodsCardBonusOperUseCase {
  constructor(
    private readonly cardBonusOperRepository: ICardBonusOperRepository,
  ) {}

  async getById(id: number): Promise<CardBonusOper> {
    return await this.cardBonusOperRepository.findOneById(id);
  }

  async getAllByFilter(
    dateStart: Date,
    dateEnd: Date,
    typeOperId: number | '*',
    cardId?: number,
    carWashDeviceId?: number,
    creatorId?: number,
  ): Promise<CardBonusOper[]> {
    return await this.cardBonusOperRepository.findAllByFilter(
      dateStart,
      dateEnd,
      typeOperId,
      cardId,
      carWashDeviceId,
      creatorId,
    );
  }

  async getByOrderIdAndType(
    orderId: number,
    typeOperId: number,
  ): Promise<CardBonusOper | null> {
    return await this.cardBonusOperRepository.findOneByOrderIdAndType(
      orderId,
      typeOperId,
    );
  }
}
