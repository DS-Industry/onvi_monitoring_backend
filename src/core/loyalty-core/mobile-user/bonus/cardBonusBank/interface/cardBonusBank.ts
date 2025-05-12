import { CardBonusBank } from "@loyalty/mobile-user/bonus/cardBonusBank/domain/cardBonusBank";

export abstract class ICardBonusBankRepository {
  abstract create(input: CardBonusBank): Promise<CardBonusBank>;
  abstract findOneById(id: number): Promise<CardBonusBank>;
  abstract findAllByFilter(
    cardId?: number,
    expiryAt?: Date,
    startAccrualAt?: Date,
    startExpiryAt?: Date,
  ): Promise<CardBonusBank[]>;
}
