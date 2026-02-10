import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';

@Injectable()
export class DeleteOrderUseCase {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }
}
