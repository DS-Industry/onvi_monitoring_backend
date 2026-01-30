import { Injectable, Logger } from '@nestjs/common';
import { OrderUsageData } from '@loyalty/order/interface/order';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { DiscountResult } from './order-discount.service';

@Injectable()
export class OrderUsageDataService {
  private readonly logger = new Logger(OrderUsageDataService.name);

  createUsageTrackingData(
    discountResult: DiscountResult,
    clientId: number,
    carWashId: number,
    promoCodeId: number | undefined,
    card: Card,
  ): OrderUsageData | undefined {
    if (discountResult.finalDiscount <= 0) {
      return undefined;
    }

    if (
      discountResult.transactionalCampaignDiscount > 0 &&
      discountResult.transactionalCampaignDiscount >= discountResult.promoCodeDiscount &&
      discountResult.usedTransactionalCampaign
    ) {
      this.logger.debug(
        `Prepared campaign usage data for campaign ${discountResult.usedTransactionalCampaign.campaignId}`,
      );

      return {
        transactionalCampaign: {
          campaignId: discountResult.usedTransactionalCampaign.campaignId,
          actionId: discountResult.usedTransactionalCampaign.actionId,
          ltyUserId: clientId,
          posId: carWashId,
        },
      };
    }

    if (discountResult.promoCodeDiscount > 0 && promoCodeId) {
      this.logger.debug(
        `Prepared promo code usage data for promoCodeId ${promoCodeId}`,
      );

      return {
        promoCode: {
          promoCodeId,
          ltyUserId: card.mobileUserId || 0,
          posId: carWashId,
        },
      };
    }

    return undefined;
  }
}
