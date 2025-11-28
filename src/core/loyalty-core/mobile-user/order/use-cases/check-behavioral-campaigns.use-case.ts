import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import {
  MarketingCampaignStatus,
  CampaignExecutionType,
  ActivationWindowStatus,
  OrderStatus as PrismaOrderStatus,
} from '@prisma/client';
import { CampaignConditionTree } from '@loyalty/marketing-campaign/domain/schemas/condition-tree.schema';
import {
  CampaignConditionType,
  ConditionOperator,
  VisitCycle,
} from '@loyalty/marketing-campaign/domain/enums/condition-type.enum';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { IActivationWindowRepository } from '../interface/activation-window-repository.interface';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';

export interface OrderEvaluationData {
  orderDate: Date;
  orderSum: number;
  promoCodeId?: number | null;
}

@Injectable()
export class CheckBehavioralCampaignsUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activationWindowRepository: IActivationWindowRepository,
    private readonly orderRepository: IOrderRepository,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(orderId: number): Promise<void> {
    const order = await this.orderRepository.findOneById(orderId);

    if (!order) {
      return;
    }

    if (!order.cardMobileUserId) {
      return;
    }

    const card = await this.findMethodsCardUseCase.getById(
      order.cardMobileUserId,
    );

    if (!card || !card.mobileUserId) {
      return;
    }

    const ltyUserId = card.mobileUserId;
    const orderDate = order.orderData;
    const orderSum = order.sumReal;

    // Get organizationId from card using Prisma
    const cardWithOrg = await this.prisma.lTYCard.findUnique({
      where: { id: order.cardMobileUserId },
      select: { organizationId: true },
    });

    const organizationId = cardWithOrg?.organizationId || null;

    // Find eligible behavioral campaigns
    const eligibleCampaigns = await this.findEligibleBehavioralCampaigns(
      ltyUserId,
      organizationId,
      orderDate,
    );

    // Filter out campaigns where user already has active activation windows
    const campaignsWithoutActiveWindows = await this.filterCampaignsWithoutActiveWindows(
      eligibleCampaigns,
      ltyUserId,
    );

    // Check conditions for each campaign and create activation windows if all conditions are met
    for (const campaign of campaignsWithoutActiveWindows) {
      const allConditionsMet = await this.evaluateCampaignConditions(
        campaign,
        ltyUserId,
        orderSum,
        orderDate,
        order.cardMobileUserId,
        orderId,
        organizationId,
      );

      if (allConditionsMet) {
        await this.createActivationWindow(campaign, ltyUserId);
      }
    }
  }

  private async findEligibleBehavioralCampaigns(
    ltyUserId: number,
    organizationId: number | null,
    orderDate: Date,
  ): Promise<any[]> {
    const now = orderDate;

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
            executionType: CampaignExecutionType.BEHAVIORAL,
            launchDate: { lte: now },
            OR: [{ endDate: null }, { endDate: { gte: now } }],
            activeDays: { not: null },
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

  private async filterCampaignsWithoutActiveWindows(
    campaigns: any[],
    ltyUserId: number,
  ): Promise<any[]> {
    const activeWindows = await this.activationWindowRepository.findActiveActivationWindows(
      ltyUserId,
    );

    const activeCampaignIds = new Set(
      activeWindows.map((w) => w.campaignId),
    );

    return campaigns.filter((c) => !activeCampaignIds.has(c.id));
  }

  private async evaluateCampaignConditions(
    campaign: any,
    ltyUserId: number,
    orderSum: number,
    orderDate: Date,
    cardId: number,
    orderId: number,
    organizationId: number | null,
  ): Promise<boolean> {
    if (!campaign.conditions || campaign.conditions.length === 0) {
      // If no conditions, all conditions are met
      return true;
    }

    const conditionTree = campaign.conditions[0].tree as CampaignConditionTree;
    const conditions = Array.isArray(conditionTree)
      ? conditionTree
      : [conditionTree];

    // Filter out eligibility conditions (these are checked at order time, not for activation windows)
    const progressConditions = conditions.filter(
      (cond) =>
        cond.type !== CampaignConditionType.TIME_RANGE &&
        cond.type !== CampaignConditionType.WEEKDAY &&
        cond.type !== CampaignConditionType.PROMOCODE_ENTRY &&
        cond.type !== CampaignConditionType.BIRTHDAY &&
        cond.type !== CampaignConditionType.INACTIVITY, // INACTIVITY is handled by cron jobs
    );

    if (progressConditions.length === 0) {
      // If only eligibility conditions, all progress conditions are met
      return true;
    }

    const orderData: OrderEvaluationData = {
      orderDate,
      orderSum,
    };

    // Get or create progress
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

    // Update progress state
    await this.prisma.userCampaignProgress.update({
      where: {
        id: progress.id,
      },
      data: {
        state: updatedState,
        updatedAt: new Date(),
      },
    });

    return allConditionsMet;
  }

  private async evaluateCondition(
    condition: any,
    ltyUserId: number,
    orderData: OrderEvaluationData,
    state: Record<string, any>,
    cardId: number,
    orderId: number,
  ): Promise<boolean> {
    switch (condition.type) {
      case CampaignConditionType.VISIT_COUNT:
        return this.evaluateVisitCount(
          condition,
          ltyUserId,
          state,
          orderData,
          cardId,
          orderId,
        );

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
    cardId: number,
    orderId: number,
  ): Promise<boolean> {
    const cycle = condition.cycle || VisitCycle.ALL_TIME;
    const required = condition.value;
    const operator =
      condition.operator || ConditionOperator.GREATER_THAN_OR_EQUAL;

    if (required === undefined || required === null) {
      return false;
    }

    let currentCount = 0;
    const now = new Date();

    const card = await this.prisma.lTYCard.findUnique({
      where: { id: cardId },
    });

    if (!card) {
      return false;
    }

    // Get current order status first
    const currentOrder = await this.orderRepository.findOneById(orderId);

    const isCurrentOrderCompleted =
      currentOrder &&
      [OrderStatus.COMPLETED, OrderStatus.PAYED].includes(
        currentOrder.orderStatus,
      );

    // Count completed orders, excluding the current order to avoid double-counting
    if (cycle === VisitCycle.ALL_TIME || cycle === 'ALL_TIME') {
      currentCount = await this.prisma.lTYOrder.count({
        where: {
          cardId: card.id,
          id: { not: orderId }, // Exclude current order
          orderStatus: { in: [PrismaOrderStatus.COMPLETED, PrismaOrderStatus.PAYED] },
        },
      });
    } else {
      const startDate = this.getCycleStartDate(cycle, now);
      currentCount = await this.prisma.lTYOrder.count({
        where: {
          cardId: card.id,
          id: { not: orderId }, // Exclude current order
          orderStatus: { in: [PrismaOrderStatus.COMPLETED, PrismaOrderStatus.PAYED] },
          orderData: { gte: startDate },
        },
      });
    }

    // Add current order if it's completed
    if (isCurrentOrderCompleted) {
      currentCount += 1;
    }

    state.visits_in_cycle = currentCount;
    state.required_visits = required;
    state.last_visit_at = orderData.orderDate;

    return this.compareValues(currentCount, operator, required);
  }

  private evaluatePurchaseAmount(
    condition: any,
    orderData: OrderEvaluationData,
  ): boolean {
    const operator =
      condition.operator || ConditionOperator.GREATER_THAN_OR_EQUAL;
    const required = condition.value;
    const orderAmount = orderData.orderSum || 0;

    return this.compareValues(orderAmount, operator, required);
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

  private async createActivationWindow(
    campaign: any,
    ltyUserId: number,
  ): Promise<void> {
    if (!campaign.action || !campaign.activeDays) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + campaign.activeDays - 1);
    endDate.setHours(23, 59, 59, 999);

    // Check if activation window already exists
    const existingWindow = await this.prisma.activationWindow.findFirst({
      where: {
        ltyUserId: ltyUserId,
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
      return;
    }

    const now = new Date();
    const windowStatus =
      today <= now
        ? ActivationWindowStatus.ACTIVE
        : ActivationWindowStatus.PENDING;

    await this.prisma.activationWindow.create({
      data: {
        ltyUserId: ltyUserId,
        campaignId: campaign.id,
        actionId: campaign.action.id,
        startAt: today,
        endAt: endDate,
        status: windowStatus,
      },
    });
  }
}

