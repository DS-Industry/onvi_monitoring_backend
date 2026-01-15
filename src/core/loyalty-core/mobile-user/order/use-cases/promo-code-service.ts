import { Injectable, BadRequestException } from '@nestjs/common';
import { Order } from '@loyalty/order/domain/order';
import { Card } from '@loyalty/mobile-user/card/domain/card';
import { IPromoCodeRepository } from '@loyalty/marketing-campaign/interface/promo-code-repository.interface';
import { DiscountType } from '@loyalty/marketing-campaign/domain/enums/discount-type.enum';
import { CampaignRedemptionType } from '@prisma/client';
import { PrismaService } from '@db/prisma/prisma.service';

@Injectable()
export class PromoCodeService {
  constructor(
    private readonly promoCodeRepository: IPromoCodeRepository,
    private readonly prisma: PrismaService,
  ) {}

  async applyPromoCode(
    promoCodeId: number,
    order: Order,
    card: Card,
    carWashId: number,
  ): Promise<number> {
    const promoCode = await this.promoCodeRepository.findById(promoCodeId);

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

    const usageCount = await this.promoCodeRepository.countUsageByUser(
      promoCodeId,
      card.mobileUserId || 0,
    );

    if (usageCount >= promoCode.maxUsagePerUser) {
      throw new BadRequestException('Promo code usage limit exceeded');
    }

    if (promoCode.campaignId) {
      const campaign = await this.prisma.marketingCampaign.findUnique({
        where: { id: promoCode.campaignId },
        select: {
          poses: {
            select: {
              id: true,
            },
          },
        },
      });

      if (campaign) {
        if (campaign.poses.length > 0) {
          const isValidForCarWash = campaign.poses.some(
            (pos) => pos.id === carWashId,
          );
          if (!isValidForCarWash) {
            throw new BadRequestException(
              'Promo code is not valid for this car wash',
            );
          }
        }
      }
    }

    const discountAmount = this.calculateDiscount(
      order.sumFull,
      promoCode,
      order.sumBonus,
    );


    return discountAmount;
  }

  async createPromoCodeUsage(
    promoCodeId: number,
    orderId: number,
    card: Card,
    carWashId: number,
  ): Promise<void> {
    const promoCode = await this.promoCodeRepository.findById(promoCodeId);

    if (!promoCode) {
      return; 
    }

    await this.promoCodeRepository.incrementUsage(promoCodeId);

    if (!promoCode.campaignId) {
      return; 
    }

    await this.promoCodeRepository.createUsage({
      campaignId: promoCode.campaignId,
      promocodeId: promoCodeId,
      ltyUserId: card.mobileUserId || 0,
      orderId: orderId,
      posId: carWashId,
      actionId: promoCode.actionId || null,
      type: CampaignRedemptionType.PROMOCODE,
    });
  }

  private calculateDiscount(
    originalSum: number,
    promoCode: {
      discountType: string;
      discountValue: number;
      maxDiscountAmount: number | null;
    },
    rewardPointsUsed: number,
  ): number {
    if (promoCode.discountType === DiscountType.FIXED_AMOUNT) {
      const fixedDiscount = promoCode.discountValue;
      return Math.min(fixedDiscount, originalSum - rewardPointsUsed);
    } else if (promoCode.discountType === DiscountType.PERCENTAGE) {
      const percentageDiscount = (promoCode.discountValue / 100) * originalSum;
      const maxDiscount = promoCode.maxDiscountAmount || originalSum;
      return Math.min(
        percentageDiscount,
        maxDiscount,
        originalSum - rewardPointsUsed,
      );
    }
    return 0;
  }
}
