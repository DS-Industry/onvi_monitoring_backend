import { CardBonusOper as PrismaCardBonusOper, Prisma } from '@prisma/client';
import { CardBonusOper } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/domain/cardBonusOper';

export class PrismaCardBonusOperMapper {
  static toDomain(entity: PrismaCardBonusOper): CardBonusOper {
    if (!entity) {
      return null;
    }
    return new CardBonusOper({
      id: entity.id,
      cardMobileUserId: entity.cardMobileUserId,
      carWashDeviceId: entity.carWashDeviceId,
      typeOperId: entity.typeOperId,
      operDate: entity.operDate,
      loadDate: entity.loadDate,
      sum: entity.sum,
      comment: entity.comment,
      creatorId: entity.creatorId,
      orderMobileUserId: entity.orderMobileUserId,
    });
  }

  static toPrisma(
    cardBonusOper: CardBonusOper,
  ): Prisma.CardBonusOperUncheckedCreateInput {
    return {
      id: cardBonusOper?.id,
      cardMobileUserId: cardBonusOper?.cardMobileUserId,
      carWashDeviceId: cardBonusOper?.carWashDeviceId,
      typeOperId: cardBonusOper.typeOperId,
      operDate: cardBonusOper.operDate,
      loadDate: cardBonusOper.loadDate,
      sum: cardBonusOper.sum,
      comment: cardBonusOper?.comment,
      creatorId: cardBonusOper?.creatorId,
      orderMobileUserId: cardBonusOper?.orderMobileUserId,
    };
  }
}
