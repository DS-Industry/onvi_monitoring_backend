import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import { CampaignExecutionType, MarketingCampaignStatus } from '@prisma/client';

@Injectable()
export class HandlerMarketingCampaignActivationWindowCron {
  private readonly logger = new Logger(
    HandlerMarketingCampaignActivationWindowCron.name,
  );

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * *', { timeZone: 'UTC' })
  async execute(): Promise<void> {
    this.logger.log(
      'Starting marketing campaign activation window creation...',
    );
    const startTime = Date.now();

    try {
      const campaigns = await this.findBehavioralAndActiveCampaigns();

      this.logger.log(
        `Found ${campaigns.length} behavioral and active marketing campaigns with BIRTHDAY or INACTIVITY conditions`,
      );

      for (const campaign of campaigns) {
        const eligibleUsers = await this.findEligibleUsers(campaign);
        this.logger.log(
          `Campaign ${campaign.id} (${campaign.name}): Found ${eligibleUsers.length} eligible users`,
        );
      }

      const executionTime = Date.now() - startTime;
      this.logger.log(
        `Marketing campaign activation window creation completed in ${executionTime}ms`,
      );
    } catch (error) {
      this.logger.error(
        'Error during marketing campaign activation window creation',
        {
          error: error.message,
          stack: error.stack,
        },
      );
      throw error;
    }
  }

  private async findBehavioralAndActiveCampaigns() {
    const now = new Date();

    const statusActive = MarketingCampaignStatus.ACTIVE;
    const executionTypeBehavioral = CampaignExecutionType.BEHAVIORAL;

    const campaignIds = await this.prisma.$queryRaw<{ id: number }[]>`
      SELECT DISTINCT mc.id
      FROM "MarketingCampaign" mc
      INNER JOIN "MarketingCampaignCondition" mcc ON mc.id = mcc."campaignId"
      WHERE mc.status = ${statusActive}::"MarketingCampaignStatus"
        AND mc."executionType" = ${executionTypeBehavioral}::"CampaignExecutionType"
        AND mc."launchDate" <= ${now}::timestamp
        AND (mc."endDate" IS NULL OR mc."endDate" >= ${now}::timestamp)
        AND mcc.tree IS NOT NULL
        AND (
          -- Check if tree is a single object with BIRTHDAY or INACTIVITY type
          -- The @> operator checks JSONB containment (works for objects)
          (mcc.tree @> '{"type": "BIRTHDAY"}'::jsonb)
          OR (mcc.tree @> '{"type": "INACTIVITY"}'::jsonb)
          -- Check if tree is an array containing BIRTHDAY or INACTIVITY type
          -- jsonb_typeof prevents errors when tree is not an array
          OR (
            jsonb_typeof(mcc.tree) = 'array'
            AND EXISTS (
              SELECT 1
              FROM jsonb_array_elements(mcc.tree) AS elem
              WHERE elem @> '{"type": "BIRTHDAY"}'::jsonb
                 OR elem @> '{"type": "INACTIVITY"}'::jsonb
            )
          )
        )
    `;

    if (campaignIds.length === 0) {
      return [];
    }

    const campaignIdList = campaignIds.map((c) => c.id);

    return await this.prisma.marketingCampaign.findMany({
      where: {
        id: { in: campaignIdList },
      },
      include: {
        conditions: {
          select: {
            id: true,
            tree: true,
          },
        },
        ltyUsers: {
          select: { id: true },
        },
        poses: {
          select: { id: true },
        },
      },
    });
  }

  private async findEligibleUsers(campaign: any): Promise<number[]> {
    if (campaign.ltyUsers && campaign.ltyUsers.length > 0) {
      return campaign.ltyUsers.map((u: any) => u.id);
    }

    const users = await this.prisma.lTYUser.findMany({
      where: {
        status: 'ACTIVE',
        card: {
          isNot: null,
        },
      },
      select: { id: true },
    });

    return users.map((u) => u.id);
  }
}
