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
export class HandlerMarketingCampaignBirthdayCron {
  private readonly logger = new Logger(
    HandlerMarketingCampaignBirthdayCron.name,
  );

  constructor(private readonly prisma: PrismaService) {}

  @Cron('0 0 * * *', { timeZone: 'UTC' })
  async execute(): Promise<void> {
    this.logger.log(
      'Starting marketing campaign birthday activation window creation...',
    );
    const startTime = Date.now();

    try {
      const campaigns = await this.findBirthdayCampaigns();

      this.logger.log(
        `Found ${campaigns.length} active marketing campaigns with BIRTHDAY conditions`,
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

        const usersWithBirthday =
          await this.findUsersWithBirthdayToday(campaign);

        this.logger.log(
          `Campaign ${campaign.id} (${campaign.name}): Found ${usersWithBirthday.length} users with birthday today`,
        );

        const windowsCreated = await this.createActivationWindows(
          campaign,
          usersWithBirthday,
        );

        totalWindowsCreated += windowsCreated;

        this.logger.log(
          `Campaign ${campaign.id} (${campaign.name}): Created ${windowsCreated} activation windows`,
        );
      }

      const executionTime = Date.now() - startTime;
      this.logger.log(
        `Marketing campaign birthday activation window creation completed in ${executionTime}ms. Total windows created: ${totalWindowsCreated}`,
      );
    } catch (error) {
      this.logger.error(
        'Error during marketing campaign birthday activation window creation',
        {
          error: error.message,
          stack: error.stack,
        },
      );
      throw error;
    }
  }

  private async findBirthdayCampaigns() {
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
          -- Check if tree is a single object with BIRTHDAY type
          (mcc.tree @> '{"type": "BIRTHDAY"}'::jsonb)
          -- Check if tree is an array containing BIRTHDAY type
          OR (
            jsonb_typeof(mcc.tree) = 'array'
            AND EXISTS (
              SELECT 1
              FROM jsonb_array_elements(mcc.tree) AS elem
              WHERE elem @> '{"type": "BIRTHDAY"}'::jsonb
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

  private async findUsersWithBirthdayToday(campaign: any) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

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

    const users = await this.prisma.$queryRaw<{ id: number; birthday: Date }[]>`
      SELECT u.id, u.birthday
      FROM "LTYUser" u
      WHERE u.status = 'ACTIVE'::"StatusUser"
        AND u.birthday IS NOT NULL
        AND EXTRACT(MONTH FROM u.birthday AT TIME ZONE 'UTC') = ${month}
        AND EXTRACT(DAY FROM u.birthday AT TIME ZONE 'UTC') = ${day}
        ${cardFilter}
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
