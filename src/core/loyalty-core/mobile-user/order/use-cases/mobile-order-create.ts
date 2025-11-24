import { Injectable, Inject } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { Order } from '@loyalty/order/domain/order';
import {
  OrderStatus,
  PlatformType,
  ContractType,
  OrderHandlerStatus,
} from '@loyalty/order/domain/enums';
import { DeviceType } from '@infra/pos/interface/pos.interface';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { PromoCodeService } from './promo-code-service';
import {
  IActivationWindowRepository,
  ActiveActivationWindow,
} from '../interface/activation-window-repository.interface';
import { ITariffRepository } from '../interface/tariff';
import {
  IFlowProducer,
  IFLOW_PRODUCER,
} from '@loyalty/order/interface/flow-producer.interface';
import {
  OrderValidationService,
  CashbackCalculationService,
  FreeVacuumValidationService,
  OrderStatusDeterminationService,
  DiscountCalculationService,
} from '@loyalty/order/domain/services';
import { CardNotFoundForOrderException } from '@loyalty/order/domain/exceptions';
import { CampaignRedemptionType, CampaignExecutionType } from '@prisma/client';
import { MarketingCampaignDiscountService } from './marketing-campaign-discount.service';

export interface CreateMobileOrderRequest {
  sum: number;
  sumBonus: number;
  carWashId: number;
  cardMobileUserId: number;
  carWashDeviceId: number;
  bayType?: DeviceType;
  promoCodeId?: number;
  rewardPointsUsed?: number;
}

export interface CreateMobileOrderResponse {
  orderId: number;
  status: OrderStatus;
}

@Injectable()
export class CreateMobileOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly promoCodeService: PromoCodeService,
    private readonly activationWindowRepository: IActivationWindowRepository,
    private readonly discountCalculationService: DiscountCalculationService,
    private readonly tariffRepository: ITariffRepository,
    private readonly orderValidationService: OrderValidationService,
    private readonly cashbackCalculationService: CashbackCalculationService,
    private readonly freeVacuumValidationService: FreeVacuumValidationService,
    private readonly orderStatusDeterminationService: OrderStatusDeterminationService,
    private readonly marketingCampaignDiscountService: MarketingCampaignDiscountService,
    @Inject(IFLOW_PRODUCER)
    private readonly flowProducer: IFlowProducer,
  ) {}

  async execute(
    request: CreateMobileOrderRequest,
  ): Promise<CreateMobileOrderResponse> {
    const carWashDeviceId = request.carWashDeviceId;

    await this.orderValidationService.validatePosStatus({
      posId: request.carWashId,
      carWashDeviceId: carWashDeviceId,
      bayType: request?.bayType ?? null,
    });

    const card = await this.findMethodsCardUseCase.getByClientId(
      request.cardMobileUserId,
    );

    if (!card) {
      throw new CardNotFoundForOrderException(request.cardMobileUserId);
    }

    const isFreeVacuum = this.orderStatusDeterminationService.isFreeVacuum({
      sum: request.sum,
      bayType: request?.bayType ?? null,
    });

    if (isFreeVacuum) {
      await this.freeVacuumValidationService.validateFreeVacuumAccess({
        card,
        orderDate: new Date(),
      });
    }

    const tariff = await this.tariffRepository.findCardTariff(card.id);
    const bonusPercent = tariff?.bonus ?? 0;
    const computedCashback = this.cashbackCalculationService.calculateCashback({
      sum: request.sum,
      bonusPercent,
    });

    const initialOrderStatus =
      this.orderStatusDeterminationService.determineInitialStatus({
        sum: request.sum,
        bayType: request?.bayType ?? null,
      });

    const order = new Order({
      sumFull: request.sum,
      sumReal: request.sum,
      sumBonus: request.sumBonus || 0,
      sumDiscount: 0,
      sumCashback: computedCashback,
      carWashDeviceId: carWashDeviceId,
      platform: PlatformType.ONVI,
      cardMobileUserId: card.id,
      typeMobileUser: ContractType.INDIVIDUAL,
      orderData: new Date(),
      createData: new Date(),
      orderStatus: initialOrderStatus,
      orderHandlerStatus: OrderHandlerStatus.CREATED,
    });

    const orderDate = new Date();

    const discountWindows =
      await this.activationWindowRepository.findDiscountActivationWindows(
        request.cardMobileUserId,
      );

    let activationWindowDiscount = 0;
    let usedActivationWindow: ActiveActivationWindow | null = null;
    if (discountWindows.length > 0) {
      const bestDiscount = this.discountCalculationService.calculateBestDiscount(
        {
          originalSum: request.sum,
          rewardPointsUsed: request.rewardPointsUsed || 0,
          discountWindows,
        },
      );
      if (bestDiscount) {
        activationWindowDiscount = bestDiscount.discountAmount;
        usedActivationWindow =
          discountWindows.find(
            (w) => w.id === bestDiscount.activationWindowId,
          ) || null;
      }
    }

    let transactionalCampaignDiscount = 0;
    let usedTransactionalCampaign: {
      campaignId: number;
      actionId: number;
      discountAmount: number;
    } | null = null;

    const eligibleCampaigns =
      await this.marketingCampaignDiscountService.findEligibleDiscountCampaigns(
        request.cardMobileUserId,
        orderDate,
      );

    const transactionalDiscounts: Array<{
      campaignId: number;
      actionId: number;
      discountAmount: number;
    }> = [];

    for (const campaign of eligibleCampaigns) {
      if (campaign.executionType === CampaignExecutionType.TRANSACTIONAL) {
        const discountResult =
          await this.marketingCampaignDiscountService.evaluateTransactionalCampaignDiscount(
            campaign,
            request.cardMobileUserId,
            request.sum,
            orderDate,
            request.rewardPointsUsed || 0,
            request.promoCodeId || null,
            card.id,
          );

        if (discountResult && discountResult.discountAmount > 0) {
          transactionalDiscounts.push({
            campaignId: discountResult.campaignId,
            actionId: discountResult.actionId,
            discountAmount: discountResult.discountAmount,
          });
        }
      }
    }

    if (transactionalDiscounts.length > 0) {
      const bestTransactional = transactionalDiscounts.reduce((best, current) =>
        current.discountAmount > best.discountAmount ? current : best,
      );
      transactionalCampaignDiscount = bestTransactional.discountAmount;
      usedTransactionalCampaign = bestTransactional;
    }

    let promoCodeDiscount = 0;
    if (request.promoCodeId) {
      promoCodeDiscount = await this.promoCodeService.applyPromoCode(
        request.promoCodeId,
        order,
        card,
        carWashDeviceId,
      );
    }

    const finalDiscount = Math.max(
      activationWindowDiscount,
      transactionalCampaignDiscount,
      promoCodeDiscount,
    );
    order.sumDiscount = finalDiscount;
    order.sumReal = request.sum - finalDiscount;

    const createdOrder = await this.orderRepository.create(order);

    if (finalDiscount > 0) {
      if (
        transactionalCampaignDiscount > 0 &&
        transactionalCampaignDiscount >= activationWindowDiscount &&
        transactionalCampaignDiscount >= promoCodeDiscount &&
        usedTransactionalCampaign
      ) {
        await this.activationWindowRepository.createUsage({
          campaignId: usedTransactionalCampaign.campaignId,
          actionId: usedTransactionalCampaign.actionId,
          ltyUserId: request.cardMobileUserId,
          orderId: createdOrder.id,
          posId: request.carWashId,
          type: CampaignRedemptionType.DISCOUNT,
        });
      } else if (
        activationWindowDiscount > 0 &&
        activationWindowDiscount >= promoCodeDiscount &&
        usedActivationWindow
      ) {
        await this.activationWindowRepository.createUsage({
          campaignId: usedActivationWindow.campaignId,
          actionId: usedActivationWindow.actionId,
          ltyUserId: request.cardMobileUserId,
          orderId: createdOrder.id,
          posId: request.carWashId,
          type: CampaignRedemptionType.DISCOUNT,
        });
      } else if (
        promoCodeDiscount > 0 &&
        request.promoCodeId
      ) {
        await this.promoCodeService.createPromoCodeUsage(
          request.promoCodeId,
          createdOrder.id,
          card,
          request.carWashId,
        );
      }
    }

    if (isFreeVacuum) {
      await this.flowProducer.add({
        name: 'order-finished',
        queueName: 'order-finished',
        data: { orderId: createdOrder.id },
        children: [
          {
            name: 'check-car-wash-started',
            queueName: 'check-car-wash-started',
            data: {
              orderId: createdOrder.id,
              carWashId: request.carWashId,
              carWashDeviceId: createdOrder.carWashDeviceId,
              bayType: request.bayType,
            },
            opts: {
              failParentOnFailure: false,
              ignoreDependencyOnFailure: true,
              attempts: 3,
              backoff: {
                type: 'fixed',
                delay: 5000,
              },
            },
            children: [
              {
                name: 'car-wash-launch',
                queueName: 'car-wash-launch',
                data: {
                  orderId: createdOrder.id,
                  carWashId: request.carWashId,
                  carWashDeviceId: createdOrder.carWashDeviceId,
                  bayType: request.bayType,
                },
                opts: {
                  failParentOnFailure: false,
                  ignoreDependencyOnFailure: true,
                  attempts: 3,
                  backoff: {
                    type: 'fixed',
                    delay: 5000,
                  },
                },
              },
            ],
          },
          {
            name: 'check-behavioral-campaigns',
            queueName: 'check-behavioral-campaigns',
            data: {
              orderId: createdOrder.id,
            },
            opts: {
              failParentOnFailure: false,
              ignoreDependencyOnFailure: true,
              attempts: 3,
              backoff: {
                type: 'fixed',
                delay: 5000,
              },
            },
          },
        ],
      });
    } else {
      // For non-free vacuum orders, still check behavioral campaigns
      await this.flowProducer.add({
        name: 'order-finished',
        queueName: 'order-finished',
        data: { orderId: createdOrder.id },
        children: [
          {
            name: 'check-behavioral-campaigns',
            queueName: 'check-behavioral-campaigns',
            data: {
              orderId: createdOrder.id,
            },
            opts: {
              failParentOnFailure: false,
              ignoreDependencyOnFailure: true,
              attempts: 3,
              backoff: {
                type: 'fixed',
                delay: 5000,
              },
            },
          },
        ],
      });
    }

    return {
      orderId: createdOrder.id,
      status: createdOrder.orderStatus,
    };
  }
}
