import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';

@Injectable()
export class GetCardFreeVacuumUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(user: any): Promise<{ limit: number; remains: number }> {
    // Get user's card first
    const card = await this.prisma.lTYCard.findFirst({
      where: { clientId: user.clientId },
    });

    if (!card) {
      return { limit: 0, remains: 0 };
    }

    // For now, we'll return default values since vacuum functionality
    // might need to be implemented based on specific business requirements
    // The original code checked for vacuumFreeLimit which doesn't exist in LTYCard
    const vacuumFreeLimit = 0; // This would need to be determined based on business logic

    if (!vacuumFreeLimit) {
      return { limit: 0, remains: 0 };
    }

    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);
    const tomorrowUTC = new Date(todayUTC);
    tomorrowUTC.setUTCDate(todayUTC.getUTCDate() + 1);

    // Count vacuum orders for today
    const vacuumOrders = await this.prisma.lTYOrder.count({
      where: {
        cardId: card.id,
        orderData: {
          gte: todayUTC,
          lt: tomorrowUTC,
        },
        // Note: We would need to add device type filtering here
        // The original code filtered by DeviceType.VACUUME and OrderStatus.COMPLETED
        // This would require additional business logic to identify vacuum orders
      },
    });

    const remains = Math.max(0, vacuumFreeLimit - vacuumOrders);

    return {
      limit: vacuumFreeLimit,
      remains: remains,
    };
  }
}
