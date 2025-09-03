import { LTYCard as PrismaCardMobileUser, Prisma } from '@prisma/client';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { LoyaltyCardInfoFullResponseDto } from '@loyalty/order/use-cases/dto/loyaltyCardInfoFull-response.dto';
type PrismaCardMobileUserWithRelations = Prisma.LTYCardGetPayload<{
  include: {
    client: true;
    cardTier: {
      include: {
        benefits: true;
        ltyProgram: {
          include: {
            organizations: true;
          };
        };
      };
    };
  };
}>;

export class PrismaCardMobileUserMapper {
  static toDomain(entity: PrismaCardMobileUser): Card {
    if (!entity) {
      return null;
    }
    return new Card({
      id: entity.id,
      balance: entity.balance,
      mobileUserId: entity.clientId,
      devNumber: entity.unqNumber,
      number: entity.number,
      monthlyLimit: entity.monthlyLimit,
      loyaltyCardTierId: entity.cardTierId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  static toPrisma(card: Card): Prisma.LTYCardUncheckedCreateInput {
    return {
      id: card?.id,
      balance: card.balance,
      clientId: card.mobileUserId,
      unqNumber: card.devNumber,
      number: card.number,
      monthlyLimit: card?.monthlyLimit,
      cardTierId: card?.loyaltyCardTierId,
      createdAt: card?.createdAt,
      updatedAt: card?.updatedAt,
    };
  }

  static toLoyaltyCardInfoFullDto(
    entity: PrismaCardMobileUserWithRelations,
  ): LoyaltyCardInfoFullResponseDto {
    if (!entity) {
      return null;
    }

    return {
      cardId: entity.id,
      balance: entity.balance,
      devNumber: entity.unqNumber,
      status: entity.client?.status,
      monthlyLimit: entity?.monthlyLimit,
      benefits:
        entity.cardTier?.benefits.map((b) => ({
          bonus: b.bonus,
          benefitType: b.benefitType,
        })) || [],
      loyaltyProgram: entity.cardTier?.ltyProgram
        ? {
            organizations:
              entity.cardTier.ltyProgram.organizations?.map((o) => ({
                id: o.id,
              })) || [],
          }
        : undefined,
    };
  }
}
