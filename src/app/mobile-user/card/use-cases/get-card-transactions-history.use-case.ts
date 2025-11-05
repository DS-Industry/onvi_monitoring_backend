import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { Client } from '@loyalty/mobile-user/client/domain/client';
import { OrderStatus } from '@loyalty/order/domain/enums';

export interface TransactionHistoryItem {
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
}

export interface TransactionsHistoryResponse {
  data: TransactionHistoryItem[];
  meta: {
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}

@Injectable()
export class GetCardTransactionsHistoryUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(
    user: Client,
    size: number,
    page: number,
  ): Promise<TransactionsHistoryResponse> {
    const clientId = user.id;

    const card = await this.findMethodsCardUseCase.getByClientId(clientId);

    if (!card) {
      return {
        data: [],
        meta: {
          total: 0,
          page,
          size,
          totalPages: 0,
        },
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

    const total = orders.length;
    const totalPages = Math.ceil(total / size);
    const skip = (page - 1) * size;
    const paginatedOrders = orders.slice(skip, skip + size);

    return {
      data: paginatedOrders.map((order) => ({
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
      })),
      meta: {
        total,
        page,
        size,
        totalPages,
      },
    };
  }
}

