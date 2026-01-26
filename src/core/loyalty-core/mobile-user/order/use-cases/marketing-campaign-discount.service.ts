import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import {
  MarketingCampaignStatus,
  CampaignExecutionType,
  MarketingCampaignActionType,
  DiscountType,
  OrderStatus,
} from '@prisma/client';
import { CampaignConditionTree } from '@loyalty/marketing-campaign/domain/schemas/condition-tree.schema';
import {
  CampaignConditionType,
  ConditionOperator,
  VisitCycle,
} from '@loyalty/marketing-campaign/domain/enums/condition-type.enum';
import { DiscountCalculationService } from '@loyalty/order/domain/services/discount-calculation.service';
import { ActiveActivationWindow } from '../interface/activation-window-repository.interface';

export interface CampaignDiscountResult {
  discountAmount: number;
  campaignId: number;
  actionId: number;
  executionType: CampaignExecutionType;
  activationWindowId?: number;
}

export interface OrderEvaluationData {
  orderDate: Date;
  orderSum: number;
  promoCodeId?: number | null;
}

export interface MarketingCampaignWithRelations {
  id: number;
  name: string;
  executionType: CampaignExecutionType;
  action?: {
    id: number;
    actionType: MarketingCampaignActionType;
    payload: any;
  } | null;
  conditions?: Array<{
    id: number;
    tree: CampaignConditionTree;
  }>;
}

@Injectable()
export class MarketingCampaignDiscountService {
  private readonly logger = new Logger(MarketingCampaignDiscountService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly discountCalculationService: DiscountCalculationService,
  ) {}

  async findEligibleDiscountCampaigns(
    ltyUserId: number,
    orderDate: Date,
    carWashId?: number,
  ): Promise<any[]> {
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

    const campaignFilter: any = {
      AND: [
        {
          status: MarketingCampaignStatus.ACTIVE,
          launchDate: { lte: now },
          OR: [{ endDate: null }, { endDate: { gte: now } }],
          action: {
            actionType: MarketingCampaignActionType.DISCOUNT,
          },
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
        executionType: true,
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

  async evaluateTransactionalCampaignDiscount(
    campaign: MarketingCampaignWithRelations,
    ltyUserId: number,
    orderSum: number,
    orderDate: Date,
    rewardPointsUsed: number = 0,
    promoCodeId?: number | null,
    cardId?: number | null,
  ): Promise<CampaignDiscountResult | null> {
    if (campaign.executionType !== CampaignExecutionType.TRANSACTIONAL) {
      return null;
    }

    if (!campaign.conditions || campaign.conditions.length === 0) {
      return null;
    }

    if (!campaign.action || campaign.action.actionType !== MarketingCampaignActionType.DISCOUNT) {
      return null;
    }

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

    const conditionTree = campaign.conditions[0].tree as CampaignConditionTree;
    const conditions = Array.isArray(conditionTree)
      ? conditionTree
      : [conditionTree];

    const progressConditions = conditions.filter(
      (cond) =>
        cond.type !== CampaignConditionType.TIME_RANGE &&
        cond.type !== CampaignConditionType.WEEKDAY &&
        cond.type !== CampaignConditionType.PROMOCODE_ENTRY &&
        cond.type !== CampaignConditionType.BIRTHDAY &&
        cond.type !== CampaignConditionType.INACTIVITY,
    );

    const orderData: OrderEvaluationData = {
      orderDate,
      orderSum,
      promoCodeId,
    };

    const updatedState = { ...(progress.state as Record<string, any>) };
    let allConditionsMet = true;

    for (const condition of progressConditions) {
      const isMet = await this.evaluateCondition(
        condition,
        ltyUserId,
        orderData,
        updatedState,
        cardId,
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
        isEligible = await this.evaluatePromocodeEntry(condition, orderData);
      } else if (condition.type === CampaignConditionType.BIRTHDAY) {
        isEligible = await this.evaluateBirthday(condition, ltyUserId);
      }

      if (!isEligible) {
        break;
      }
    }

    const cycleStartedAt = updatedState.cycleStartedAt
      ? new Date(updatedState.cycleStartedAt)
      : undefined;

    await this.prisma.userCampaignProgress.update({
      where: {
        id: progress.id,
      },
      data: {
        state: updatedState,
        cycleStartedAt: cycleStartedAt || progress.cycleStartedAt,
        updatedAt: new Date(),
      },
    });

    if (allConditionsMet && isEligible) {
      const discountAmount = this.calculateDiscountFromAction(
        orderSum,
        campaign.action.payload as any,
        rewardPointsUsed,
      );

      if (discountAmount > 0) {
        return {
          discountAmount,
          campaignId: campaign.id,
          actionId: campaign.action.id,
          executionType: CampaignExecutionType.TRANSACTIONAL,
        };
      }
    }

    return null;
  }

  async trackVisitCountsForEligibleCampaigns(
    campaigns: MarketingCampaignWithRelations[],
    ltyUserId: number,
    orderDate: Date,
    orderSum: number,
    cardId?: number | null,
  ): Promise<void> {
    for (const campaign of campaigns) {
      if (campaign.executionType !== CampaignExecutionType.TRANSACTIONAL) {
        continue;
      }

      if (!campaign.conditions || campaign.conditions.length === 0) {
        continue;
      }

      const conditionTree = campaign.conditions[0].tree as CampaignConditionTree;
      const conditions = Array.isArray(conditionTree)
        ? conditionTree
        : [conditionTree];

      const hasVisitCountCondition = conditions.some(
        (cond) => cond.type === CampaignConditionType.VISIT_COUNT,
      );

      if (!hasVisitCountCondition) {
        continue;
      }

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

      const visitCountCondition = conditions.find(
        (cond) => cond.type === CampaignConditionType.VISIT_COUNT,
      );

      if (visitCountCondition) {
        const updatedState = { ...(progress.state as Record<string, any>) };
        await this.evaluateVisitCount(
          visitCountCondition,
          ltyUserId,
          updatedState,
          {
            orderDate,
            orderSum,
            promoCodeId: null,
          },
          cardId,
        );

        const cycleStartedAt = updatedState.cycleStartedAt
          ? new Date(updatedState.cycleStartedAt)
          : undefined;

        await this.prisma.userCampaignProgress.update({
          where: {
            id: progress.id,
          },
          data: {
            state: updatedState,
            cycleStartedAt: cycleStartedAt || progress.cycleStartedAt,
            updatedAt: new Date(),
          },
        });
      }
    }
  }

  getBehavioralCampaignDiscount(
    campaign: MarketingCampaignWithRelations,
    activationWindows: ActiveActivationWindow[],
    orderSum: number,
    rewardPointsUsed: number = 0,
  ): CampaignDiscountResult | null {
    if (campaign.executionType !== CampaignExecutionType.BEHAVIORAL) {
      return null;
    }

    const window = activationWindows.find(
      (w) => w.campaignId === campaign.id,
    );

    if (!window) {
      return null;
    }

    const discountAmount = this.calculateDiscountFromAction(
      orderSum,
      window.payload,
      rewardPointsUsed,
    );

    if (discountAmount > 0) {
      return {
        discountAmount,
        campaignId: campaign.id,
        actionId: window.actionId,
        executionType: CampaignExecutionType.BEHAVIORAL,
        activationWindowId: window.id,
      };
    }

    return null;
  }

  private calculateDiscountFromAction(
    originalSum: number,
    payload: {
      discountType: DiscountType;
      discountValue: number;
      maxDiscountAmount?: number;
    },
    rewardPointsUsed: number,
  ): number {
    if (!payload) {
      return 0;
    }

    let discountAmount = 0;

    if (payload.discountType === DiscountType.FIXED_AMOUNT) {
      discountAmount = Math.min(
        payload.discountValue,
        originalSum - rewardPointsUsed,
      );
    } else if (payload.discountType === DiscountType.PERCENTAGE) {
      const percentageDiscount = (payload.discountValue / 100) * originalSum;
      const maxDiscount = payload.maxDiscountAmount || originalSum;
      discountAmount = Math.min(
        percentageDiscount,
        maxDiscount,
        originalSum - rewardPointsUsed,
      );
    } else if (payload.discountType === DiscountType.FREE_SERVICE) {
      discountAmount = originalSum - rewardPointsUsed;
    }

    return discountAmount;
  }

  private async evaluateCondition(
    condition: any,
    ltyUserId: number,
    orderData: OrderEvaluationData,
    state: Record<string, any>,
    cardId?: number | null,
  ): Promise<boolean> {
    switch (condition.type) {
      case CampaignConditionType.VISIT_COUNT:
        return this.evaluateVisitCount(condition, ltyUserId, state, orderData, cardId);

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
    orderData: OrderEvaluationData,
    cardId?: number | null,
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

    const currentStateCount = state.visits_in_cycle || 0;
    const lastVisitAt = state.last_visit_at
      ? new Date(state.last_visit_at)
      : null;
    const currentOrderDate = new Date(orderData.orderDate);
    
    const isRecentUpdate =
      lastVisitAt &&
      Math.abs(currentOrderDate.getTime() - lastVisitAt.getTime()) < 1000; // 1 second
    
    if (isRecentUpdate) {
      currentCount = currentStateCount;
    } else {
      if (currentStateCount === 0) {
        let dbCount = 0;
        if (cycle === VisitCycle.ALL_TIME || cycle === 'ALL_TIME') {
          dbCount = await this.prisma.lTYOrder.count({
            where: {
              cardId: card.id,
              orderStatus: { in: [OrderStatus.COMPLETED, OrderStatus.PAYED] },
            },
          });
        } else {
          const startDate = this.getCycleStartDate(cycle, now);
          dbCount = await this.prisma.lTYOrder.count({
            where: {
              cardId: card.id,
              orderStatus: { in: [OrderStatus.COMPLETED, OrderStatus.PAYED] },
              orderData: { gte: startDate },
            },
          });
        }
        currentCount = dbCount + 1;
      } else {
        currentCount = currentStateCount + 1;
      }
    }

    const conditionMet = this.compareValues(currentCount, operator, required);

    if (currentCount > required) {
      currentCount = 1;
      state.cycleStartedAt = orderData.orderDate;
    }

    state.visits_in_cycle = currentCount;
    state.required_visits = required;
    state.last_visit_at = orderData.orderDate;
    state.last_order_sum = orderData.orderSum || 0;

    return conditionMet;
  }

  private evaluatePurchaseAmount(
    condition: any,
    orderData: OrderEvaluationData,
  ): boolean {
    const operator = condition.operator || ConditionOperator.GREATER_THAN_OR_EQUAL;
    const required = condition.value;
    const orderAmount = orderData.orderSum || 0;

    return this.compareValues(orderAmount, operator, required);
  }

  private evaluateTimeRange(condition: any, orderData: OrderEvaluationData): boolean {
    if (!condition.start || !condition.end) {
      this.logger.warn(
        `Time range condition missing start or end: start=${condition.start}, end=${condition.end}`,
      );
      return false;
    }

    const startMatch = condition.start.match(/^(\d{1,2}):(\d{2})$/);
    const endMatch = condition.end.match(/^(\d{1,2}):(\d{2})$/);

    if (!startMatch || !endMatch) {
      this.logger.warn(
        `Invalid time format in condition: start=${condition.start}, end=${condition.end}`,
      );
      return false;
    }

    const startHours = parseInt(startMatch[1], 10);
    const startMinutes = parseInt(startMatch[2], 10);
    const endHours = parseInt(endMatch[1], 10);
    const endMinutes = parseInt(endMatch[2], 10);

    if (
      startHours < 0 ||
      startHours > 23 ||
      startMinutes < 0 ||
      startMinutes > 59 ||
      endHours < 0 ||
      endHours > 23 ||
      endMinutes < 0 ||
      endMinutes > 59
    ) {
      this.logger.warn(
        `Invalid time values in condition: start=${condition.start} (${startHours}:${startMinutes}), end=${condition.end} (${endHours}:${endMinutes})`,
      );
      return false;
    }

    const startTimeMinutes = startHours * 60 + startMinutes;
    const endTimeMinutes = endHours * 60 + endMinutes;

    const orderDate = new Date(orderData.orderDate);
    const orderHours = orderDate.getHours();
    const orderMinutes = orderDate.getMinutes();
    const orderTimeMinutes = orderHours * 60 + orderMinutes;

    let isInRange: boolean;
    if (startTimeMinutes > endTimeMinutes) {
      isInRange =
        orderTimeMinutes >= startTimeMinutes ||
        orderTimeMinutes <= endTimeMinutes;
    } else {
      isInRange =
        orderTimeMinutes >= startTimeMinutes &&
        orderTimeMinutes <= endTimeMinutes;
    }

    this.logger.debug(
      `Time range evaluation: condition start=${condition.start} (${startTimeMinutes}min), end=${condition.end} (${endTimeMinutes}min), order time=${orderHours.toString().padStart(2, '0')}:${orderMinutes.toString().padStart(2, '0')} (${orderTimeMinutes}min), result=${isInRange}`,
    );

    return isInRange;
  }

  private evaluateWeekday(condition: any, orderData: OrderEvaluationData): boolean {
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

  private async evaluatePromocodeEntry(
    condition: any,
    orderData: OrderEvaluationData,
  ): Promise<boolean> {
    if (!orderData.promoCodeId || !condition.code) {
      return false;
    }

    const promocode = await this.prisma.lTYPromocode.findUnique({
      where: { id: orderData.promoCodeId },
      select: { code: true, isActive: true },
    });

    if (!promocode || !promocode.isActive) {
      return false;
    }

    return promocode.code === condition.code;
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

  async getCampaignProgressState(
    campaignId: number,
    ltyUserId: number,
  ): Promise<{ state: Record<string, any>; cycleStartedAt: Date } | null> {
    const progress = await this.prisma.userCampaignProgress.findUnique({
      where: {
        campaignId_ltyUserId: {
          campaignId,
          ltyUserId,
        },
      },
    });

    if (!progress) {
      return null;
    }

    return {
      state: (progress.state as Record<string, any>) || {},
      cycleStartedAt: progress.cycleStartedAt,
    };
  }

  async simulateVisitCountIncrement(
    condition: any,
    ltyUserId: number,
    currentState: Record<string, any>,
    orderData: OrderEvaluationData,
    cardId?: number | null,
  ): Promise<Record<string, any>> {
    const cycle = condition.cycle || VisitCycle.ALL_TIME;
    const required = condition.value;
    const operator = condition.operator || ConditionOperator.GREATER_THAN_OR_EQUAL;

    if (required === undefined || required === null) {
      return currentState;
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
      return currentState;
    }

    const currentStateCount = currentState.visits_in_cycle || 0;
    const lastVisitAt = currentState.last_visit_at
      ? new Date(currentState.last_visit_at)
      : null;
    const currentOrderDate = new Date(orderData.orderDate);
    
    const isRecentUpdate =
      lastVisitAt &&
      Math.abs(currentOrderDate.getTime() - lastVisitAt.getTime()) < 1000; // 1 second
    
    if (isRecentUpdate) {
      currentCount = currentStateCount;
    } else {
      if (currentStateCount === 0) {
        let dbCount = 0;
        if (cycle === VisitCycle.ALL_TIME || cycle === 'ALL_TIME') {
          dbCount = await this.prisma.lTYOrder.count({
            where: {
              cardId: card.id,
              orderStatus: { in: [OrderStatus.COMPLETED, OrderStatus.PAYED] },
            },
          });
        } else {
          const startDate = this.getCycleStartDate(cycle, now);
          dbCount = await this.prisma.lTYOrder.count({
            where: {
              cardId: card.id,
              orderStatus: { in: [OrderStatus.COMPLETED, OrderStatus.PAYED] },
              orderData: { gte: startDate },
            },
          });
        }
        currentCount = dbCount + 1;
      } else {
        currentCount = currentStateCount + 1;
      }
    }

    const simulatedState = { ...currentState };
    
    if (currentCount > required) {
      simulatedState.visits_in_cycle = 1;
      simulatedState.cycleStartedAt = orderData.orderDate;
    } else {
      simulatedState.visits_in_cycle = currentCount;
    }
    
    simulatedState.required_visits = required;
    simulatedState.last_visit_at = orderData.orderDate;
    simulatedState.last_order_sum = orderData.orderSum || 0;

    return simulatedState;
  }

  async evaluateTransactionalCampaignDiscountPreview(
    campaign: MarketingCampaignWithRelations,
    ltyUserId: number,
    orderSum: number,
    orderDate: Date,
    rewardPointsUsed: number = 0,
    promoCodeId?: number | null,
    cardId?: number | null,
    simulatedState?: Record<string, any>,
  ): Promise<CampaignDiscountResult | null> {
    if (campaign.executionType !== CampaignExecutionType.TRANSACTIONAL) {
      return null;
    }

    if (!campaign.conditions || campaign.conditions.length === 0) {
      return null;
    }

    if (!campaign.action || campaign.action.actionType !== MarketingCampaignActionType.DISCOUNT) {
      return null;
    }

    const progress = await this.getCampaignProgressState(campaign.id, ltyUserId);
    
    const baseState = simulatedState || progress?.state || {};
    const updatedState = { ...baseState };

    const conditionTree = campaign.conditions[0].tree as CampaignConditionTree;
    const conditions = Array.isArray(conditionTree)
      ? conditionTree
      : [conditionTree];

    const progressConditions = conditions.filter(
      (cond) =>
        cond.type !== CampaignConditionType.TIME_RANGE &&
        cond.type !== CampaignConditionType.WEEKDAY &&
        cond.type !== CampaignConditionType.PROMOCODE_ENTRY &&
        cond.type !== CampaignConditionType.BIRTHDAY &&
        cond.type !== CampaignConditionType.INACTIVITY,
    );

    const orderData: OrderEvaluationData = {
      orderDate,
      orderSum,
      promoCodeId,
    };

    let allConditionsMet = true;

    for (const condition of progressConditions) {
      const isMet = await this.evaluateConditionPreview(
        condition,
        ltyUserId,
        orderData,
        updatedState,
        cardId,
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
        isEligible = await this.evaluatePromocodeEntry(condition, orderData);
      } else if (condition.type === CampaignConditionType.BIRTHDAY) {
        isEligible = await this.evaluateBirthday(condition, ltyUserId);
      }

      if (!isEligible) {
        break;
      }
    }

    if (allConditionsMet && isEligible) {
      const discountAmount = this.calculateDiscountFromAction(
        orderSum,
        campaign.action.payload as any,
        rewardPointsUsed,
      );

      if (discountAmount > 0) {
        return {
          discountAmount,
          campaignId: campaign.id,
          actionId: campaign.action.id,
          executionType: CampaignExecutionType.TRANSACTIONAL,
        };
      }
    }

    return null;
  }

  private async evaluateConditionPreview(
    condition: any,
    ltyUserId: number,
    orderData: OrderEvaluationData,
    state: Record<string, any>,
    cardId?: number | null,
  ): Promise<boolean> {
    switch (condition.type) {
      case CampaignConditionType.VISIT_COUNT:
        const currentCount = state.visits_in_cycle || 0;
        const required = condition.value;
        const operator = condition.operator || ConditionOperator.GREATER_THAN_OR_EQUAL;
        return this.compareValues(currentCount, operator, required);

      case CampaignConditionType.PURCHASE_AMOUNT:
        return this.evaluatePurchaseAmount(condition, orderData);

      default:
        return false;
    }
  }
}

