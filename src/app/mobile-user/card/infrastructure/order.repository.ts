import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { IOrderRepository } from '../domain/order.repository.interface';
import { Order } from '../domain/order.entity';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByCardId(cardId: number, size: number = 10, page: number = 1): Promise<Order[]> {
    const skip = (page - 1) * size;
    
    const orders = await this.prisma.lTYOrder.findMany({
      where: { cardId },
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
