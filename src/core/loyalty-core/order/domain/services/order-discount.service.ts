import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Order } from '@loyalty/order/domain/order';
import { DeviceType } from '@infra/pos/interface/pos.interface';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { CampaignExecutionType } from '@prisma/client';
import { MarketingCampaignDiscountService } from '@loyalty/mobile-user/order/use-cases/marketing-campaign-discount.service';
import { PromoCodeService } from '@loyalty/mobile-user/order/use-cases/promo-code-service';

export interface OrderDiscountRequest {
  cardMobileUserId: number;
  carWashId: number;
  sum: number;
  orderDate: Date;
  rewardPointsUsed: number;
  promoCodeId?: number | null;
  bayType?: DeviceType | null;
}

export interface DiscountResult {
  finalDiscount: number;
  transactionalCampaignDiscount: number;
  promoCodeDiscount: number;
  usedTransactionalCampaign: {
    campaignId: number;
    campaignName: string;
    actionId: number;
    discountAmount: number;
  } | null;
}

@Injectable()
export class OrderDiscountService {
  private readonly logger = new Logger(OrderDiscountService.name);

  constructor(
    private readonly marketingCampaignDiscountService: MarketingCampaignDiscountService,
    private readonly promoCodeService: PromoCodeService,
  ) {}

  async calculateDiscounts(
    request: OrderDiscountRequest,
    order: Order,
    card: Card,
  ): Promise<DiscountResult> {
    const requestedPoints = request.rewardPointsUsed || 0;
    const balance = card.balance || 0;

    if (requestedPoints > balance) {
      throw new BadRequestException(
        `Недостаточно баллов: запрошено ${requestedPoints}, доступно ${balance}`,
      );
    }

    const transactionalCampaignDiscount = await this.calculateTransactionalCampaignDiscount(
      request,
      card.id,
    );

    const promoCodeDiscount = await this.calculatePromoCodeDiscount(
      request.promoCodeId,
      order,
      card,
      request.carWashId,
    );

    const maxDiscount = Math.max(
      transactionalCampaignDiscount.discountAmount,
      promoCodeDiscount,
    );
    const finalDiscount = maxDiscount;

    return {
      finalDiscount,
      transactionalCampaignDiscount: transactionalCampaignDiscount.discountAmount,
      promoCodeDiscount,
      usedTransactionalCampaign: transactionalCampaignDiscount.campaign,
    };
  }

  private async calculateTransactionalCampaignDiscount(
    request: OrderDiscountRequest,
    cardId: number,
  ): Promise<{
    discountAmount: number;
    campaign: {
      campaignId: number;
      campaignName: string;
      actionId: number;
      discountAmount: number;
    } | null;
  }> {
    const eligibleCampaigns =
      await this.marketingCampaignDiscountService.findEligibleDiscountCampaigns(
        request.cardMobileUserId,
        request.orderDate,
        request.carWashId,
      );

    this.logger.debug(
      `Found ${eligibleCampaigns.length} eligible campaigns for user ${request.cardMobileUserId}`,
    );

    await this.marketingCampaignDiscountService.trackVisitCountsForEligibleCampaigns(
      eligibleCampaigns,
      request.cardMobileUserId,
      request.orderDate,
      request.sum,
      cardId,
    );

    const transactionalDiscounts: Array<{
      campaignId: number;
      campaignName: string;
      actionId: number;
      discountAmount: number;
    }> = [];

    for (const campaign of eligibleCampaigns) {
      if (campaign.executionType === CampaignExecutionType.TRANSACTIONAL) {
        const discountResult =
          await this.marketingCampaignDiscountService.evaluateTransactionalCampaignDiscount(
            campaign,
            request.cardMobileUserId,
            request.sum,
            request.orderDate,
            request.rewardPointsUsed,
            request.promoCodeId || null,
            cardId,
          );

        if (discountResult && discountResult.discountAmount > 0) {
          transactionalDiscounts.push({
            campaignId: discountResult.campaignId,
            campaignName: campaign.name || '',
            actionId: discountResult.actionId,
            discountAmount: discountResult.discountAmount,
          });
        }
      }
    }

    if (transactionalDiscounts.length === 0) {
      return { discountAmount: 0, campaign: null };
    }

    const bestTransactional = transactionalDiscounts.reduce((best, current) =>
      current.discountAmount > best.discountAmount ? current : best,
    );

    this.logger.debug(
      `Best transactional campaign discount: ${bestTransactional.discountAmount} for campaign ${bestTransactional.campaignId}`,
    );

    return {
      discountAmount: bestTransactional.discountAmount,
      campaign: bestTransactional,
    };
  }

  private async calculatePromoCodeDiscount(
    promoCodeId: number | undefined | null,
    order: Order,
    card: Card,
    carWashId: number,
  ): Promise<number> {
    if (!promoCodeId) {
      return 0;
    }

    const discount = await this.promoCodeService.applyPromoCode(
      promoCodeId,
      order,
      card,
      carWashId,
    );

    this.logger.debug(
      `Promo code discount applied: ${discount} for promoCodeId ${promoCodeId}`,
    );

    return discount;
  }
}
