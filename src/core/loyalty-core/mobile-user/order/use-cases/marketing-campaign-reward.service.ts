import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import {
  MarketingCampaignStatus,
  CampaignExecutionType,
  MarketingCampaignActionType,
  OrderStatus,
} from '@prisma/client';
import { CampaignConditionTree } from '@loyalty/marketing-campaign/domain/schemas/condition-tree.schema';
import {
  CampaignConditionType,
  ConditionOperator,
  VisitCycle,
} from '@loyalty/marketing-campaign/domain/enums/condition-type.enum';
import { ActiveActivationWindow } from '../interface/activation-window-repository.interface';

export interface CampaignRewardResult {
  campaignId: number;
  actionId: number;
  executionType: CampaignExecutionType;
  activationWindowId?: number;
  rewardAmount: number;
  actionType: MarketingCampaignActionType;
}

export interface MarketingCampaignWithRelations {
  id: number;
  executionType: CampaignExecutionType;
  action?: {
    id: number;
    actionType: MarketingCampaignActionType;
    payload: any;
  } | null;
  conditions?: Array<{
    id: number;
    tree: any;
  }>;
}

@Injectable()
export class MarketingCampaignRewardService {
  constructor(private readonly prisma: PrismaService) {}

  async findEligibleRewardCampaigns(
    ltyUserId: number,
    orderDate: Date,
    actionTypes: MarketingCampaignActionType[],
  ): Promise<MarketingCampaignWithRelations[]> {
    const now = orderDate;

    const card = await this.prisma.lTYCard.findFirst({
      where: {
        clientId: ltyUserId,
      },
      select: {
        organizationId: true,
      },
    });

    const organizationId = card?.organizationId;

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

    const campaigns = await this.prisma.marketingCampaign.findMany({
      where: {
        AND: [
          {
            status: MarketingCampaignStatus.ACTIVE,
            launchDate: { lte: now },
            OR: [{ endDate: null }, { endDate: { gte: now } }],
            executionType: CampaignExecutionType.TRANSACTIONAL, // Only TRANSACTIONAL campaigns
            action: {
              actionType: {
                in: actionTypes,
              },
            },
          },
          {
            OR: userEligibilityFilter,
          },
        ],
      },
      include: {
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
    });

    return campaigns;
  }

  evaluateActivationWindowReward(
    window: ActiveActivationWindow,
    orderSum: number,
    baseCashback: number,
  ): CampaignRewardResult | null {
    if (
      window.actionType !== MarketingCampaignActionType.CASHBACK_BOOST &&
      window.actionType !== MarketingCampaignActionType.GIFT_POINTS
    ) {
      return null;
    }

    let rewardAmount = 0;

    if (window.actionType === MarketingCampaignActionType.CASHBACK_BOOST) {
      rewardAmount = this.calculateCashbackBoost(
        orderSum,
        baseCashback,
        window.payload,
      );
    } else if (window.actionType === MarketingCampaignActionType.GIFT_POINTS) {
      rewardAmount = this.calculateGiftPoints(window.payload);
    }

    if (rewardAmount > 0) {
      return {
        campaignId: window.campaignId,
        actionId: window.actionId,
        executionType: CampaignExecutionType.BEHAVIORAL,
        activationWindowId: window.id,
        rewardAmount,
        actionType: window.actionType,
      };
    }

    return null;
  }

  async evaluateTransactionalCampaignReward(
    campaign: MarketingCampaignWithRelations,
    ltyUserId: number,
    orderSum: number,
    baseCashback: number,
    orderDate: Date,
    cardId?: number | null,
    orderId?: number | null,
  ): Promise<CampaignRewardResult | null> {
    if (campaign.executionType !== CampaignExecutionType.TRANSACTIONAL) {
      return null;
    }

    if (!campaign.action) {
      return null;
    }

    if (
      campaign.action.actionType !== MarketingCampaignActionType.CASHBACK_BOOST &&
      campaign.action.actionType !== MarketingCampaignActionType.GIFT_POINTS
    ) {
      return null;
    }

    if (campaign.conditions && campaign.conditions.length > 0) {
      const conditionTree = campaign.conditions[0].tree as CampaignConditionTree;
      const conditions = Array.isArray(conditionTree)
        ? conditionTree
        : [conditionTree];

      let progress = await this.prisma.userCampaignProgress.findUnique({
        where: {
          campaignId_ltyUserId: {
            campaignId: campaign.id,
            ltyUserId,
          },
        },
      });

      if (!progress) {
        progress = await this.prisma.userCampaignProgress.create({
          data: {
            campaignId: campaign.id,
            ltyUserId,
            state: {},
            cycleStartedAt: new Date(),
          },
        });
      }

      const orderData = {
        orderDate,
        orderSum,
      };

      const progressConditions = conditions.filter(
        (cond) =>
          cond.type !== CampaignConditionType.TIME_RANGE &&
          cond.type !== CampaignConditionType.WEEKDAY &&
          cond.type !== CampaignConditionType.PROMOCODE_ENTRY &&
          cond.type !== CampaignConditionType.BIRTHDAY &&
          cond.type !== CampaignConditionType.INACTIVITY,
      );

      const updatedState = { ...(progress.state as Record<string, any>) };
      let allConditionsMet = true;

      for (const condition of progressConditions) {
        const isMet = await this.evaluateCondition(
          condition,
          ltyUserId,
          orderData,
          updatedState,
          cardId,
          orderId,
        );

        if (!isMet) {
          allConditionsMet = false;
        }
      }

      const eligibilityConditions = conditions.filter(
        (cond) =>
          cond.type === CampaignConditionType.TIME_RANGE ||
          cond.type === CampaignConditionType.WEEKDAY ||
          cond.type === CampaignConditionType.PROMOCODE_ENTRY ||
          cond.type === CampaignConditionType.BIRTHDAY,
      );

      let isEligible = true;
      for (const condition of eligibilityConditions) {
        if (condition.type === CampaignConditionType.TIME_RANGE) {
          isEligible = this.evaluateTimeRange(condition, orderData);
        } else if (condition.type === CampaignConditionType.WEEKDAY) {
          isEligible = this.evaluateWeekday(condition, orderData);
        } else if (condition.type === CampaignConditionType.PROMOCODE_ENTRY) {
          isEligible = false;
        } else if (condition.type === CampaignConditionType.BIRTHDAY) {
          isEligible = await this.evaluateBirthday(condition, ltyUserId);
        }

        if (!isEligible) {
          break;
        }
      }

      await this.prisma.userCampaignProgress.update({
        where: {
          id: progress.id,
        },
        data: {
          state: updatedState,
          updatedAt: new Date(),
        },
      });

      if (!allConditionsMet || !isEligible) {
        return null;
      }
    }

    let rewardAmount = 0;

    if (campaign.action.actionType === MarketingCampaignActionType.CASHBACK_BOOST) {
      rewardAmount = this.calculateCashbackBoost(
        orderSum,
        baseCashback,
        campaign.action.payload,
      );
    } else if (campaign.action.actionType === MarketingCampaignActionType.GIFT_POINTS) {
      rewardAmount = this.calculateGiftPoints(campaign.action.payload);
    }

    if (rewardAmount > 0) {
      return {
        campaignId: campaign.id,
        actionId: campaign.action.id,
        executionType: CampaignExecutionType.TRANSACTIONAL,
        rewardAmount,
        actionType: campaign.action.actionType,
      };
    }

    return null;
  }

  private calculateCashbackBoost(
    orderSum: number,
    baseCashback: number,
    payload: {
      multiplier?: number;
      percentage?: number;
    },
  ): number {
    if (!payload) {
      return 0;
    }

    if (payload.multiplier && payload.multiplier > 0) {
      return Math.round(baseCashback * payload.multiplier);
    }

    if (payload.percentage && payload.percentage > 0) {
      const additionalCashback = (orderSum * payload.percentage) / 100;
      return Math.round(additionalCashback);
    }

    return 0;
  }

  private calculateGiftPoints(payload: { points?: number }): number {
    if (!payload || !payload.points) {
      return 0;
    }

    return payload.points;
  }

  private async evaluateCondition(
    condition: any,
    ltyUserId: number,
    orderData: { orderDate: Date; orderSum: number },
    state: Record<string, any>,
    cardId?: number | null,
    orderId?: number | null,
  ): Promise<boolean> {
    switch (condition.type) {
      case CampaignConditionType.VISIT_COUNT:
        return this.evaluateVisitCount(condition, ltyUserId, state, orderData, cardId, orderId);

      case CampaignConditionType.PURCHASE_AMOUNT:
        return this.evaluatePurchaseAmount(condition, orderData);

      default:
        return false;
    }
  }

  private async evaluateVisitCount(
    condition: any,
    ltyUserId: number,
    state: Record<string, any>,
    orderData: { orderDate: Date; orderSum: number },
    cardId?: number | null,
    orderId?: number | null,
  ): Promise<boolean> {
    const cycle = condition.cycle || VisitCycle.ALL_TIME;
    const required = condition.value;
    const operator = condition.operator || ConditionOperator.GREATER_THAN_OR_EQUAL;

    if (required === undefined || required === null) {
      return false;
    }

    let currentCount = 0;
    const now = new Date();

    let card;
    if (cardId) {
      card = await this.prisma.lTYCard.findUnique({
        where: { id: cardId },
      });
    } else {
      card = await this.prisma.lTYCard.findFirst({
        where: {
          clientId: ltyUserId,
        },
      });
    }

    if (!card) {
      return false;
    }

    if (cycle === VisitCycle.ALL_TIME || cycle === 'ALL_TIME') {
      currentCount = await this.prisma.lTYOrder.count({
        where: {
          cardId: card.id,
          orderStatus: { in: [OrderStatus.COMPLETED, OrderStatus.PAYED] },
        },
      });
    } else {
      const startDate = this.getCycleStartDate(cycle, now);
      currentCount = await this.prisma.lTYOrder.count({
        where: {
          cardId: card.id,
          orderStatus: { in: [OrderStatus.COMPLETED, OrderStatus.PAYED] },
          orderData: { gte: startDate },
        },
      });
    }

    if (orderId) {
      const currentOrder = await this.prisma.lTYOrder.findUnique({
        where: { id: orderId },
        select: { orderStatus: true, cardId: true },
      });

      if (
        currentOrder &&
        currentOrder.cardId === card.id &&
        currentOrder.orderStatus &&
        currentOrder.orderStatus !== OrderStatus.COMPLETED &&
        currentOrder.orderStatus !== OrderStatus.PAYED
      ) {
        currentCount += 1;
      }
    }

    state.visits_in_cycle = currentCount;
    state.required_visits = required;
    state.last_visit_at = orderData.orderDate;

    return this.compareValues(currentCount, operator, required);
  }

  private evaluatePurchaseAmount(
    condition: any,
    orderData: { orderDate: Date; orderSum: number },
  ): boolean {
    const operator = condition.operator || ConditionOperator.GREATER_THAN_OR_EQUAL;
    const required = condition.value;
    const orderAmount = orderData.orderSum || 0;

    return this.compareValues(orderAmount, operator, required);
  }

  private evaluateTimeRange(
    condition: any,
    orderData: { orderDate: Date; orderSum: number },
  ): boolean {
    const orderDate = new Date(orderData.orderDate);
    const orderTime = `${orderDate.getHours().toString().padStart(2, '0')}:${orderDate.getMinutes().toString().padStart(2, '0')}`;

    return orderTime >= condition.start && orderTime <= condition.end;
  }

  private evaluateWeekday(
    condition: any,
    orderData: { orderDate: Date; orderSum: number },
  ): boolean {
    const orderDate = new Date(orderData.orderDate);
    const dayNames = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ];
    const orderDay = dayNames[orderDate.getDay()];

    return condition.values?.includes(orderDay) || false;
  }

  private async evaluateBirthday(
    condition: any,
    ltyUserId: number,
  ): Promise<boolean> {
    const user = await this.prisma.lTYUser.findUnique({
      where: { id: ltyUserId },
      select: { birthday: true },
    });

    if (!user || !user.birthday) {
      return false;
    }

    const today = new Date();
    const birthday = new Date(user.birthday);
    const todayMonth = today.getMonth() + 1;
    const todayDay = today.getDate();
    const birthdayMonth = birthday.getMonth() + 1;
    const birthdayDay = birthday.getDate();

    return todayMonth === birthdayMonth && todayDay === birthdayDay;
  }

  private getCycleStartDate(cycle: string | VisitCycle, now: Date): Date {
    const startDate = new Date(now);

    switch (cycle) {
      case VisitCycle.DAILY:
      case 'DAILY':
        startDate.setHours(0, 0, 0, 0);
        break;
      case VisitCycle.WEEKLY:
      case 'WEEKLY':
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case VisitCycle.MONTHLY:
      case 'MONTHLY':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case VisitCycle.YEARLY:
      case 'YEARLY':
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case VisitCycle.ALL_TIME:
      case 'ALL_TIME':
      default:
        startDate.setFullYear(1970, 0, 1);
    }

    return startDate;
  }

  private compareValues(
    actual: number,
    operator: ConditionOperator,
    expected: number,
  ): boolean {
    switch (operator) {
      case ConditionOperator.EQUALS:
        return actual === expected;
      case ConditionOperator.NOT_EQUALS:
        return actual !== expected;
      case ConditionOperator.GREATER_THAN:
        return actual > expected;
      case ConditionOperator.GREATER_THAN_OR_EQUAL:
        return actual >= expected;
      case ConditionOperator.LESS_THAN:
        return actual < expected;
      case ConditionOperator.LESS_THAN_OR_EQUAL:
        return actual <= expected;
      default:
        return false;
    }
  }
}

