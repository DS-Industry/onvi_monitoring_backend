import { CardBonusOperType } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOperType/domain/cardBonusOperType';

export abstract class ICardBonusOperTypeRepository {
  abstract create(input: CardBonusOperType): Promise<CardBonusOperType>;
  abstract findOneById(id: number): Promise<CardBonusOperType>;
  abstract findAll(): Promise<CardBonusOperType[]>;
}
