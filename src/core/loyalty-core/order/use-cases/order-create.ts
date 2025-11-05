import { Injectable } from '@nestjs/common';
import { CreateDto } from '@loyalty/order/use-cases/dto/create.dto';
import { Order } from '@loyalty/order/domain/order';
import {
  OrderHandlerStatus,
  ContractType,
} from '@loyalty/order/domain/enums';
import { IOrderRepository } from '@loyalty/order/interface/order';

@Injectable()
export class CreateOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(input: CreateDto): Promise<Order> {
    const order = new Order({
      transactionId: input.transactionId,
      sumFull: input.sumFull,
      sumReal: input.sumReal,
      sumBonus: input.sumBonus,
      sumDiscount: input.sumDiscount,
      sumCashback: input.sumCashback,
      carWashDeviceId: input.carWashDeviceId,
      platform: input.platform,
      orderData: input.orderData,
      createData: new Date(Date.now()),
      cardMobileUserId: input?.cardMobileUserId,
      typeMobileUser: input?.typeMobileUser ?? ContractType.INDIVIDUAL,
      orderStatus: input.orderStatus,
      sendAnswerStatus: input?.sendAnswerStatus,
      sendTime: input?.sendTime,
      debitingMoney: input?.debitingMoney,
      executionStatus: input?.executionStatus,
      reasonError: input?.reasonError,
      executionError: input?.executionError,
      orderHandlerStatus: OrderHandlerStatus.CREATED,
    });
    return await this.orderRepository.create(order);
  }
}
