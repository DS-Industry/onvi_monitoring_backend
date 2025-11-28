import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { DeviceType } from '@infra/pos/interface/pos.interface';
import { InsufficientFreeVacuumException } from '../exceptions';

export interface ValidateFreeVacuumRequest {
  card: Card;
  orderDate: Date;
}

@Injectable()
export class FreeVacuumValidationService {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async validateFreeVacuumAccess(
    request: ValidateFreeVacuumRequest,
  ): Promise<void> {
    const { card, orderDate } = request;

    const { startDate, endDate } = this.getDateRange(orderDate);

    const orders = await this.orderRepository.findAllByFilter(
      startDate,
      endDate,
      undefined,
      undefined,
      OrderStatus.COMPLETED,
      undefined,
      card.id,
      DeviceType.VACUUME,
    );

    const freeOperations = orders.filter((order) => order.sumFull === 0);
    const limit = card.monthlyLimit || 0;
    const used = freeOperations.length;
    const remains = Math.max(0, limit - used);

    if (remains <= 0) {
      throw new InsufficientFreeVacuumException(used, limit);
    }
  }

  private getDateRange(date: Date): { startDate: Date; endDate: Date } {
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);

    return { startDate, endDate };
  }
}
