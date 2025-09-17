import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { Order } from '../domain/order.entity';

@Injectable()
export class GetCardOrdersUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(user: any, size: number = 10, page: number = 1): Promise<Order[]> {
    const skip = (page - 1) * size;
    
    const card = await this.prisma.lTYCard.findFirst({
      where: { clientId: user.clientId },
    });

    if (!card) {
      return [];
    }

    const orders = await this.prisma.lTYOrder.findMany({
      where: { cardId: card.id },
      include: {
        card: true,
        carWashDevice: true,
        bonusOpers: true
      },
      orderBy: { orderData: 'desc' },
      skip,
      take: size,
    });

    return orders.map(order => Order.fromPrisma(order));
  }
}
