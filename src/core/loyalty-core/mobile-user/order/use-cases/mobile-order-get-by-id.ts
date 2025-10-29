import { Injectable, NotFoundException } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';

export interface GetMobileOrderRequest {
  orderId: number;
  clientId: number;
}

@Injectable()
export class GetMobileOrderByIdUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(request: GetMobileOrderRequest) {
    const order = await this.orderRepository.findOneById(request.orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${request.orderId} not found`);
    }

    if (order.cardMobileUserId !== request.clientId) {
      throw new NotFoundException(`Order with ID ${request.orderId} not found`);
    }

    return {
      id: order.id,
      status: order.orderStatus,
      transactionId: order.transactionId,
      carWashDeviceId: order.carWashDeviceId,
      sum: order.sumReal,
      cashback: order.sumCashback,
      createdAt: order.createData,
    };
  }
}

