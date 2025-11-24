import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { CreateCardBonusOperUseCase } from '@loyalty/mobile-user/bonus/cardBonusOper/cardBonusOper/use-case/cardBonusOper-create';
import {
  CASHBACK_BONUSES_OPER_TYPE_ID,
} from '@constant/constants';
import { MarketingCampaignRewardService } from './marketing-campaign-reward.service';
import {
  IActivationWindowRepository,
} from '../interface/activation-window-repository.interface';
import {
  MarketingCampaignActionType,
  CampaignRedemptionType,
} from '@prisma/client';
import { PrismaService } from '@db/prisma/prisma.service';

@Injectable()
export class ApplyMarketingCampaignRewardsUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly createCardBonusOperUseCase: CreateCardBonusOperUseCase,
    private readonly marketingCampaignRewardService: MarketingCampaignRewardService,
    private readonly activationWindowRepository: IActivationWindowRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(orderId: number): Promise<void> {
    const order = await this.orderRepository.findOneById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
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
    const baseCashback = order.sumCashback;

    const device = await this.prisma.carWashDevice.findUnique({
      where: { id: order.carWashDeviceId },
      select: { carWashPosId: true },
    });
    const posId = device?.carWashPosId;
    const rewardWindows =
      await this.activationWindowRepository.findRewardActivationWindows(
        ltyUserId,
        [
          MarketingCampaignActionType.CASHBACK_BOOST,
          MarketingCampaignActionType.GIFT_POINTS,
        ],
      );

    const rewardResults: Array<{
      campaignId: number;
      actionId: number;
      rewardAmount: number;
      actionType: MarketingCampaignActionType;
      activationWindowId?: number;
      executionType: string;
    }> = [];

    for (const window of rewardWindows) {
      const result =
        this.marketingCampaignRewardService.evaluateActivationWindowReward(
          window,
          orderSum,
          baseCashback,
        );
      if (result) {
        rewardResults.push({
          campaignId: result.campaignId,
          actionId: result.actionId,
          rewardAmount: result.rewardAmount,
          actionType: result.actionType,
          activationWindowId: result.activationWindowId,
          executionType: result.executionType,
        });
      }
    }

    const bestCashbackBoost = rewardResults
      .filter((r) => r.actionType === MarketingCampaignActionType.CASHBACK_BOOST)
      .reduce(
        (best, current) =>
          current.rewardAmount > best.rewardAmount ? current : best,
        { rewardAmount: 0 } as typeof rewardResults[0],
      );

    const bestGiftPoints = rewardResults
      .filter((r) => r.actionType === MarketingCampaignActionType.GIFT_POINTS)
      .reduce(
        (best, current) =>
          current.rewardAmount > best.rewardAmount ? current : best,
        { rewardAmount: 0 } as typeof rewardResults[0],
      );

    console.log({ bestCashbackBoost, bestGiftPoints });

    if (bestCashbackBoost.rewardAmount > 0) {
      await this.createCardBonusOperUseCase.execute(
        {
          typeOperId: CASHBACK_BONUSES_OPER_TYPE_ID,
          operDate: orderDate,
          sum: bestCashbackBoost.rewardAmount,
          orderMobileUserId: order.id,
          comment: `Marketing campaign cashback boost: Campaign ${bestCashbackBoost.campaignId}`,
        },
        card,
      );

        if (posId) {
          await this.activationWindowRepository.createUsage({
            campaignId: bestCashbackBoost.campaignId,
            actionId: bestCashbackBoost.actionId,
            ltyUserId: ltyUserId,
            orderId: order.id,
            posId: posId,
            type: CampaignRedemptionType.CASHBACK,
          });
        }
    }

    if (bestGiftPoints.rewardAmount > 0) {
      await this.createCardBonusOperUseCase.execute(
        {
          typeOperId: CASHBACK_BONUSES_OPER_TYPE_ID,
          operDate: orderDate,
          sum: bestGiftPoints.rewardAmount,
          orderMobileUserId: order.id,
          comment: `Marketing campaign gift points: Campaign ${bestGiftPoints.campaignId}`,
        },
        card,
      );

        if (posId) {
          await this.activationWindowRepository.createUsage({
            campaignId: bestGiftPoints.campaignId,
            actionId: bestGiftPoints.actionId,
            ltyUserId: ltyUserId,
            orderId: order.id,
            posId: posId,
            type: CampaignRedemptionType.GIFT_POINTS,
          });
        }
    }
  }
}

