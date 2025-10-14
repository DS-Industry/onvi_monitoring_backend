import { Injectable, Inject } from '@nestjs/common';
import { ICardRepository } from '../domain/card.repository.interface';
import { CardHistoryRepository } from '../repository/card-history.repository';
import { CardHist } from '../domain/card-hist.entity';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class GetCardVacuumHistoryUseCase {
  constructor(
    @Inject('ICardRepository') private readonly cardRepository: ICardRepository,
    private readonly cardHistoryRepository: CardHistoryRepository,
  ) {}

  async execute(
    user: any,
    startDate?: Date,
    endDate?: Date,
    deviceType: string = 'VACUUM',
  ): Promise<CardHist[]> {
    const card = await this.cardRepository.findFirstByClientId(user.clientId);

    if (!card) {
      return [];
    }

    const defaultEndDate = endDate || new Date();
    const defaultStartDate = startDate || new Date();
    defaultStartDate.setDate(defaultEndDate.getDate() - 30);

    return await this.cardHistoryRepository.findByDeviceTypeAndDate(
      card.getUnqNumber(),
      defaultStartDate,
      defaultEndDate,
      deviceType,
      OrderStatus.COMPLETED,
    );
  }
}
