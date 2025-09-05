import { Injectable } from '@nestjs/common';
import { ILoyaltyTierHistRepository } from '@loyalty/loyalty/loyaltyTierHist/interface/loyaltyTierHist';
import { PrismaService } from '@db/prisma/prisma.service';
import { LoyaltyTierHist } from '@loyalty/loyalty/loyaltyTierHist/domain/loyaltyTierHist';
import { PrismaLoyaltyTierHistMapper } from '@db/mapper/prisma-loyalty-tier-hist-mapper';

@Injectable()
export class LoyaltyTierHistRepository extends ILoyaltyTierHistRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  public async create(input: LoyaltyTierHist): Promise<LoyaltyTierHist> {
    const loyaltyTierHistEntity = PrismaLoyaltyTierHistMapper.toPrisma(input);
    const loyaltyTierHist = await this.prisma.lTYCardTierHist.create({
      data: loyaltyTierHistEntity,
    });
    return PrismaLoyaltyTierHistMapper.toDomain(loyaltyTierHist);
  }

  public async createMany(
    input: LoyaltyTierHist[],
  ): Promise<LoyaltyTierHist[]> {
    const loyaltyTierHistEntities = input.map((item) =>
      PrismaLoyaltyTierHistMapper.toPrisma(item),
    );
    await this.prisma.lTYCardTierHist.createMany({
      data: loyaltyTierHistEntities,
    });
    return input;
  }

  public async findOneById(id: number): Promise<LoyaltyTierHist> {
    const loyaltyTierHist = await this.prisma.lTYCardTierHist.findFirst({
      where: {
        id,
      },
    });
    return PrismaLoyaltyTierHistMapper.toDomain(loyaltyTierHist);
  }

  public async findAllByFilter(
    cardId?: number,
    transitionDateStart?: Date,
    transitionDateEnd?: Date,
    oldCardTierId?: number,
    newCardTierId?: number,
  ): Promise<LoyaltyTierHist[]> {
    const where: any = {};

    if (cardId !== undefined) {
      where.cardId = cardId;
    }

    if (transitionDateStart !== undefined && transitionDateEnd !== undefined) {
      where.transitionDate = {
        gte: transitionDateStart,
        lte: transitionDateEnd,
      };
    }

    if (oldCardTierId !== undefined) {
      where.oldCardTierId = oldCardTierId;
    }

    if (newCardTierId !== undefined) {
      where.newCardTierId = newCardTierId;
    }

    const loyaltyTierHists = await this.prisma.lTYCardTierHist.findMany({
      where: where,
    });
    return loyaltyTierHists.map((item) =>
      PrismaLoyaltyTierHistMapper.toDomain(item),
    );
  }
}
