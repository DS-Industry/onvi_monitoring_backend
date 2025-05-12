import { CardBonusBank as PrismaCardBonusBank, Prisma } from '@prisma/client';
import { CardBonusBank } from '@loyalty/mobile-user/bonus/cardBonusBank/domain/cardBonusBank';

export class PrismaCardBonusBankMapper {
  static toDomain(entity: PrismaCardBonusBank): CardBonusBank {
    if (!entity) {
      return null;
    }
    return new CardBonusBank({
      id: entity.id,
      cardMobileUserId: entity.cardMobileUserId,
      sum: entity.sum,
      accrualAt: entity.accrualAt,
      expiryAt: entity.expiryAt,
    });
  }

  static toPrisma(
    cardBonusBank: CardBonusBank,
  ): Prisma.CardBonusBankUncheckedCreateInput {
    return {
      id: cardBonusBank?.id,
      cardMobileUserId: cardBonusBank.cardMobileUserId,
      sum: cardBonusBank.sum,
      accrualAt: cardBonusBank.accrualAt,
      expiryAt: cardBonusBank.expiryAt,
    };
  }
}
