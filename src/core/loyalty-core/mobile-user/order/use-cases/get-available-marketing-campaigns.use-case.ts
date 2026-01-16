import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import { MarketingCampaignStatus } from '@prisma/client';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { MarketingCampaignMobileDisplayResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-mobile-display-response.dto';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';

export interface AvailableMarketingCampaignResponse {
  id: number;
  name: string;
  description?: string | null;
  executionType: string | null;
  launchDate: string;
  endDate?: string | null;
  action: {
    id: number;
    actionType: string;
    payload: any;
  } | null;
  conditions: Array<{
    id: number;
    tree: any;
  }>;
  mobileDisplay: MarketingCampaignMobileDisplayResponseDto | null;
}

@Injectable()
export class GetAvailableMarketingCampaignsUseCase {
  private readonly logger = new Logger(GetAvailableMarketingCampaignsUseCase.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly marketingCampaignRepository: IMarketingCampaignRepository,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(
    ltyUserId: number,
    carWashId?: number,
  ): Promise<AvailableMarketingCampaignResponse[]> {
    this.logger.log(
      `Fetching available campaigns for user ${ltyUserId}${carWashId ? `, carWashId: ${carWashId}` : ''}`,
    );

    const now = new Date();

    const card = await this.findMethodsCardUseCase.getByClientId(ltyUserId);
    if (!card) {
      this.logger.warn(`No card found for user ${ltyUserId}`);
      return [];
    }

    const cardData = await this.prisma.lTYCard.findFirst({
      where: {
        clientId: ltyUserId,
      },
      select: {
        organizationId: true,
      },
    });

    const organizationId = cardData?.organizationId || null;

    const userEligibilityFilter: any[] = [
      {
        ltyUsers: {
          some: {
            id: ltyUserId,
          },
        },
      },
    ];

    if (organizationId) {
      userEligibilityFilter.push(
        {
          ltyProgramParticipant: {
            organizationId: organizationId,
          },
        },
        {
          ltyProgram: {
            programParticipants: {
              some: {
                organizationId: organizationId,
                status: 'ACTIVE',
              },
            },
          },
        },
      );
    }

    if (!organizationId) {
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
        OR: [
          { poses: { none: {} } },
          { poses: { some: { id: carWashId } } },
        ],
      });
    }

    const campaigns = await this.prisma.marketingCampaign.findMany({
      where: campaignFilter,
      select: {
        id: true,
        name: true,
        description: true,
        executionType: true,
        launchDate: true,
        endDate: true,
        action: {
          select: {
            id: true,
            actionType: true,
            payload: true,
          },
        },
        conditions: {
          select: {
            id: true,
            tree: true,
          },
        },
      },
      orderBy: {
        launchDate: 'desc',
      },
    });

    this.logger.debug(
      `Found ${campaigns.length} available campaigns for user ${ltyUserId}`,
    );

    const campaignsWithMobileDisplay = await Promise.all(
      campaigns.map(async (campaign) => {
        const mobileDisplay =
          await this.marketingCampaignRepository.findMobileDisplayByCampaignId(
            campaign.id,
          );

        return {
          id: campaign.id,
          name: campaign.name,
          description: campaign.description,
          executionType: campaign.executionType,
          launchDate: campaign.launchDate.toISOString(),
          endDate: campaign.endDate?.toISOString() || null,
          action: campaign.action
            ? {
                id: campaign.action.id,
                actionType: campaign.action.actionType,
                payload: campaign.action.payload,
              }
            : null,
          conditions: campaign.conditions.map((condition) => ({
            id: condition.id,
            tree: condition.tree,
          })),
          mobileDisplay,
        };
      }),
    );

    return campaignsWithMobileDisplay;
  }
}
