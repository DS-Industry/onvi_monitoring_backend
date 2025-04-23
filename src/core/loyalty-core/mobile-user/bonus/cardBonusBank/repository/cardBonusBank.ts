import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { PrismaCardBonusBankMapper } from '@db/mapper/prisma-card-bonus-bank-mapper';
import { CardBonusBank } from '@loyalty/mobile-user/bonus/cardBonusBank/domain/cardBonusBank';
import { ICardBonusBankRepository } from '@loyalty/mobile-user/bonus/cardBonusBank/interface/cardBonusBank';

@Injectable()
export class CardBonusBankRepository extends ICardBonusBankRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: CardBonusBank): Promise<CardBonusBank> {
    const cardBonusBankEntity = PrismaCardBonusBankMapper.toPrisma(input);
    const cardBonusBank = await this.prisma.cardBonusBank.create({
      data: cardBonusBankEntity,
    });
    return PrismaCardBonusBankMapper.toDomain(cardBonusBank);
  }

  public async findOneById(id: number): Promise<CardBonusBank> {
    const cardBonusBank = await this.prisma.cardBonusBank.findFirst({
      where: {
        id,
      },
    });
    return PrismaCardBonusBankMapper.toDomain(cardBonusBank);
  }

  public async findAllByFilter(
    cardId?: number,
    expiryAt?: Date,
    startsAccrualAt?: Date,
    startExpiryAt?: Date,
  ): Promise<CardBonusBank[]> {
    const where: any = {};

    if (cardId !== undefined) {
      where.cardMobileUserId = cardId;
    }

    if (startsAccrualAt !== undefined) {
      where.accrualAt = { gte: startsAccrualAt };
    }

    if (startExpiryAt !== undefined) {
      where.expiryAt = { gt: startExpiryAt };
    }

    if (expiryAt !== undefined) {
      where.expiryAt = expiryAt;
    }

    const cardBonusBanks = await this.prisma.cardBonusBank.findMany({
      where,
    });
    return cardBonusBanks.map((item) =>
      PrismaCardBonusBankMapper.toDomain(item),
    );
  }
}
