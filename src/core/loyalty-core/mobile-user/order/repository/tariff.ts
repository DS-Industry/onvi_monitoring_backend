import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { ITariffRepository, Tariff } from '../interface/tariff';
import { LTYBenefitType } from '@prisma/client';

@Injectable()
export class TariffRepository extends ITariffRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findCardTariff(cardId: number): Promise<Tariff | null> {
    const card = await this.prisma.lTYCard.findUnique({
      where: { id: cardId },
      select: { cardTierId: true },
    });
    if (!card?.cardTierId) {
      return null;
    }

    console.log("card.cardTierId => ", card.cardTierId)

    const tierWithBenefits = await this.prisma.lTYCardTier.findUnique({
      where: { id: card.cardTierId },
      select: {
        benefits: {
          where: { benefitType: LTYBenefitType.CASHBACK },
          select: { bonus: true },
          orderBy: { bonus: 'desc' },
          take: 1,
        },
      },
    });

    const benefit = tierWithBenefits?.benefits?.[0];
    return benefit ? { bonus: benefit.bonus } : null;
  }
}


