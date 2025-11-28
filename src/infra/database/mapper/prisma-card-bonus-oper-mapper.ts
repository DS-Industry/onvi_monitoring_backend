import { LTYBonusOper as PrismaCardBonusOper, Prisma } from '@prisma/client';
import { CardBonusOper } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/domain/cardBonusOper';

export class PrismaCardBonusOperMapper {
  static toDomain(entity: PrismaCardBonusOper): CardBonusOper {
    if (!entity) {
      return null;
    }
    return new CardBonusOper({
      id: entity.id,
      cardMobileUserId: entity.cardId,
      carWashDeviceId: entity.carWashDeviceId,
      typeOperId: entity.typeId,
      operDate: entity.operDate,
      loadDate: entity.loadDate,
      sum: entity.sum,
      comment: entity.comment,
      creatorId: entity.creatorId,
      orderMobileUserId: entity.orderId,
    });
  }

  static toPrisma(
    cardBonusOper: CardBonusOper,
  ): Prisma.LTYBonusOperUncheckedCreateInput {
    return {
      id: cardBonusOper?.id,
      cardId: cardBonusOper?.cardMobileUserId,
      carWashDeviceId: cardBonusOper?.carWashDeviceId,
      typeId: cardBonusOper.typeOperId,
      operDate: cardBonusOper.operDate,
      loadDate: cardBonusOper.loadDate,
      sum: cardBonusOper.sum,
      comment: cardBonusOper?.comment,
      creatorId: cardBonusOper?.creatorId,
      orderId: cardBonusOper?.orderMobileUserId,
    };
  }
}
