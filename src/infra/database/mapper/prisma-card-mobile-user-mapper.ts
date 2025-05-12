import { CardMobileUser as PrismaCardMobileUser, Prisma } from '@prisma/client';
import { Card } from '@loyalty/mobile-user/card/domain/card';

export class PrismaCardMobileUserMapper {
  static toDomain(entity: PrismaCardMobileUser): Card {
    if (!entity) {
      return null;
    }
    return new Card({
      id: entity.id,
      balance: entity.balance,
      mobileUserId: entity.mobileUserId,
      devNumber: entity.devNumber,
      number: entity.number,
      monthlyLimit: entity.monthlyLimit,
      loyaltyCardTierId: entity.loyaltyCardTierId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPrisma(card: Card): Prisma.CardMobileUserUncheckedCreateInput {
    return {
      id: card?.id,
      balance: card.balance,
      mobileUserId: card.mobileUserId,
      devNumber: card.devNumber,
      number: card.number,
      monthlyLimit: card?.monthlyLimit,
      loyaltyCardTierId: card?.loyaltyCardTierId,
      createdAt: card?.createdAt,
      updatedAt: card?.updatedAt,
    };
  }
}
