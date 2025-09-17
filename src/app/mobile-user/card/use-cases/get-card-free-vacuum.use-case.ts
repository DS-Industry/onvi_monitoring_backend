import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { CardHistoryRepository } from '../repository/card-history.repository';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class GetCardFreeVacuumUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cardHistoryRepository: CardHistoryRepository,
  ) {}

  async execute(user: any): Promise<{ limit: number; remains: number }> {
    const card = await this.prisma.lTYCard.findFirst({
      where: { clientId: user.clientId },
      include: {
        cardTier: true,
      },
    });

    if (!card) {
      return { limit: 0, remains: 0 };
    }

    const vacuumFreeLimit = card.cardTier?.limitBenefit || 0;

    if (!vacuumFreeLimit) {
      return { limit: 0, remains: 0 };
    }

    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);
    const tomorrowUTC = new Date(todayUTC);
    tomorrowUTC.setUTCDate(todayUTC.getUTCDate() + 1);

    const orderVacuum = await this.cardHistoryRepository.findByDeviceTypeAndDate(
      card.unqNumber,
      todayUTC,
      tomorrowUTC,
      'VACUUM',
      OrderStatus.COMPLETED,
    );

    const freeOperations = orderVacuum.filter(order => order.operSum === 0);
    const remains = Math.max(0, vacuumFreeLimit - freeOperations.length);

    return {
      limit: vacuumFreeLimit,
      remains: remains,
    };
  }
}
