import { Order } from '@loyalty/order/domain/order';
import {
  OrderStatus,
  PlatformType,
  ContractType,
} from '@loyalty/order/domain/enums';

export interface OrderUsageData {
  transactionalCampaign?: {
    campaignId: number;
    actionId: number;
    ltyUserId: number;
    posId: number;
  };
  promoCode?: {
    promoCodeId: number;
    ltyUserId: number;
    posId: number;
  };
}

export abstract class IOrderRepository {
  abstract create(input: Order): Promise<Order>;
  abstract createWithUsage(
    input: Order,
    usageData?: OrderUsageData,
  ): Promise<Order>;
  abstract findOneById(id: number): Promise<Order>;
  abstract findOneByTransactionId(transactionId: string): Promise<Order>;
  abstract findAllByFilter(
    dateStart: Date,
    dateEnd: Date,
    platformType?: PlatformType,
    typeMobileUser?: ContractType,
    orderStatus?: OrderStatus,
    carWashDeviceId?: number,
    cardId?: number,
    deviceTypeCode?: string,
  ): Promise<Order[]>;
  abstract sumOrdersByFilter(
    dateStart: Date,
    dateEnd: Date,
    cardId: number,
    orderStatus: OrderStatus,
  ): Promise<number>;
  abstract update(input: Order): Promise<Order>;
  abstract updateStatusIf(
    id: number,
    fromStatus: OrderStatus,
    toStatus: OrderStatus,
  ): Promise<Order | null>;
  abstract updateStatusTo(
    id: number,
    newStatus: OrderStatus,
  ): Promise<Order | null>;
}
