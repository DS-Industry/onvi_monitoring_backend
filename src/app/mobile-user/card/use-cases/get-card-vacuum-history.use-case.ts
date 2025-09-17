import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { CardHistoryRepository } from '../repository/card-history.repository';
import { CardHist } from '../domain/card-hist.entity';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class GetCardVacuumHistoryUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cardHistoryRepository: CardHistoryRepository,
  ) {}

  async execute(
    user: any,
    startDate?: Date,
    endDate?: Date,
    deviceType: string = 'VACUUM',
  ): Promise<CardHist[]> {
    const card = await this.prisma.lTYCard.findFirst({
      where: { clientId: user.clientId },
    });

    if (!card) {
      return [];
    }

    const defaultEndDate = endDate || new Date();
    const defaultStartDate = startDate || new Date();
    defaultStartDate.setDate(defaultEndDate.getDate() - 30);

    return await this.cardHistoryRepository.findByDeviceTypeAndDate(
      card.unqNumber,
      defaultStartDate,
      defaultEndDate,
      deviceType,
      OrderStatus.COMPLETED,
    );
  }
}
