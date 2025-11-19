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
import { CampaignRedemptionType } from '@prisma/client';

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
      cardMobileUserId: request.cardMobileUserId,
      typeMobileUser: ContractType.INDIVIDUAL,
      orderData: new Date(),
      createData: new Date(),
      orderStatus: initialOrderStatus,
      orderHandlerStatus: OrderHandlerStatus.CREATED,
    });

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

    let promoCodeDiscount = 0;
    if (request.promoCodeId) {
      promoCodeDiscount = await this.promoCodeService.applyPromoCode(
        request.promoCodeId,
        order,
        card,
        carWashDeviceId,
      );
    }

    const finalDiscount = Math.max(activationWindowDiscount, promoCodeDiscount);
    order.sumDiscount = finalDiscount;
    order.sumReal = request.sum - finalDiscount;

    const createdOrder = await this.orderRepository.create(order);

    if (
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
        ],
      });
    }

    return {
      orderId: createdOrder.id,
      status: createdOrder.orderStatus,
    };
  }
}
