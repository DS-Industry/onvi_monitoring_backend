import { Injectable, Inject } from '@nestjs/common';
import { ICardRepository } from '../domain/card.repository.interface';
import { IOrderRepository } from '../domain/order.repository.interface';
import { Order } from '../domain/order.entity';

@Injectable()
export class GetCardOrdersUseCase {
  constructor(
    @Inject('ICardRepository') private readonly cardRepository: ICardRepository,
    @Inject('IOrderRepository') private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(user: any, size: number = 10, page: number = 1): Promise<Order[]> {
    const card = await this.cardRepository.findFirstByClientId(user.clientId);

    if (!card) {
      return [];
    }

    return await this.orderRepository.findByCardId(card.id, size, page);
  }
}
