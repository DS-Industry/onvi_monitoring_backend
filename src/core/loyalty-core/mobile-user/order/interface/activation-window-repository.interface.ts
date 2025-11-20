import {
  ActivationWindowStatus,
  MarketingCampaignActionType,
  CampaignRedemptionType,
} from '@prisma/client';

export interface ActiveActivationWindow {
  id: number;
  campaignId: number;
  actionId: number;
  startAt: Date;
  endAt: Date | null;
  status: ActivationWindowStatus;
  actionType: MarketingCampaignActionType;
  payload: any;
}

export interface CreateActivationWindowUsageInput {
  campaignId: number;
  actionId: number;
  ltyUserId: number;
  orderId: number;
  posId: number;
  type: CampaignRedemptionType;
}

export abstract class IActivationWindowRepository {
  abstract findActiveActivationWindows(
    ltyUserId: number,
  ): Promise<ActiveActivationWindow[]>;

  abstract findDiscountActivationWindows(
    ltyUserId: number,
  ): Promise<ActiveActivationWindow[]>;

  abstract findRewardActivationWindows(
    ltyUserId: number,
    actionTypes: MarketingCampaignActionType[],
  ): Promise<ActiveActivationWindow[]>;

  abstract createUsage(
    input: CreateActivationWindowUsageInput,
  ): Promise<void>;
}

