import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { OrderStatus } from '@prisma/client';

export interface UpdateMobileOrderRequest {
  orderId: number;
  clientId: number;
  status?: OrderStatus;
}

@Injectable()
export class UpdateMobileOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(request: UpdateMobileOrderRequest) {
    const order = await this.orderRepository.findOneById(request.orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${request.orderId} not found`);
    }

    if (order.cardMobileUserId !== request.clientId) {
      throw new NotFoundException(`Order with ID ${request.orderId} not found`);
    }

    if (request.status) {
      order.orderStatus = request.status;
      await this.orderRepository.update(order);
    }

    return {
      id: order.id,
      status: order.orderStatus,
      transactionId: order.transactionId,
    };
  }
}

