import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { MarketingCampaignStatus } from '@prisma/client';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { MarketingCampaignMobileDisplayResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-mobile-display-response.dto';
import {
  PROMOCODE_FILTER,
  PromocodeFilterType,
} from '../constants/promocode-filter.constants';

export interface AvailablePromocodeResponse {
  id: number;
  code: string;
  campaignId: number | null;
  promocodeType: string;
  discountType: string | null;
  discountValue: number | null;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  maxUsage: number | null;
  maxUsagePerUser: number;
  currentUsage: number;
  validFrom: string;
  validUntil: string | null;
  isActive: boolean;
  posId: number | null;
  campaign?: {
    id: number;
    name: string;
    description: string | null;
  } | null;
  mobileDisplay: MarketingCampaignMobileDisplayResponseDto | null;
}

@Injectable()
export class GetAvailablePromocodesUseCase {
  private readonly logger = new Logger(GetAvailablePromocodesUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly marketingCampaignRepository: IMarketingCampaignRepository,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(
    ltyUserId: number,
    carWashId?: number,
    filter: PromocodeFilterType = PROMOCODE_FILTER.ALL,
  ): Promise<AvailablePromocodeResponse[]> {
    this.logger.log(
      `Fetching available promocodes for user ${ltyUserId}${carWashId ? `, carWashId: ${carWashId}` : ''}, filter: ${filter}`,
    );

    const now = new Date();

    const personalPromocodesWhere: any = {
      personalUserId: ltyUserId,
      isActive: true,
      validFrom: { lte: now },
      OR: [{ validUntil: null }, { validUntil: { gte: now } }],
    };

    if (carWashId !== undefined) {
      personalPromocodesWhere.AND = [
        { OR: [{ posId: null }, { posId: carWashId }] },
      ];
    }

    const personalPromocodes = await this.prisma.lTYPromocode.findMany({
      where: personalPromocodesWhere,
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (filter === PROMOCODE_FILTER.PERSONAL) {
      this.logger.debug(
        `Found ${personalPromocodes.length} personal promocodes for user ${ltyUserId}`,
      );
      return this.mapPromocodes(personalPromocodes);
    }

    const card = await this.findMethodsCardUseCase.getByClientId(ltyUserId);
    if (!card) {
      this.logger.warn(`No card found for user ${ltyUserId}`);
      if (filter === PROMOCODE_FILTER.MARKETING_CAMPAIGNS) {
        return [];
      }
      return this.mapPromocodes(personalPromocodes);
    }

    const cardData = await this.prisma.lTYCard.findFirst({
      where: {
        clientId: ltyUserId,
      },
      select: {
        cardTierId: true,
        cardTier: {
          select: {
            ltyProgramId: true,
          },
        },
      },
    });

    const ltyProgramId = cardData?.cardTier?.ltyProgramId || null;

    const userEligibilityFilter: any[] = [
      {
        ltyUsers: {
          some: {
            id: ltyUserId,
          },
        },
      },
    ];

    if (ltyProgramId) {
      userEligibilityFilter.push({
        ltyProgramId: ltyProgramId,
      });
    } else {
      userEligibilityFilter.push({
        AND: [
          { ltyUsers: { none: {} } },
          { ltyProgramParticipant: null },
          { ltyProgramId: null },
        ],
      });
    }

    const campaignFilter: any = {
      AND: [
        {
          status: MarketingCampaignStatus.ACTIVE,
          launchDate: { lte: now },
          OR: [{ endDate: null }, { endDate: { gte: now } }],
        },
        {
          OR: userEligibilityFilter,
        },
      ],
    };

    if (carWashId !== undefined) {
      campaignFilter.AND.push({
        OR: [{ poses: { none: {} } }, { poses: { some: { id: carWashId } } }],
      });
    }

    const eligibleCampaigns = await this.prisma.marketingCampaign.findMany({
      where: campaignFilter,
      select: {
        id: true,
      },
    });

    const eligibleCampaignIds = eligibleCampaigns.map((c) => c.id);

    const campaignPromocodesWhere: any = {
      campaignId: { in: eligibleCampaignIds },
      isActive: true,
      validFrom: { lte: now },
      OR: [{ validUntil: null }, { validUntil: { gte: now } }],
    };

    if (carWashId !== undefined) {
      campaignPromocodesWhere.AND = [
        { OR: [{ posId: null }, { posId: carWashId }] },
      ];
    }

    const campaignPromocodes = await this.prisma.lTYPromocode.findMany({
      where: campaignPromocodesWhere,
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (filter === PROMOCODE_FILTER.MARKETING_CAMPAIGNS) {
      this.logger.debug(
        `Found ${campaignPromocodes.length} campaign promocodes for user ${ltyUserId}`,
      );
      return this.mapPromocodes(campaignPromocodes);
    }

    const allPromocodes = [
      ...personalPromocodes,
      ...campaignPromocodes,
    ].filter(
      (promocode, index, self) =>
        index === self.findIndex((p) => p.id === promocode.id),
    );

    this.logger.debug(
      `Found ${allPromocodes.length} available promocodes for user ${ltyUserId}`,
    );

    return this.mapPromocodes(allPromocodes);
  }

  private async mapPromocodes(
    promocodes: any[],
  ): Promise<AvailablePromocodeResponse[]> {
    return Promise.all(
      promocodes.map(async (promocode) => {
        let mobileDisplay: MarketingCampaignMobileDisplayResponseDto | null =
          null;

        if (promocode.campaignId) {
          mobileDisplay =
            await this.marketingCampaignRepository.findMobileDisplayByCampaignId(
              promocode.campaignId,
            );
        }

        return {
          id: promocode.id,
          code: promocode.code,
          campaignId: promocode.campaignId,
          promocodeType: promocode.promocodeType,
          discountType: promocode.discountType,
          discountValue: promocode.discountValue
            ? Number(promocode.discountValue)
            : null,
          minOrderAmount: promocode.minOrderAmount
            ? Number(promocode.minOrderAmount)
            : null,
          maxDiscountAmount: promocode.maxDiscountAmount
            ? Number(promocode.maxDiscountAmount)
            : null,
          maxUsage: promocode.maxUsage,
          maxUsagePerUser: promocode.maxUsagePerUser,
          currentUsage: promocode.currentUsage,
          validFrom: promocode.validFrom.toISOString(),
          validUntil: promocode.validUntil?.toISOString() || null,
          isActive: promocode.isActive,
          posId: promocode.posId,
          campaign: promocode.campaign
            ? {
                id: promocode.campaign.id,
                name: promocode.campaign.name,
                description: promocode.campaign.description,
              }
            : null,
          mobileDisplay,
        };
      }),
    );
  }
}
