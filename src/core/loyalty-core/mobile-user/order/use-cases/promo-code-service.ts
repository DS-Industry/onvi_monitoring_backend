import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { Order } from '@loyalty/order/domain/order';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { DiscountType } from '@prisma/client';

@Injectable()
export class PromoCodeService {
  constructor(private readonly prisma: PrismaService) {}

  async applyPromoCode(
    promoCodeId: number,
    order: Order,
    card: Card,
    carWashId: number,
  ): Promise<number> {
    const promoCode = await this.prisma.lTYPromocode.findUnique({
      where: { id: promoCodeId },
    });

    if (!promoCode) {
      throw new BadRequestException('Promo code not found');
    }

    if (!promoCode.isActive) {
      throw new BadRequestException('Promo code is not active');
    }

    const now = new Date();
    if (promoCode.validFrom && now < promoCode.validFrom) {
      throw new BadRequestException('Promo code is not yet valid');
    }
    if (promoCode.validUntil && now > promoCode.validUntil) {
      throw new BadRequestException('Promo code has expired');
    }

    const usageCount = await this.prisma.marketingCampaignUsage.count({
      where: {
        promocodeId: promoCodeId,
        ltyUserId: card.mobileUserId,
      },
    });

    if (usageCount >= promoCode.maxUsagePerUser) {
      throw new BadRequestException('Promo code usage limit exceeded');
    }

    const discountAmount = this.calculateDiscount(
      order.sumFull,
      promoCode,
      order.sumBonus,
    );

    await this.prisma.marketingCampaignUsage.create({
      data: {
        campaignId: promoCode.campaignId || 0,
        promocodeId: promoCodeId,
        ltyUserId: card.mobileUserId || 0,
        discountAmount,
        orderAmount: order.sumFull,
        posId: carWashId,
        usedAt: new Date(),
      },
    });

    await this.prisma.lTYPromocode.update({
      where: { id: promoCodeId },
      data: {
        currentUsage: promoCode.currentUsage + 1,
      },
    });

    return discountAmount;
  }

  private calculateDiscount(
    originalSum: number,
    promoCode: any,
    rewardPointsUsed: number,
  ): number {
    if (promoCode.discountType === DiscountType.FIXED_AMOUNT) {
      const fixedDiscount = Number(promoCode.discountValue);
      return Math.min(fixedDiscount, originalSum - rewardPointsUsed);
    } else if (promoCode.discountType === DiscountType.PERCENTAGE) {
      const percentageDiscount =
        (Number(promoCode.discountValue) / 100) * originalSum;
      const maxDiscount = promoCode.maxDiscountAmount
        ? Number(promoCode.maxDiscountAmount)
        : originalSum;
      return Math.min(percentageDiscount, maxDiscount, originalSum - rewardPointsUsed);
    }
    return 0;
  }
}

