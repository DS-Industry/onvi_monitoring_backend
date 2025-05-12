import {
  CardBonusOperType as PrismaCardBonusOperType,
  Prisma,
} from '@prisma/client';
import { CardBonusOperType } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOperType/domain/cardBonusOperType';

export class PrismaCardBonusOperTypeMapper {
  static toDomain(entity: PrismaCardBonusOperType): CardBonusOperType {
    if (!entity) {
      return null;
    }
    return new CardBonusOperType({
      id: entity.id,
      name: entity.name,
      signOper: entity.signOper,
    });
  }

  static toPrisma(
    cardBonusOperType: CardBonusOperType,
  ): Prisma.CardBonusOperTypeUncheckedCreateInput {
    return {
      id: cardBonusOperType?.id,
      name: cardBonusOperType.name,
      signOper: cardBonusOperType.signOper,
    };
  }
}
