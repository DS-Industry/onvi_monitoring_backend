import { Injectable, Inject } from '@nestjs/common';
import { ICardRepository } from '../domain/card.repository.interface';
import { CardHistoryRepository } from '../repository/card-history.repository';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class GetCardFreeVacuumUseCase {
  constructor(
    @Inject('ICardRepository') private readonly cardRepository: ICardRepository,
    private readonly cardHistoryRepository: CardHistoryRepository,
  ) {}

  async execute(user: any): Promise<{ limit: number; remains: number }> {
    const card = await this.cardRepository.findFirstByClientIdWithCardTier(user.clientId);

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
      card.getUnqNumber(),
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
