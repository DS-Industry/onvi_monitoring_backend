import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import {
  IPromoCodeRepository,
  PromoCode,
  CreateMarketingCampaignUsageInput,
  CreatePromoCodeInput,
} from '../interface/promo-code-repository.interface';
import { CampaignRedemptionType } from '@prisma/client';

@Injectable()
export class PromoCodeRepository extends IPromoCodeRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(input: CreatePromoCodeInput): Promise<PromoCode> {
    const promocode = await this.prisma.lTYPromocode.create({
      data: {
        campaignId: input.campaignId,
        code: input.code,
        promocodeType: input.promocodeType as any,
        personalUserId: input.personalUserId,
        discountType: input.discountType as any,
        discountValue: input.discountValue,
        minOrderAmount: input.minOrderAmount,
        maxDiscountAmount: input.maxDiscountAmount,
        maxUsage: input.maxUsage,
        maxUsagePerUser: input.maxUsagePerUser ?? 1,
        validFrom: input.validFrom ?? new Date(),
        validUntil: input.validUntil,
        isActive: input.isActive ?? true,
        createdByManagerId: input.createdByManagerId,
        createdReason: input.createdReason,
        usageRestrictions: input.usageRestrictions,
        organizationId: input.organizationId,
        posId: input.posId,
        placementId: input.placementId,
      },
    });

    return {
      id: promocode.id,
      campaignId: promocode.campaignId,
      actionId: promocode.actionId,
      code: promocode.code,
      discountType: promocode.discountType || '',
      discountValue: Number(promocode.discountValue || 0),
      minOrderAmount: promocode.minOrderAmount
        ? Number(promocode.minOrderAmount)
        : null,
      maxDiscountAmount: promocode.maxDiscountAmount
        ? Number(promocode.maxDiscountAmount)
        : null,
      maxUsage: promocode.maxUsage,
      maxUsagePerUser: promocode.maxUsagePerUser,
      currentUsage: promocode.currentUsage,
      validFrom: promocode.validFrom,
      validUntil: promocode.validUntil,
      isActive: promocode.isActive,
    };
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
      actionId: promoCode.actionId,
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

  async createUsage(input: CreateMarketingCampaignUsageInput): Promise<void> {
    await this.prisma.marketingCampaignUsage.create({
      data: {
        campaignId: input.campaignId || 0,
        promocodeId: input.promocodeId,
        ltyUserId: input.ltyUserId,
        orderId: input.orderId,
        posId: input.posId,
        actionId: input.actionId || null,
        type: input.type
          ? (input.type as CampaignRedemptionType)
          : CampaignRedemptionType.PROMOCODE,
        usedAt: new Date(),
      },
    });
  }
}
