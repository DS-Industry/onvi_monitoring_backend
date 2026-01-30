import { Injectable } from '@nestjs/common';
import { Order } from '@loyalty/order/domain/order';
import {
  PlatformType,
  ContractType,
  OrderHandlerStatus,
} from '@loyalty/order/domain/enums';
import { DeviceType } from '@infra/pos/interface/pos.interface';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { ITariffRepository } from '@loyalty/mobile-user/order/interface/tariff';
import { CashbackCalculationService } from './cashback-calculation.service';
import { OrderStatusDeterminationService } from './order-status-determination.service';

export interface BuildOrderRequest {
  sum: number;
  carWashDeviceId: number;
  bayType?: DeviceType | null;
}

@Injectable()
export class OrderBuilderService {
  constructor(
    private readonly tariffRepository: ITariffRepository,
    private readonly cashbackCalculationService: CashbackCalculationService,
    private readonly orderStatusDeterminationService: OrderStatusDeterminationService,
  ) {}

  async buildOrder(
    request: BuildOrderRequest,
    card: Card,
  ): Promise<Order> {
    const tariff = await this.tariffRepository.findCardTariff(card.id);
    const bonusPercent = tariff?.bonus ?? 0;
    const computedCashback = this.cashbackCalculationService.calculateCashback({
      sum: request.sum,
      bonusPercent,
    });

    const initialOrderStatus =
      this.orderStatusDeterminationService.determineInitialStatus({
        sum: request.sum,
        bayType: request.bayType ?? null,
      });

    return new Order({
      sumFull: request.sum,
      sumReal: request.sum,
      sumBonus: 0,
      sumDiscount: 0,
      sumCashback: computedCashback,
      carWashDeviceId: request.carWashDeviceId,
      platform: PlatformType.ONVI,
      cardMobileUserId: card.id ?? null,
      clientId: card.mobileUserId ?? null,
      typeMobileUser: ContractType.INDIVIDUAL,
      orderData: new Date(),
      createData: new Date(),
      orderStatus: initialOrderStatus,
      orderHandlerStatus: OrderHandlerStatus.CREATED,
    });
  }
}
