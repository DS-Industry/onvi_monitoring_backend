import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import {
  IPromoCodeRepository,
  PromoCode,
  CreateMarketingCampaignUsageInput,
} from '../interface/promo-code-repository.interface';
import { EnumMapper } from '@db/mapper/enum-mapper';

@Injectable()
export class PromoCodeRepository extends IPromoCodeRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findById(id: number): Promise<PromoCode | null> {
    const promoCode = await this.prisma.lTYPromocode.findUnique({
      where: { id },
    });

    if (!promoCode) {
      return null;
    }

    return {
      id: promoCode.id,
      campaignId: promoCode.campaignId,
      code: promoCode.code,
      discountType: promoCode.discountType,
      discountValue: Number(promoCode.discountValue),
      minOrderAmount: promoCode.minOrderAmount
        ? Number(promoCode.minOrderAmount)
        : null,
      maxDiscountAmount: promoCode.maxDiscountAmount
        ? Number(promoCode.maxDiscountAmount)
        : null,
      maxUsage: promoCode.maxUsage,
      maxUsagePerUser: promoCode.maxUsagePerUser,
      currentUsage: promoCode.currentUsage,
      validFrom: promoCode.validFrom,
      validUntil: promoCode.validUntil,
      isActive: promoCode.isActive,
    };
  }

  async incrementUsage(id: number): Promise<void> {
    await this.prisma.lTYPromocode.update({
      where: { id },
      data: {
        currentUsage: {
          increment: 1,
        },
      },
    });
  }

  async countUsageByUser(promocodeId: number, userId: number): Promise<number> {
    const count = await this.prisma.marketingCampaignUsage.count({
      where: {
        promocodeId,
        ltyUserId: userId,
      },
    });
    return count;
  }

  async createUsage(
    input: CreateMarketingCampaignUsageInput,
  ): Promise<void> {
    await this.prisma.marketingCampaignUsage.create({
      data: {
        campaignId: input.campaignId || 0,
        promocodeId: input.promocodeId,
        ltyUserId: input.ltyUserId,
        discountAmount: input.discountAmount,
        orderAmount: input.orderAmount,
        posId: input.posId,
        usedAt: new Date(),
      },
    });
  }
}



