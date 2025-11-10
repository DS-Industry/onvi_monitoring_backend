// TODO: This is not finished yet (just a research)

import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma/prisma.service';
import {
  CampaignConditionType,
  ConditionOperator,
  VisitCycle,
  Weekday,
} from '../domain/enums/condition-type.enum';
import { CampaignExecutionType, ActivationWindowStatus } from '@prisma/client';
import { CampaignConditionTree } from '../domain';

interface UserVisitStats {
  visitCount: number;
  lastVisitAt: Date | null;
  totalPurchaseAmount: number;
}

interface ConditionEvaluationResult {
  met: boolean;
  progress?: Record<string, any>;
}

@Injectable()
export class MarketingCampaignBehavioralProcessorUseCase {
  private readonly logger = new Logger(
    MarketingCampaignBehavioralProcessorUseCase.name,
  );

  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<void> {
    const startTime = Date.now();
    this.logger.log('Starting BEHAVIORAL campaign processing...');

    try {
      const activeBehavioralCampaigns = await this.findActiveBehavioralCampaigns();

      if (activeBehavioralCampaigns.length === 0) {
        this.logger.log('No active BEHAVIORAL campaigns found');
        return;
      }

      this.logger.log(
        `Found ${activeBehavioralCampaigns.length} active BEHAVIORAL campaigns`,
      );

      let totalProcessed = 0;
      let totalActivated = 0;

      for (const campaign of activeBehavioralCampaigns) {
        const result = await this.processCampaign(campaign);
        totalProcessed += result.processed;
        totalActivated += result.activated;
      }

      const expiredCount = await this.processExpiredActivationWindows();

      const executionTime = Date.now() - startTime;
      this.logger.log(
        `BEHAVIORAL campaign processing completed in ${executionTime}ms`,
        {
          campaignsProcessed: activeBehavioralCampaigns.length,
          usersProcessed: totalProcessed,
          windowsActivated: totalActivated,
          windowsExpired: expiredCount,
        },
      );
    } catch (error) {
      this.logger.error('Error processing BEHAVIORAL campaigns', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  private async findActiveBehavioralCampaigns() {
    const now = new Date();

    return await this.prisma.marketingCampaign.findMany({
      where: {
        status: 'ACTIVE',
        executionType: CampaignExecutionType.BEHAVIORAL,
        launchDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      include: {
        conditions: true,
        action: true,
        ltyUsers: {
          select: { id: true },
        },
        poses: {
          select: { id: true },
        },
      },
    });
  }

  private async processCampaign(campaign: any): Promise<{
    processed: number;
    activated: number;
  }> {
    if (!campaign.conditions || campaign.conditions.length === 0) {
      this.logger.warn(
        `Campaign ${campaign.id} has no conditions, skipping`,
      );
      return { processed: 0, activated: 0 };
    }

    const conditionTree: CampaignConditionTree = campaign.conditions
      .filter((c: any) => c.tree)
      .flatMap((c: any) => {
        const transformed = this.transformStoredConditionToTreeFormat(c.tree);

        return Array.isArray(transformed) ? transformed : [transformed];
      })
      .filter((c: any) => c !== null); 

    if (conditionTree.length === 0) {
      this.logger.warn(
        `Campaign ${campaign.id} has no valid conditions, skipping`,
      );
      return { processed: 0, activated: 0 };
    }

    const eligibleUserIds = campaign.ltyUsers.length > 0
      ? campaign.ltyUsers.map((u: any) => u.id)
      : await this.getAllEligibleUserIds(campaign);

    let processed = 0;
    let activated = 0;

    const batchSize = 100;
    for (let i = 0; i < eligibleUserIds.length; i += batchSize) {
      const batch = eligibleUserIds.slice(i, i + batchSize);

      for (const userId of batch) {
        try {
          const result = await this.processUserForCampaign(
            campaign,
            userId,
            conditionTree,
          );
          processed++;
          if (result.activated) {
            activated++;
          }
        } catch (error) {
          this.logger.error(
            `Error processing user ${userId} for campaign ${campaign.id}`,
            { error: error.message },
          );
        }
      }
    }

    return { processed, activated };
  }

  private async getAllEligibleUserIds(campaign: any): Promise<number[]> {
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

  private async processUserForCampaign(
    campaign: any,
    userId: number,
    conditionTree: CampaignConditionTree,
  ): Promise<{ activated: boolean }> {
    let progress = await this.prisma.userCampaignProgress.findUnique({
      where: {
        campaignId_ltyUserId: {
          campaignId: campaign.id,
          ltyUserId: userId,
        },
      },
    });

    if (progress?.completedAt) {
      return { activated: false };
    }

    const user = await this.prisma.lTYUser.findUnique({
      where: { id: userId },
      include: {
        card: {
          include: {
            cardTier: {
              include: {
                ltyProgram: {
                  include: {
                    programParticipants: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.card) {
      return { activated: false };
    }

    const visitStats = await this.getUserVisitStats(userId, user.card.id);

    const evaluationResult = await this.evaluateConditionTree(
      conditionTree,
      user,
      visitStats,
      progress?.state as any,
    );

    const newState = {
      ...(progress?.state as any || {}),
      ...evaluationResult.progress,
      lastEvaluatedAt: new Date().toISOString(),
    };

    if (!progress) {
      progress = await this.prisma.userCampaignProgress.create({
        data: {
          campaignId: campaign.id,
          ltyUserId: userId,
          state: newState,
          cycleStartedAt: newState.cycleStartedAt
            ? new Date(newState.cycleStartedAt)
            : new Date(),
        },
      });
    } else {
      progress = await this.prisma.userCampaignProgress.update({
        where: { id: progress.id },
        data: { state: newState },
      });
    }

    if (evaluationResult.met && campaign.action) {
      const alreadyHasActiveWindow = await this.prisma.activationWindow.findFirst({
        where: {
          campaignId: campaign.id,
          ltyUserId: userId,
          status: { in: ['PENDING', 'ACTIVE'] },
        },
      });

      if (!alreadyHasActiveWindow) {
        await this.createActivationWindow(
          campaign,
          campaign.action,
          userId,
        );
        await this.prisma.userCampaignProgress.update({
          where: { id: progress.id },
          data: { completedAt: new Date() },
        });
        return { activated: true };
      }
    }

    return { activated: false };
  }

  private async evaluateConditionTree(
    conditionTree: CampaignConditionTree,
    user: any,
    visitStats: UserVisitStats,
    currentState: any,
  ): Promise<ConditionEvaluationResult> {
    let allMet = true;
    const progress: Record<string, any> = {};

    for (const condition of conditionTree) {
      const result = await this.evaluateCondition(
        condition,
        user,
        visitStats,
        currentState,
      );

      if (!result.met) {
        allMet = false;
      }

      if (result.progress) {
        Object.assign(progress, result.progress);
      }
    }

    return { met: allMet, progress };
  }

  private async evaluateCondition(
    condition: any,
    user: any,
    visitStats: UserVisitStats,
    currentState: any,
  ): Promise<ConditionEvaluationResult> {
    switch (condition.type) {
      case CampaignConditionType.BIRTHDAY:
        return this.evaluateBirthdayCondition(condition, user);

      case CampaignConditionType.VISIT_COUNT:
        return this.evaluateVisitCountCondition(
          condition,
          visitStats,
          currentState,
        );

      case CampaignConditionType.PURCHASE_AMOUNT:
        return this.evaluatePurchaseAmountCondition(condition, visitStats);

      case CampaignConditionType.INACTIVITY:
        return this.evaluateInactivityCondition(condition, visitStats);

      case CampaignConditionType.TIME_RANGE:
        return this.evaluateTimeRangeCondition(condition);

      case CampaignConditionType.WEEKDAY:
        return this.evaluateWeekdayCondition(condition);

      case CampaignConditionType.PROMOCODE_ENTRY:
        this.logger.warn(`PROMOCODE_ENTRY condition not supported in behavioral processor`);
        return { met: false };

      default:
        this.logger.warn(`Unknown condition type: ${condition.type}`);
        return { met: false };
    }
  }

  private transformStoredConditionToTreeFormat(storedCondition: any): any {
    if (!storedCondition || !storedCondition.type) {
      return null;
    }

    const type = storedCondition.type;

    switch (type) {
      case CampaignConditionType.TIME_RANGE:
        if (storedCondition.startTime && storedCondition.endTime) {
          const startDate = new Date(storedCondition.startTime);
          const endDate = new Date(storedCondition.endTime);
          return {
            type: CampaignConditionType.TIME_RANGE,
            start: `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`,
            end: `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`,
          };
        }
        return null;

      case CampaignConditionType.WEEKDAY:
        if (storedCondition.weekdays && Array.isArray(storedCondition.weekdays)) {
          return {
            type: CampaignConditionType.WEEKDAY,
            values: storedCondition.weekdays,
          };
        }
        return null;

      case CampaignConditionType.VISIT_COUNT:
        if (storedCondition.visitCount !== undefined) {
          return {
            type: CampaignConditionType.VISIT_COUNT,
            operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
            value: storedCondition.visitCount,
            cycle: VisitCycle.ALL_TIME,
          };
        }
        return null;

      case CampaignConditionType.PURCHASE_AMOUNT:
        const conditions: any[] = [];
        if (storedCondition.minAmount !== undefined) {
          conditions.push({
            type: CampaignConditionType.PURCHASE_AMOUNT,
            operator: ConditionOperator.GREATER_THAN_OR_EQUAL,
            value: storedCondition.minAmount,
          });
        }
        if (storedCondition.maxAmount !== undefined) {
          conditions.push({
            type: CampaignConditionType.PURCHASE_AMOUNT,
            operator: ConditionOperator.LESS_THAN_OR_EQUAL,
            value: storedCondition.maxAmount,
          });
        }

        if (conditions.length === 0) {
          return null;
        }
        return conditions.length === 1 ? conditions[0] : conditions;

      case CampaignConditionType.BIRTHDAY:
        return {
          type: CampaignConditionType.BIRTHDAY,
          daysBefore: storedCondition.daysBefore || 0,
          daysAfter: storedCondition.daysAfter || 0,
        };

      case CampaignConditionType.INACTIVITY:
        if (storedCondition.days !== undefined) {
          return {
            type: CampaignConditionType.INACTIVITY,
            days: storedCondition.days,
          };
        }
        return null;

      case CampaignConditionType.PROMOCODE_ENTRY:
        if (storedCondition.code) {
          return {
            type: CampaignConditionType.PROMOCODE_ENTRY,
            code: storedCondition.code,
          };
        }
        return null;

      default:
        this.logger.warn(`Unknown condition type in stored format: ${type}`);
        return null;
    }
  }

  private evaluateBirthdayCondition(
    condition: any,
    user: any,
  ): ConditionEvaluationResult {
    if (!user.birthday) {
      return { met: false };
    }

    const now = new Date();
    const birthday = new Date(user.birthday);
    const thisYearBirthday = new Date(
      now.getFullYear(),
      birthday.getMonth(),
      birthday.getDate(),
    );
    const nextYearBirthday = new Date(
      now.getFullYear() + 1,
      birthday.getMonth(),
      birthday.getDate(),
    );

    const daysBefore = condition.daysBefore || 0;
    const daysAfter = condition.daysAfter || 0;

    const windowStart = new Date(thisYearBirthday);
    windowStart.setDate(windowStart.getDate() - daysBefore);

    const windowEnd = new Date(thisYearBirthday);
    windowEnd.setDate(windowEnd.getDate() + daysAfter);

    const inWindow =
      (now >= windowStart && now <= windowEnd) ||
      (now >= new Date(nextYearBirthday.getTime() - daysBefore * 24 * 60 * 60 * 1000) &&
        now <= new Date(nextYearBirthday.getTime() + daysAfter * 24 * 60 * 60 * 1000));

    return { met: inWindow };
  }

  private evaluateVisitCountCondition(
    condition: any,
    visitStats: UserVisitStats,
    currentState: any,
  ): ConditionEvaluationResult {
    const required = condition.value;
    const operator = condition.operator || ConditionOperator.GREATER_THAN_OR_EQUAL;
    const cycle = condition.cycle || VisitCycle.ALL_TIME;

    let visitCount = visitStats.visitCount;

    if (cycle !== VisitCycle.ALL_TIME && currentState?.cycleStartedAt) {
      const cycleStart = new Date(currentState.cycleStartedAt);
      const now = new Date();

      visitCount = visitStats.visitCount;
    }

    let met = false;
    switch (operator) {
      case ConditionOperator.EQUALS:
        met = visitCount === required;
        break;
      case ConditionOperator.GREATER_THAN:
        met = visitCount > required;
        break;
      case ConditionOperator.GREATER_THAN_OR_EQUAL:
        met = visitCount >= required;
        break;
      case ConditionOperator.LESS_THAN:
        met = visitCount < required;
        break;
      case ConditionOperator.LESS_THAN_OR_EQUAL:
        met = visitCount <= required;
        break;
    }

    return {
      met,
      progress: {
        visits_in_cycle: visitCount,
        required_visits: required,
        last_visit_at: visitStats.lastVisitAt?.toISOString(),
      },
    };
  }

  private evaluatePurchaseAmountCondition(
    condition: any,
    visitStats: UserVisitStats,
  ): ConditionEvaluationResult {
    const required = condition.value;
    const operator = condition.operator || ConditionOperator.GREATER_THAN_OR_EQUAL;

    let met = false;
    switch (operator) {
      case ConditionOperator.EQUALS:
        met = visitStats.totalPurchaseAmount === required;
        break;
      case ConditionOperator.GREATER_THAN:
        met = visitStats.totalPurchaseAmount > required;
        break;
      case ConditionOperator.GREATER_THAN_OR_EQUAL:
        met = visitStats.totalPurchaseAmount >= required;
        break;
      case ConditionOperator.LESS_THAN:
        met = visitStats.totalPurchaseAmount < required;
        break;
      case ConditionOperator.LESS_THAN_OR_EQUAL:
        met = visitStats.totalPurchaseAmount <= required;
        break;
    }

    return { met };
  }

  private evaluateInactivityCondition(
    condition: any,
    visitStats: UserVisitStats,
  ): ConditionEvaluationResult {
    const requiredDays = condition.days;
    const now = new Date();

    if (!visitStats.lastVisitAt) {
      return { met: false }; 
    }

    const daysSinceLastVisit = Math.floor(
      (now.getTime() - visitStats.lastVisitAt.getTime()) / (1000 * 60 * 60 * 24),
    );

    return { met: daysSinceLastVisit >= requiredDays };
  }

  private evaluateTimeRangeCondition(condition: any): ConditionEvaluationResult {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const [startHour, startMin] = condition.start.split(':').map(Number);
    const [endHour, endMin] = condition.end.split(':').map(Number);

    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    const currentTimeMinutes = now.getHours() * 60 + now.getMinutes();

    let met = false;
    if (startTime <= endTime) {
      met = currentTimeMinutes >= startTime && currentTimeMinutes <= endTime;
    } else {
      met = currentTimeMinutes >= startTime || currentTimeMinutes <= endTime;
    }

    return { met };
  }

  private evaluateWeekdayCondition(condition: any): ConditionEvaluationResult {
    const now = new Date();
    const dayOfWeek = now.getDay();

    const weekdayMap: Record<number, Weekday> = {
      0: Weekday.SUNDAY,
      1: Weekday.MONDAY,
      2: Weekday.TUESDAY,
      3: Weekday.WEDNESDAY,
      4: Weekday.THURSDAY,
      5: Weekday.FRIDAY,
      6: Weekday.SATURDAY,
    };

    const currentWeekday = weekdayMap[dayOfWeek];
    const met = condition.values.includes(currentWeekday);

    return { met };
  }

  private async getUserVisitStats(
    userId: number,
    cardId: number,
  ): Promise<UserVisitStats> {
    const orders = await this.prisma.lTYOrder.findMany({
      where: {
        cardId: cardId,
        orderStatus: 'COMPLETED',
      },
      select: {
        orderData: true,
        sumReal: true,
      },
      orderBy: {
        orderData: 'desc',
      },
    });

    const visitCount = orders.length;
    const lastVisitAt = orders[0]?.orderData || null;
    const totalPurchaseAmount = orders.reduce(
      (sum, order) => sum + order.sumReal,
      0,
    );

    return {
      visitCount,
      lastVisitAt,
      totalPurchaseAmount,
    };
  }

  private async createActivationWindow(
    campaign: any,
    action: any,
    userId: number,
  ): Promise<void> {
    const payload = action.payload as any;
    const windowDuration = payload.activationWindow?.durationDays || 30;

    const startAt = new Date();
    const endAt = new Date();
    endAt.setDate(endAt.getDate() + windowDuration);

    await this.prisma.activationWindow.create({
      data: {
        campaignId: campaign.id,
        actionId: action.id,
        ltyUserId: userId,
        startAt,
        endAt,
        status: ActivationWindowStatus.PENDING,
      },
    });

    this.logger.log(
      `Created activation window for user ${userId}, campaign ${campaign.id}`,
    );
  }

  private async processExpiredActivationWindows(): Promise<number> {
    const now = new Date();

    const result = await this.prisma.activationWindow.updateMany({
      where: {
        status: { in: [ActivationWindowStatus.PENDING, ActivationWindowStatus.ACTIVE] },
        endAt: { lt: now },
      },
      data: {
        status: ActivationWindowStatus.EXPIRED,
      },
    });

    return result.count;
  }
}

