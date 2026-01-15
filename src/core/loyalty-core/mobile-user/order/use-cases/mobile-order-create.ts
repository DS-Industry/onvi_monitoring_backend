import { Injectable, Inject, Logger } from '@nestjs/common';
import { IOrderRepository, OrderUsageData } from '@loyalty/order/interface/order';
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
import {
  CardNotFoundForOrderException,
  CardOwnershipException,
} from '@loyalty/order/domain/exceptions';
import { CampaignExecutionType } from '@prisma/client';
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
  private readonly logger = new Logger(CreateMobileOrderUseCase.name);

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
    this.logger.log(
      `Starting order creation for user ${request.cardMobileUserId}, carWashId: ${request.carWashId}, sum: ${request.sum}`,
    );

    if (request.sum <= 0) {
      this.logger.warn(
        `Invalid order sum: ${request.sum} for user ${request.cardMobileUserId}`,
      );
      throw new Error('Order sum must be greater than zero');
    }

    if (request.sumBonus < 0) {
      this.logger.warn(
        `Invalid bonus sum: ${request.sumBonus} for user ${request.cardMobileUserId}`,
      );
      throw new Error('Bonus sum cannot be negative');
    }

    if (request.sumBonus > request.sum) {
      this.logger.warn(
        `Bonus sum ${request.sumBonus} exceeds order sum ${request.sum} for user ${request.cardMobileUserId}`,
      );
      throw new Error('Bonus sum cannot exceed order sum');
    }

    const carWashDeviceId = request.carWashDeviceId;
    const carWashId = request.carWashId;

    await this.orderValidationService.validatePosStatus({
      posId: carWashId,
      carWashDeviceId: carWashDeviceId,
      bayType: request?.bayType ?? null,
    });

    const card = await this.findMethodsCardUseCase.getByClientId(
      request.cardMobileUserId,
    );

    if (!card) {
      this.logger.warn(
        `Card not found for user ${request.cardMobileUserId}`,
      );
      throw new CardNotFoundForOrderException(request.cardMobileUserId);
    }

    if (card.mobileUserId !== request.cardMobileUserId) {
      this.logger.warn(
        `Authorization failed: Card ${card.id} does not belong to user ${request.cardMobileUserId}. Card owner: ${card.mobileUserId}`,
      );
      throw new CardOwnershipException(request.cardMobileUserId);
    }

    this.logger.debug(
      `Card ${card.id} verified for user ${request.cardMobileUserId}`,
    );

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

    // TODO: Uncomment this when we have activation windows ready
    // const discountWindows =
    //   await this.activationWindowRepository.findDiscountActivationWindows(
    //     request.cardMobileUserId,
    //   );

    // let activationWindowDiscount = 0;
    // let usedActivationWindow: ActiveActivationWindow | null = null;
    // if (discountWindows.length > 0) {
    //   const bestDiscount = this.discountCalculationService.calculateBestDiscount(
    //     {
    //       originalSum: request.sum,
    //       rewardPointsUsed: request.rewardPointsUsed || 0,
    //       discountWindows,
    //     },
    //   );
    //   if (bestDiscount) {
    //     activationWindowDiscount = bestDiscount.discountAmount;
    //     usedActivationWindow =
    //       discountWindows.find(
    //         (w) => w.id === bestDiscount.activationWindowId,
    //       ) || null;
    //   }
    // }

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
        carWashId,
      );


    this.logger.debug(
      `Found ${eligibleCampaigns.length} eligible campaigns for user ${request.cardMobileUserId}`,
    );

    await this.marketingCampaignDiscountService.trackVisitCountsForEligibleCampaigns(
      eligibleCampaigns,
      request.cardMobileUserId,
      orderDate,
      request.sum,
      card.id,
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

      this.logger.debug(
        `Best transactional campaign discount: ${transactionalCampaignDiscount} for campaign ${bestTransactional.campaignId}`,
      );
    }

    let promoCodeDiscount = 0;
    if (request.promoCodeId) {
      promoCodeDiscount = await this.promoCodeService.applyPromoCode(
        request.promoCodeId,
        order,
        card,
        carWashId,
      );

      this.logger.debug(
        `Promo code discount applied: ${promoCodeDiscount} for promoCodeId ${request.promoCodeId}`,
      );
    }

    const finalDiscount = Math.max(
      // activationWindowDiscount,
      transactionalCampaignDiscount,
      promoCodeDiscount,
    );
    order.sumDiscount = finalDiscount;
    order.sumReal = Math.max(0, request.sum - finalDiscount);

    this.logger.log(
      `Order calculated - sumFull: ${order.sumFull}, sumDiscount: ${finalDiscount}, sumReal: ${order.sumReal}`,
    );

    let usageData: OrderUsageData | undefined;
    if (finalDiscount > 0) {
      if (
        transactionalCampaignDiscount > 0 &&
        transactionalCampaignDiscount >= promoCodeDiscount &&
        usedTransactionalCampaign
      ) {
        usageData = {
          transactionalCampaign: {
            campaignId: usedTransactionalCampaign.campaignId,
            actionId: usedTransactionalCampaign.actionId,
            ltyUserId: request.cardMobileUserId,
            posId: carWashId,
          },
        };

        this.logger.debug(
          `Prepared campaign usage data for campaign ${usedTransactionalCampaign.campaignId}`,
        );
      } else if (promoCodeDiscount > 0 && request.promoCodeId) {
        usageData = {
          promoCode: {
            promoCodeId: request.promoCodeId,
            ltyUserId: card.mobileUserId || 0,
            posId: carWashId,
          },
        };

        this.logger.debug(
          `Prepared promo code usage data for promoCodeId ${request.promoCodeId}`,
        );
      }
    }

    let createdOrder: Order;
    try {
      createdOrder = await this.orderRepository.createWithUsage(
        order,
        usageData,
      );

      this.logger.log(
        `Order created successfully: orderId=${createdOrder.id}, userId=${request.cardMobileUserId}, sum=${order.sumFull}, discount=${finalDiscount}`,
      );
    } catch (error) {
      this.logger.error(
        `Error creating order for user ${request.cardMobileUserId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }

    if (isFreeVacuum) {
      try {
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
                carWashId: carWashId,
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
                    carWashId: carWashId,
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
            // TODO: Uncomment this when we have activation windows ready
            // {
            //   name: 'check-behavioral-campaigns',
            //   queueName: 'check-behavioral-campaigns',
            //   data: {
            //     orderId: createdOrder.id,
            //   },
            //   opts: {
            //     failParentOnFailure: false,
            //     ignoreDependencyOnFailure: true,
            //     attempts: 3,
            //     backoff: {
            //       type: 'fixed',
            //       delay: 5000,
            //     },
            //   },
            // },
          ],
        });

        this.logger.debug(
          `Flow producer job added for order ${createdOrder.id}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to add order ${createdOrder.id} to flow producer: ${error.message}`,
        );
      }
    } 
    // TODO: Uncomment this when we have activation windows ready
    // else {
    //   // For non-free vacuum orders, still check behavioral campaigns
    //   await this.flowProducer.add({
    //     name: 'order-finished',
    //     queueName: 'order-finished',
    //     data: { orderId: createdOrder.id },
    //     children: [
    //       {
    //         name: 'check-behavioral-campaigns',
    //         queueName: 'check-behavioral-campaigns',
    //         data: {
    //           orderId: createdOrder.id,
    //         },
    //         opts: {
    //           failParentOnFailure: false,
    //           ignoreDependencyOnFailure: true,
    //           attempts: 3,
    //           backoff: {
    //             type: 'fixed',
    //             delay: 5000,
    //           },
    //         },
    //       },
    //     ],
    //   });
    // }

    return {
      orderId: createdOrder.id,
      status: createdOrder.orderStatus,
    };
  }
}
