import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { OrderBuilderService } from '@loyalty/order/domain/services/order-builder.service';
import { OrderDiscountService } from '@loyalty/order/domain/services/order-discount.service';
import { DeviceType } from '@infra/pos/interface/pos.interface';

export interface CalculateDiscountPreviewRequest {
  cardMobileUserId: number;
  sum: number;
  sumBonus?: number;
  carWashId: number;
  carWashDeviceId: number;
  bayType?: DeviceType | null;
  promoCodeId?: number | null;
  rewardPointsUsed?: number;
}

export interface CalculateDiscountPreviewResponse {
  sumFull: number;
  sumBonus: number;
  sumDiscount: number;
  sumReal: number;
  sumCashback: number;
  transactionalCampaignDiscount: number;
  promoCodeDiscount: number;
  usedTransactionalCampaign: {
    campaignId: number;
    campaignName: string;
    actionId: number;
    discountAmount: number;
  } | null;
  usedPromoCode: boolean;
}

@Injectable()
export class CalculateOrderDiscountPreviewUseCase {
  private readonly logger = new Logger(CalculateOrderDiscountPreviewUseCase.name);

  constructor(
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly orderBuilderService: OrderBuilderService,
    private readonly orderDiscountService: OrderDiscountService,
  ) {}

  async execute(
    request: CalculateDiscountPreviewRequest,
  ): Promise<CalculateDiscountPreviewResponse> {
    this.logger.log(
      `Calculating discount preview for user ${request.cardMobileUserId}, sum: ${request.sum}, carWashId: ${request.carWashId}`,
    );

    const card = await this.findMethodsCardUseCase.getById(
      request.cardMobileUserId,
    );

    if (!card) {
      throw new NotFoundException(
        `Card with ID ${request.cardMobileUserId} not found`,
      );
    }

    const order = await this.orderBuilderService.buildOrder(
      {
        sum: request.sum,
        sumBonus: request.sumBonus || 0,
        carWashDeviceId: request.carWashDeviceId,
        bayType: request.bayType ?? null,
      },
      card,
    );

    const orderDate = new Date();
    const discountResult = await this.orderDiscountService.calculateDiscounts(
      {
        cardMobileUserId: request.cardMobileUserId,
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

    const sumReal = Math.max(0, request.sum - discountResult.finalDiscount);

    this.logger.log(
      `Discount preview calculated - sumFull: ${order.sumFull}, sumDiscount: ${discountResult.finalDiscount}, sumReal: ${sumReal}`,
    );

    return {
      sumFull: order.sumFull,
      sumBonus: order.sumBonus,
      sumDiscount: discountResult.finalDiscount,
      sumReal,
      sumCashback: order.sumCashback,
      transactionalCampaignDiscount: discountResult.transactionalCampaignDiscount,
      promoCodeDiscount: discountResult.promoCodeDiscount,
      usedTransactionalCampaign: discountResult.usedTransactionalCampaign,
      usedPromoCode: discountResult.promoCodeDiscount > 0,
    };
  }
}
