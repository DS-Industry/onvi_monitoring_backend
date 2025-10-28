import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { Order } from '@loyalty/order/domain/order';

@Injectable()
export class GetCardTransactionsHistoryUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(user: any, size: number, page: number): Promise<any> {
    const clientId = user.props.id;
    
    const card = await this.findMethodsCardUseCase.getByClientId(clientId);

    console.log("card => ", card)
    console.log("clientId => ", clientId)
    console.log("size => ", size)
    console.log("page => ", page)

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
      undefined,
    );

    const filteredOrders = orders.filter(order => order.cardMobileUserId === card.id);

    filteredOrders.sort((a, b) => 
      new Date(b.orderData).getTime() - new Date(a.orderData).getTime()
    );

    const total = filteredOrders.length;
    const totalPages = Math.ceil(total / size);
    const skip = (page - 1) * size;
    const paginatedOrders = filteredOrders.slice(skip, skip + size);

    return {
      data: paginatedOrders.map(order => ({
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

