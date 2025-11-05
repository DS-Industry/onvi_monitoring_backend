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
import { ITariffRepository } from '../interface/tariff';
import { IFlowProducer, IFLOW_PRODUCER } from '@loyalty/order/interface/flow-producer.interface';
import {
  OrderValidationService,
  CashbackCalculationService,
  FreeVacuumValidationService,
  OrderStatusDeterminationService,
} from '@loyalty/order/domain/services';
import {
  CardNotFoundForOrderException,
} from '@loyalty/order/domain/exceptions';

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

    if (request.promoCodeId) {
      const discountAmount = await this.promoCodeService.applyPromoCode(
        request.promoCodeId,
        order,
        card,
        carWashDeviceId,
      );
      order.sumDiscount = discountAmount;
      order.sumReal = request.sum - discountAmount;
    }

    const createdOrder = await this.orderRepository.create(order);

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

