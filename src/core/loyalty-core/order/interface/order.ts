import { Order } from '@loyalty/order/domain/order';
import { OrderStatus, PlatformType, ContractType } from "@prisma/client";

export abstract class IOrderRepository {
  abstract create(input: Order): Promise<Order>;
  abstract findOneById(id: number): Promise<Order>;
  abstract findAllByFilter(
    dateStart: Date,
    dateEnd: Date,
    platformType?: PlatformType,
    typeMobileUser?: ContractType,
    orderStatus?: OrderStatus,
    carWashDeviceId?: number,
    cardId?: number,
  ): Promise<Order[]>;
  abstract update(input: Order): Promise<Order>;
}
