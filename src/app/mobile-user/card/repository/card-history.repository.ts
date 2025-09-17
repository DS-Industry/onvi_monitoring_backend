import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { CardHist } from '../domain/card-hist.entity';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class CardHistoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByDeviceTypeAndDate(
    unqNumber: string,
    startDate: Date,
    endDate: Date,
    deviceType: string,
    orderStatus: OrderStatus,
  ): Promise<CardHist[]> {
    const orders = await this.prisma.lTYOrder.findMany({
      where: {
        card: {
          unqNumber: unqNumber,
        },
        carWashDevice: {
          carWashDeviceType: {
            name: deviceType,
          },
        },
        orderStatus: orderStatus,
        orderData: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        card: {
          include: {
            client: true,
          },
        },
        carWashDevice: {
          include: {
            carWashDeviceType: true,
            carWasPos: true,
          },
        },
      },
      orderBy: {
        orderData: 'desc',
      },
    });

    return orders.map(CardHist.fromLTYOrder);
  }
}
