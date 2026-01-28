import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { Order } from '@loyalty/order/domain/order';

export interface LatestCarwashItem {
  id: number;
  transactionId: string;
  sumFull: number;
  sumReal: number;
  sumBonus: number;
  sumDiscount: number;
  sumCashback: number;
  orderData: Date;
  orderStatus: OrderStatus;
  platform: string;
  carWashDeviceId: number;
  carWashId?: number;
  posName: string | null;
  posAddress: string | null;
}

export interface LatestCarwashesResponse {
  data: LatestCarwashItem[];
}

@Injectable()
export class GetLatestCarwashesUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(user: Client, limit: number = 3): Promise<LatestCarwashesResponse> {
    const clientId = user.id;

    const card = await this.findMethodsCardUseCase.getByClientId(clientId);

    if (!card) {
      return {
        data: [],
      };
    }

    const dateEnd = new Date();
    const dateStart = new Date();
    dateStart.setMonth(dateStart.getMonth() - 12);

    const orders = await this.orderRepository.findAllByFilter(
      dateStart,
      dateEnd,
      undefined,
      undefined,
      undefined,
      undefined,
      card.id,
      undefined,
    );

    orders.sort(
      (a, b) =>
        new Date(b.orderData).getTime() - new Date(a.orderData).getTime(),
    );

    const seenCarWashIds = new Set<number>();
    const uniqueCarwashOrders: Order[] = [];

    for (const order of orders) {
      const carWashId = order.carWashId;
      
      if (carWashId === undefined || seenCarWashIds.has(carWashId)) {
        continue;
      }

      seenCarWashIds.add(carWashId);
      uniqueCarwashOrders.push(order);

      if (uniqueCarwashOrders.length >= limit) {
        break;
      }
    }

    return {
      data: uniqueCarwashOrders.map((order) => ({
        id: order.id,
        transactionId: order.transactionId,
        sumFull: order.sumFull,
        sumReal: order.sumReal,
        sumBonus: order.sumBonus,
        sumDiscount: order.sumDiscount,
        sumCashback: order.sumCashback,
        orderData: order.orderData,
        orderStatus: order.orderStatus,
        platform: order.platform,
        carWashDeviceId: order.carWashDeviceId,
        carWashId: order.carWashId,
        posName: order.posName || null,
        posAddress: order.posAddress || null,
      })),
    };
  }
}
