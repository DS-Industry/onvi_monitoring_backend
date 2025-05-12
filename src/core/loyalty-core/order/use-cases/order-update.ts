import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { UpdateDto } from '@loyalty/order/use-cases/dto/update.dto';
import { Order } from '@loyalty/order/domain/order';

@Injectable()
export class UpdateOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: UpdateDto, oldOrder: Order): Promise<Order> {
    const {
      orderStatus,
      sendAnswerStatus,
      sendTime,
      executionStatus,
      reasonError,
      executionError,
      orderHandlerStatus,
      handlerError,
    } = input;

    oldOrder.orderStatus = orderStatus ? orderStatus : oldOrder.orderStatus;
    oldOrder.sendAnswerStatus = sendAnswerStatus
      ? sendAnswerStatus
      : oldOrder.sendAnswerStatus;
    oldOrder.sendTime = sendTime ? sendTime : oldOrder.sendTime;
    oldOrder.executionStatus = executionStatus
      ? executionStatus
      : oldOrder.executionStatus;
    oldOrder.reasonError = reasonError ? reasonError : oldOrder.reasonError;
    oldOrder.executionError = executionError
      ? executionError
      : oldOrder.executionError;
    oldOrder.orderHandlerStatus = orderHandlerStatus
      ? orderHandlerStatus
      : oldOrder.orderHandlerStatus;
    oldOrder.handlerError = handlerError ? handlerError : oldOrder.handlerError;

    return await this.orderRepository.update(oldOrder);
  }
}
