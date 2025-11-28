import { Injectable, NotFoundException } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';

export interface GetMobileOrderByTransactionIdRequest {
  transactionId: string;
  clientId: number;
}

@Injectable()
export class GetMobileOrderByTransactionIdUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(request: GetMobileOrderByTransactionIdRequest) {
    const order = await this.orderRepository.findOneByTransactionId(
      request.transactionId,
    );

    if (!order) {
      throw new NotFoundException(
        `Order with transaction ID ${request.transactionId} not found`,
      );
    }

    if (order.cardMobileUserId) {
      const card = await this.findMethodsCardUseCase.getById(
        order.cardMobileUserId,
      );
      if (!card || card.mobileUserId !== request.clientId) {
        throw new NotFoundException(
          `Order with transaction ID ${request.transactionId} not found`,
        );
      }
    } else if (request.clientId) {
      throw new NotFoundException(
        `Order with transaction ID ${request.transactionId} not found`,
      );
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
