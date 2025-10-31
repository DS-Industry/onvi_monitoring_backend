import { Injectable } from '@nestjs/common';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { OrderStatus } from '@loyalty/order/domain/enums';

@Injectable()
export class GetFreeVacuumUseCase {
  constructor(
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(user: any): Promise<{ limit: number; remains: number }> {
    const clientId = user.props.id;
    
    const card = await this.findMethodsCardUseCase.getByClientId(clientId);
    
    if (!card) {
      return {
        limit: 0,
        remains: 0,
      };
    }

    const limit = card.monthlyLimit || 0;

    if (!limit) {
      return {
        limit: 0,
        remains: 0,
      };
    }

    console.log("limit => ", limit)
    console.log("card.id => ", card.id)
    console.log("card.monthlyLimit => ", card.monthlyLimit)
    console.log("card.balance => ", card.balance)
    console.log("card.devNumber => ", card.devNumber)
    console.log("card.number => ", card.number)
    console.log("card.mobileUserId => ", card.mobileUserId)
    console.log("card.createdAt => ", card.createdAt)
    console.log("card.updatedAt => ", card.updatedAt)


    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);
    const tomorrowUTC = new Date(todayUTC);
    tomorrowUTC.setUTCDate(todayUTC.getUTCDate() + 1);

    const orders = await this.orderRepository.findAllByFilter(
      todayUTC,
      tomorrowUTC,
      undefined,
      undefined, 
      OrderStatus.COMPLETED,
      undefined, 
      card.id, 
    );

    const freeOperations = orders.filter(order => order.sumFull === 0);
    
    const remains = Math.max(0, limit - freeOperations.length);

    return {
      limit,
      remains,
    };
  }
}

