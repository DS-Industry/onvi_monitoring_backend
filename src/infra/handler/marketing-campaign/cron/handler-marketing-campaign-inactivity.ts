import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import {
  ActivationWindowStatus,
  CampaignExecutionType,
  LTYProgramParticipantStatus,
  MarketingCampaignStatus,
  Prisma,
} from '@prisma/client';

@Injectable()
export class HandlerMarketingCampaignInactivityCron {
  private readonly logger = new Logger(
    HandlerMarketingCampaignInactivityCron.name,
  );

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * *', { timeZone: 'UTC' })
  async execute(): Promise<void> {
    this.logger.log(
      'Starting marketing campaign inactivity activation window creation...',
    );
    const startTime = Date.now();

    try {
      const campaigns = await this.findInactivityCampaigns();

      this.logger.log(
        `Found ${campaigns.length} active marketing campaigns with INACTIVITY conditions`,
      );

      let totalWindowsCreated = 0;

      for (const campaign of campaigns) {
        if (!campaign.action) {
          this.logger.warn(
            `Campaign ${campaign.id} (${campaign.name}) has no action, skipping`,
          );
          continue;
        }

        if (!campaign.activeDays) {
          this.logger.warn(
            `Campaign ${campaign.id} (${campaign.name}) has no activeDays, skipping`,
          );
          continue;
        }

        const inactivityDays = this.extractInactivityDays(campaign);
        if (!inactivityDays) {
          this.logger.warn(
            `Campaign ${campaign.id} (${campaign.name}) has no inactivity days specified, skipping`,
          );
          continue;
        }

        const inactiveUsers = await this.findInactiveUsers(
          campaign,
          inactivityDays,
        );

        this.logger.log(
          `Campaign ${campaign.id} (${campaign.name}): Found ${inactiveUsers.length} users inactive for ${inactivityDays} days`,
        );

        const windowsCreated = await this.createActivationWindows(
          campaign,
          inactiveUsers,
        );

        totalWindowsCreated += windowsCreated;

        this.logger.log(
          `Campaign ${campaign.id} (${campaign.name}): Created ${windowsCreated} activation windows`,
        );
      }

      const executionTime = Date.now() - startTime;
      this.logger.log(
        `Marketing campaign inactivity activation window creation completed in ${executionTime}ms. Total windows created: ${totalWindowsCreated}`,
      );
    } catch (error) {
      this.logger.error(
        'Error during marketing campaign inactivity activation window creation',
        {
          error: error.message,
          stack: error.stack,
        },
      );
      throw error;
    }
  }

  private async findInactivityCampaigns() {
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
        AND mc."activeDays" IS NOT NULL
        AND mcc.tree IS NOT NULL
        AND (
          -- Check if tree is a single object with INACTIVITY type
          (mcc.tree @> '{"type": "INACTIVITY"}'::jsonb)
          -- Check if tree is an array containing INACTIVITY type
          OR (
            jsonb_typeof(mcc.tree) = 'array'
            AND EXISTS (
              SELECT 1
              FROM jsonb_array_elements(mcc.tree) AS elem
              WHERE elem @> '{"type": "INACTIVITY"}'::jsonb
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
        action: {
          select: {
            id: true,
          },
        },
        conditions: {
          select: {
            id: true,
            tree: true,
          },
        },
        ltyUsers: {
          select: { id: true },
        },
        ltyProgramParticipant: {
          select: {
            id: true,
            organizationId: true,
          },
        },
        ltyProgram: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  private extractInactivityDays(campaign: any): number | null {
    if (!campaign.conditions || campaign.conditions.length === 0) {
      return null;
    }

    for (const condition of campaign.conditions) {
      if (!condition.tree) {
        continue;
      }

      const tree = condition.tree as any;

      if (tree.type === 'INACTIVITY' && typeof tree.days === 'number') {
        return tree.days;
      }

      if (Array.isArray(tree)) {
        for (const elem of tree) {
          if (elem.type === 'INACTIVITY' && typeof elem.days === 'number') {
            return elem.days;
          }
        }
      }
    }

    return null;
  }

  private async findInactiveUsers(
    campaign: any,
    inactivityDays: number,
  ): Promise<number[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactivityDays);
    cutoffDate.setHours(0, 0, 0, 0);

    let userIdFilter = Prisma.empty;
    let cardFilter = Prisma.sql`AND EXISTS (
      SELECT 1
      FROM "LTYCard" c
      WHERE c."clientId" = u.id
    )`;

    if (campaign.ltyUsers && campaign.ltyUsers.length > 0) {
      userIdFilter = Prisma.sql`AND u.id = ANY(${campaign.ltyUsers.map((u: any) => u.id)})`;
    } else {
      let organizationIds: number[] = [];

      if (campaign.ltyProgramParticipant?.organizationId) {
        organizationIds = [campaign.ltyProgramParticipant.organizationId];
      } else if (campaign.ltyProgram?.id) {
        const participants = await this.prisma.lTYProgramParticipant.findMany({
          where: {
            ltyProgramId: campaign.ltyProgram.id,
            status: LTYProgramParticipantStatus.ACTIVE,
          },
          select: {
            organizationId: true,
          },
        });
        organizationIds = participants.map((p) => p.organizationId);
      }

      if (organizationIds.length > 0) {
        cardFilter = Prisma.sql`AND EXISTS (
          SELECT 1
          FROM "LTYCard" c
          WHERE c."clientId" = u.id
            AND c."organizationId" = ANY(${organizationIds})
        )`;
      }
    }

    const users = await this.prisma.$queryRaw<{ id: number }[]>`
      SELECT u.id
      FROM "LTYUser" u
      WHERE u.status = 'ACTIVE'::"StatusUser"
        ${cardFilter}
        AND (
          -- User has no completed orders at all
          NOT EXISTS (
            SELECT 1
            FROM "LTYOrder" o
            INNER JOIN "LTYCard" c ON o."cardId" = c.id
            WHERE c."clientId" = u.id
              AND o."orderStatus" IN ('COMPLETED', 'PAYED', 'POS_PROCESSED')
          )
          OR
          -- User's last order (across all cards) was before the cutoff date
          (
            SELECT MAX(o."orderData")
            FROM "LTYOrder" o
            INNER JOIN "LTYCard" c ON o."cardId" = c.id
            WHERE c."clientId" = u.id
              AND o."orderStatus" IN ('COMPLETED', 'PAYED', 'POS_PROCESSED')
          ) < ${cutoffDate}::timestamp
        )
        ${userIdFilter}
    `;

    return users.map((u) => u.id);
  }

  private async createActivationWindows(
    campaign: any,
    userIds: number[],
  ): Promise<number> {
    if (userIds.length === 0) {
      return 0;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + campaign.activeDays - 1);
    endDate.setHours(23, 59, 59, 999);

    let windowsCreated = 0;

    for (const userId of userIds) {
      const existingWindow = await this.prisma.activationWindow.findFirst({
        where: {
          ltyUserId: userId,
          campaignId: campaign.id,
          startAt: {
            gte: today,
          },
          status: {
            in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE],
          },
        },
      });

      if (existingWindow) {
        this.logger.debug(
          `Activation window already exists for user ${userId} and campaign ${campaign.id}, skipping`,
        );
        continue;
      }

      const now = new Date();
      const windowStatus =
        today <= now
          ? ActivationWindowStatus.ACTIVE
          : ActivationWindowStatus.PENDING;

      await this.prisma.activationWindow.create({
        data: {
          ltyUserId: userId,
          campaignId: campaign.id,
          actionId: campaign.action.id,
          startAt: today,
          endAt: endDate,
          status: windowStatus,
        },
      });

      windowsCreated++;
    }

    return windowsCreated;
  }
}
