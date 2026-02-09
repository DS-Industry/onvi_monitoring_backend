import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import {
  IPromoCodeRepository,
  PromoCode,
  CreateMarketingCampaignUsageInput,
  CreatePromoCodeInput,
  UpdatePromoCodeInput,
  MarketingCampaignUsage,
  FindPromocodesFilter,
  PersonalPromocodesPaginatedResult,
  PromocodeFilterType,
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
      posId: promocode.posId,
      personalUserId: promocode.personalUserId,
      organizationId: promocode.organizationId,
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
      posId: promoCode.posId,
      personalUserId: promoCode.personalUserId,
      organizationId: promoCode.organizationId,
    };
  }

  async findByCode(code: string): Promise<PromoCode | null> {
    const promoCode = await this.prisma.lTYPromocode.findUnique({
      where: { code },
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
      posId: promoCode.posId,
      personalUserId: promoCode.personalUserId,
      organizationId: promoCode.organizationId,
    };
  }

  async update(id: number, input: UpdatePromoCodeInput): Promise<PromoCode> {
    const updateData: any = {};

    if (input.campaignId !== undefined) updateData.campaignId = input.campaignId;
    if (input.code !== undefined) updateData.code = input.code;
    if (input.promocodeType !== undefined) updateData.promocodeType = input.promocodeType as any;
    if (input.personalUserId !== undefined) updateData.personalUserId = input.personalUserId;
    if (input.discountType !== undefined) updateData.discountType = input.discountType as any;
    if (input.discountValue !== undefined) updateData.discountValue = input.discountValue;
    if (input.minOrderAmount !== undefined) updateData.minOrderAmount = input.minOrderAmount;
    if (input.maxDiscountAmount !== undefined) updateData.maxDiscountAmount = input.maxDiscountAmount;
    if (input.maxUsage !== undefined) updateData.maxUsage = input.maxUsage;
    if (input.maxUsagePerUser !== undefined) updateData.maxUsagePerUser = input.maxUsagePerUser;
    if (input.validFrom !== undefined) updateData.validFrom = input.validFrom;
    if (input.validUntil !== undefined) updateData.validUntil = input.validUntil;
    if (input.isActive !== undefined) updateData.isActive = input.isActive;
    if (input.createdReason !== undefined) updateData.createdReason = input.createdReason;
    if (input.usageRestrictions !== undefined) updateData.usageRestrictions = input.usageRestrictions;
    if (input.organizationId !== undefined) updateData.organizationId = input.organizationId;
    if (input.posId !== undefined) updateData.posId = input.posId;
    if (input.placementId !== undefined) updateData.placementId = input.placementId;

    const promocode = await this.prisma.lTYPromocode.update({
      where: { id },
      data: updateData,
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
      posId: promocode.posId,
      personalUserId: promocode.personalUserId,
      organizationId: promocode.organizationId,
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

  async findUsageByOrderId(orderId: number): Promise<MarketingCampaignUsage | null> {
    const usage = await this.prisma.marketingCampaignUsage.findFirst({
      where: {
        orderId,
        promocodeId: { not: null },
      },
    });

    if (!usage) {
      return null;
    }

    return {
      id: usage.id,
      campaignId: usage.campaignId,
      promocodeId: usage.promocodeId,
      ltyUserId: usage.ltyUserId,
      orderId: usage.orderId,
      usedAt: usage.usedAt,
      type: usage.type || null,
      actionId: usage.actionId,
      posId: usage.posId,
    };
  }

  async findDiscountUsageByOrderId(
    orderId: number,
  ): Promise<MarketingCampaignUsage | null> {
    const usage = await this.prisma.marketingCampaignUsage.findFirst({
      where: {
        orderId,
        type: CampaignRedemptionType.DISCOUNT,
      },
    });

    if (!usage) {
      return null;
    }

    return {
      id: usage.id,
      campaignId: usage.campaignId,
      promocodeId: usage.promocodeId,
      ltyUserId: usage.ltyUserId,
      orderId: usage.orderId,
      usedAt: usage.usedAt,
      type: usage.type || null,
      actionId: usage.actionId,
      posId: usage.posId,
    };
  }

  async findAllPromocodesPaginated(
    filter: FindPromocodesFilter,
  ): Promise<PersonalPromocodesPaginatedResult> {
    const { page = 1, size = 10, organizationId, filter: filterType = PromocodeFilterType.ALL, isActive, search, personalUserId } = filter;
    const skip = size * (page - 1);
    const take = size;

    const where: any = {
      organizationId: organizationId,
    };

    if (filterType === PromocodeFilterType.PERSONAL) {
      where.personalUserId = { not: null };
    } else if (filterType === PromocodeFilterType.CAMPAIGN) {
      where.campaignId = { not: null };
    } else if (filterType === PromocodeFilterType.STANDALONE) {
      where.campaignId = null;
      where.personalUserId = null;
    }

    if (personalUserId !== undefined && filterType !== PromocodeFilterType.STANDALONE) {
      where.personalUserId = personalUserId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      const searchConditions: any[] = [
        { code: { contains: search, mode: 'insensitive' } },
      ];

      if (filterType === PromocodeFilterType.PERSONAL || 
          filterType === PromocodeFilterType.ALL || 
          personalUserId !== undefined) {
        searchConditions.push(
          {
            personalUser: {
              name: { contains: search, mode: 'insensitive' },
            },
          },
          {
            personalUser: {
              phone: { contains: search, mode: 'insensitive' },
            },
          },
        );
      }
      
      if (where.AND) {
        where.AND.push({
          OR: searchConditions,
        });
      } else {
        where.AND = [
          {
            OR: searchConditions,
          },
        ];
      }
    }

    const total = await this.prisma.lTYPromocode.count({ where });

    const promocodes = await this.prisma.lTYPromocode.findMany({
      where,
      skip,
      take,
      include: {
        personalUser: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const data = promocodes.map((promocode) => ({
      id: promocode.id,
      campaignId: promocode.campaignId,
      code: promocode.code,
      promocodeType: promocode.promocodeType,
      personalUserId: promocode.personalUserId,
      discountType: promocode.discountType,
      discountValue: promocode.discountValue ? Number(promocode.discountValue) : null,
      minOrderAmount: promocode.minOrderAmount ? Number(promocode.minOrderAmount) : null,
      maxDiscountAmount: promocode.maxDiscountAmount ? Number(promocode.maxDiscountAmount) : null,
      maxUsage: promocode.maxUsage,
      maxUsagePerUser: promocode.maxUsagePerUser,
      currentUsage: promocode.currentUsage,
      validFrom: promocode.validFrom,
      validUntil: promocode.validUntil,
      isActive: promocode.isActive,
      createdByManagerId: promocode.createdByManagerId,
      createdReason: promocode.createdReason,
      organizationId: promocode.organizationId,
      posId: promocode.posId,
      placementId: promocode.placementId,
      createdAt: promocode.createdAt,
      updatedAt: promocode.updatedAt,
      personalUser: promocode.personalUser
        ? {
            id: promocode.personalUser.id,
            name: promocode.personalUser.name,
            phone: promocode.personalUser.phone,
            email: promocode.personalUser.email,
          }
        : null,
    }));

    const totalPages = Math.ceil(total / size);

    return {
      data,
      total,
      page,
      size,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async delete(id: number): Promise<void> {
    const promocode = await this.prisma.lTYPromocode.findUnique({
      where: { id },
      select: { currentUsage: true },
    });

    if (!promocode) {
      throw new Error('Promocode not found');
    }

    if (promocode.currentUsage > 0) {
      await this.prisma.lTYPromocode.update({
        where: { id },
        data: {
          isActive: false,
          updatedAt: new Date(),
        },
      });
    } else {
      await this.prisma.lTYPromocode.delete({
        where: { id },
      });
    }
  }
}
