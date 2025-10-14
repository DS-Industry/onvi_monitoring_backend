import { Order } from './order.entity';

export interface IOrderRepository {
  findByCardId(cardId: number, size?: number, page?: number): Promise<Order[]>;
}
