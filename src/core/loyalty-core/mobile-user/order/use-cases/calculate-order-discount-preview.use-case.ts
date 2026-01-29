import { Injectable, Logger } from '@nestjs/common';
import { OrderPreparationService } from '@loyalty/order/domain/services/order-preparation.service';
import { DeviceType } from '@infra/pos/interface/pos.interface';

export interface CalculateDiscountPreviewRequest {
  cardMobileUserId: number;
  sum: number;
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
    private readonly orderPreparationService: OrderPreparationService,
  ) {}

  async execute(
    request: CalculateDiscountPreviewRequest,
  ): Promise<CalculateDiscountPreviewResponse> {
    this.logger.log(
      `Calculating discount preview for user ${request.cardMobileUserId}, sum: ${request.sum}, carWashId: ${request.carWashId}`,
    );

    const { order, discountResult, totals } =
      await this.orderPreparationService.prepareOrderWithTotals(
        {
          cardMobileUserId: request.cardMobileUserId,
          sum: request.sum,
          carWashId: request.carWashId,
          carWashDeviceId: request.carWashDeviceId,
          bayType: request.bayType ?? null,
          promoCodeId: request.promoCodeId ?? null,
          rewardPointsUsed: request.rewardPointsUsed,
        },
      );

    this.logger.log(
      `Discount preview calculated - sumFull: ${order.sumFull}, sumDiscount: ${totals.sumDiscount}, sumReal: ${totals.sumReal}, sumCashback: ${totals.sumCashback}`,
    );

    return {
      sumFull: order.sumFull,
      sumBonus: totals.sumBonus,
      sumDiscount: totals.sumDiscount,
      sumReal: totals.sumReal,
      sumCashback: totals.sumCashback,
      transactionalCampaignDiscount: discountResult.transactionalCampaignDiscount,
      promoCodeDiscount: discountResult.promoCodeDiscount,
      usedTransactionalCampaign: discountResult.usedTransactionalCampaign,
      usedPromoCode: discountResult.promoCodeDiscount > 0,
    };
  }
}
