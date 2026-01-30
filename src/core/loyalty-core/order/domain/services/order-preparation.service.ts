import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ICardRepository } from '@loyalty/mobile-user/card/interface/card';
import { OrderBuilderService } from './order-builder.service';
import { OrderDiscountService, DiscountResult } from './order-discount.service';
import { OrderCalculationService, OrderTotals } from './order-calculation.service';
import { Order } from '@loyalty/order/domain/order';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { DeviceType } from '@infra/pos/interface/pos.interface';

export interface OrderPreparationRequest {
  clientId: number;
  sum: number;
  carWashId: number;
  carWashDeviceId: number;
  bayType?: DeviceType | null;
  promoCodeId?: number | null;
  rewardPointsUsed?: number;
}

export interface PreparedOrderData {
  card: Card;
  order: Order;
  discountResult: DiscountResult;
  totals: OrderTotals;
}

@Injectable()
export class OrderPreparationService {
  private readonly logger = new Logger(OrderPreparationService.name);

  constructor(
    private readonly cardRepository: ICardRepository,
    private readonly orderBuilderService: OrderBuilderService,
    private readonly orderDiscountService: OrderDiscountService,
    private readonly orderCalculationService: OrderCalculationService,
  ) {}

  async prepareOrderWithTotals(
    request: OrderPreparationRequest,
  ): Promise<PreparedOrderData> {
    this.logger.debug(
      `Preparing order calculation for user ${request.clientId}`,
    );

    const card = await this.cardRepository.findOneByClientId(
      request.clientId,
    );

    if (!card) {
      throw new NotFoundException(
        `Card with client ID ${request.clientId} not found`,
      );
    }

    const order = await this.orderBuilderService.buildOrder(
      {
        sum: request.sum,
        carWashDeviceId: request.carWashDeviceId,
        bayType: request.bayType ?? null,
      },
      card,
    );

    const orderDate = new Date();
    const discountResult = await this.orderDiscountService.calculateDiscounts(
      {
        clientId: request.clientId,
        carWashId: request.carWashId,
        sum: request.sum,
        orderDate,
        rewardPointsUsed: request.rewardPointsUsed || 0,
        promoCodeId: request.promoCodeId || null,
        bayType: request.bayType ?? null,
      },
      order,
      card,
    );

    const totals = this.orderCalculationService.calculateOrderTotals(
      order.sumFull,
      discountResult,
      request.rewardPointsUsed || 0,
      order.sumCashback,
    );

    this.logger.debug(
      `Order preparation completed - sumFull: ${order.sumFull}, sumDiscount: ${totals.sumDiscount}, sumReal: ${totals.sumReal}`,
    );

    return {
      card,
      order,
      discountResult,
      totals,
    };
  }
}
