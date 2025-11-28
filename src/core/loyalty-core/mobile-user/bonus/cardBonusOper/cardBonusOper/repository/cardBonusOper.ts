import { Injectable } from '@nestjs/common';
import { ICardBonusOperRepository } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/interface/cardBonusOper';
import { PrismaService } from '@db/prisma/prisma.service';
import { CardBonusOper } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/domain/cardBonusOper';
import { PrismaCardBonusOperMapper } from '@db/mapper/prisma-card-bonus-oper-mapper';

@Injectable()
export class CardBonusOperRepository extends ICardBonusOperRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: CardBonusOper): Promise<CardBonusOper> {
    const cardBonusOperEntity = PrismaCardBonusOperMapper.toPrisma(input);
    const cardBonusOper = await this.prisma.lTYBonusOper.create({
      data: cardBonusOperEntity,
    });
    return PrismaCardBonusOperMapper.toDomain(cardBonusOper);
  }

  public async findOneById(id: number): Promise<CardBonusOper> {
    const cardBonusOper = await this.prisma.lTYBonusOper.findFirst({
      where: {
        id,
      },
    });
    return PrismaCardBonusOperMapper.toDomain(cardBonusOper);
  }

  public async findAllByFilter(
    dateStart: Date,
    dateEnd: Date,
    typeOperId: number | '*',
    cardId?: number,
    carWashDeviceId?: number,
    creatorId?: number,
  ): Promise<CardBonusOper[]> {
    const where: any = {};

    where.operDate = {
      gte: dateStart,
      lte: dateEnd,
    };

    if (typeOperId !== '*') {
      where.typeOperId = typeOperId;
    }

    if (cardId !== undefined) {
      where.carWashDeviceId = cardId;
    }

    if (carWashDeviceId !== undefined) {
      where.carWashDeviceId = carWashDeviceId;
    }

    if (creatorId !== undefined) {
      where.creatorId = creatorId;
    }

    const cardBonusOpers = await this.prisma.lTYBonusOper.findMany({
      where,
    });
    return cardBonusOpers.map((item) =>
      PrismaCardBonusOperMapper.toDomain(item),
    );
  }
}
