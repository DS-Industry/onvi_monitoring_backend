import { Injectable } from '@nestjs/common';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { Client } from '@loyalty/mobile-user/client/domain/client';

import { DeviceType } from '@infra/pos/interface/pos.interface';

export interface FreeVacuumResponse {
  limit: number;
  remains: number;
}

@Injectable()
export class GetFreeVacuumUseCase {
  constructor(
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly orderRepository: IOrderRepository,
  ) {}

  async execute(user: Client): Promise<FreeVacuumResponse> {
    const clientId = user.id;

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
      DeviceType.VACUUME,
    );

    const freeOperations = orders.filter((order) => order.sumFull === 0);

    const remains = Math.max(0, limit - freeOperations.length);

    return {
      limit,
      remains,
    };
  }
}

