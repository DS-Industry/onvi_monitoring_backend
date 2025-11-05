import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { Order } from '@loyalty/order/domain/order';
import { ContractType, OrderStatus, PlatformType } from '@loyalty/order/domain/enums';

@Injectable()
export class FindMethodsOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async getAllByFilter(data: {
    dateStart: Date;
    dateEnd: Date;
    platformType?: PlatformType;
    typeMobileUser?: ContractType;
    orderStatus?: OrderStatus;
    carWashDeviceId?: number;
    cardId?: number;
  }): Promise<Order[]> {
    return await this.orderRepository.findAllByFilter(
      data.dateStart,
      data.dateEnd,
      data.platformType,
      data.typeMobileUser,
      data.orderStatus,
      data.carWashDeviceId,
      data.cardId,
    );
  }
}
