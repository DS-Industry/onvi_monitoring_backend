import { Provider } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { OrderRepository } from '@loyalty/order/repository/order';

export const OrderProvider: Provider = {
  provide: IOrderRepository,
  useClass: OrderRepository,
};
