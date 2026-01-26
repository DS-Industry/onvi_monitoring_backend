import { CardBonusOper } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/domain/cardBonusOper';

export abstract class ICardBonusOperRepository {
  abstract create(input: CardBonusOper): Promise<CardBonusOper>;
  abstract findOneById(id: number): Promise<CardBonusOper>;
  abstract findAllByFilter(
    dateStart: Date,
    dateEnd: Date,
    typeOperId: number | '*',
    cardId?: number,
    carWashDeviceId?: number,
    creatorId?: number,
  ): Promise<CardBonusOper[]>;
  abstract findOneByOrderIdAndType(
    orderId: number,
    typeOperId: number,
  ): Promise<CardBonusOper | null>;
}
