import { Injectable } from '@nestjs/common';
import { PrismaService } from '@db/prisma/prisma.service';
import {
  IActivationWindowRepository,
  ActiveActivationWindow,
  CreateActivationWindowUsageInput,
} from '../interface/activation-window-repository.interface';
import {
  ActivationWindowStatus,
  MarketingCampaignActionType,
} from '@prisma/client';

@Injectable()
export class ActivationWindowRepository extends IActivationWindowRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async findActiveActivationWindows(
    ltyUserId: number,
  ): Promise<ActiveActivationWindow[]> {
    const now = new Date();

    const activationWindows = await this.prisma.activationWindow.findMany({
      where: {
        ltyUserId,
        status: ActivationWindowStatus.ACTIVE,
        startAt: {
          lte: now,
        },
        OR: [
          { endAt: null },
          { endAt: { gte: now } },
        ],
      },
      include: {
        action: true,
      },
      orderBy: {
        startAt: 'desc',
      },
    });

    return activationWindows.map((window) => ({
      id: window.id,
      campaignId: window.campaignId,
      actionId: window.actionId,
      startAt: window.startAt,
      endAt: window.endAt,
      status: window.status,
      actionType: window.action.actionType,
      payload: window.action.payload as any,
    }));
  }

  async findDiscountActivationWindows(
    ltyUserId: number,
  ): Promise<ActiveActivationWindow[]> {
    const activeWindows = await this.findActiveActivationWindows(ltyUserId);
    return activeWindows.filter(
      (window) => window.actionType === MarketingCampaignActionType.DISCOUNT,
    );
  }

  async createUsage(input: CreateActivationWindowUsageInput): Promise<void> {
    await this.prisma.marketingCampaignUsage.create({
      data: {
        campaignId: input.campaignId,
        actionId: input.actionId,
        ltyUserId: input.ltyUserId,
        orderId: input.orderId,
        posId: input.posId,
        type: input.type,
        usedAt: new Date(),
      },
    });
  }
}

