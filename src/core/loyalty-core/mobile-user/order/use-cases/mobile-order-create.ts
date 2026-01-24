import { Injectable, Inject, Logger } from '@nestjs/common';
import { IOrderRepository, OrderUsageData } from '@loyalty/order/interface/order';
import { Order } from '@loyalty/order/domain/order';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { DeviceType } from '@infra/pos/interface/pos.interface';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { ITariffRepository } from '../interface/tariff';
import {
  IFlowProducer,
  IFLOW_PRODUCER,
} from '@loyalty/order/interface/flow-producer.interface';
import {
  OrderValidationService,
  FreeVacuumValidationService,
  OrderStatusDeterminationService,
  OrderBuilderService,
  OrderDiscountService,
  OrderUsageDataService,
} from '@loyalty/order/domain/services';
import {
  CardNotFoundForOrderException,
  CardOwnershipException,
  InvalidOrderSumException,
  InvalidBonusSumException,
} from '@loyalty/order/domain/exceptions';
import { Card } from '@loyalty/mobile-user/card/domain/card';

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
    private readonly tariffRepository: ITariffRepository,
    private readonly orderValidationService: OrderValidationService,
    private readonly freeVacuumValidationService: FreeVacuumValidationService,
    private readonly orderStatusDeterminationService: OrderStatusDeterminationService,
    private readonly orderBuilderService: OrderBuilderService,
    private readonly orderDiscountService: OrderDiscountService,
    private readonly orderUsageDataService: OrderUsageDataService,
    @Inject(IFLOW_PRODUCER)
    private readonly flowProducer: IFlowProducer,
  ) {}

  async execute(
    request: CreateMobileOrderRequest,
  ): Promise<CreateMobileOrderResponse> {
    this.logger.log(
      `Starting order creation for user ${request.cardMobileUserId}, carWashId: ${request.carWashId}, sum: ${request.sum}`,
    );

    this.validateRequest(request);

    await this.orderValidationService.validatePosStatus({
      posId: request.carWashId,
      carWashDeviceId: request.carWashDeviceId,
      bayType: request?.bayType ?? null,
    });

    const card = await this.validateAndGetCard(request.cardMobileUserId);

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

    const order = await this.orderBuilderService.buildOrder(
      {
        sum: request.sum,
        carWashDeviceId: request.carWashDeviceId,
        bayType: request?.bayType ?? null,
      },
      card,
    );

    const orderDate = new Date();
    const discountResult = await this.orderDiscountService.calculateDiscounts(
      {
        cardMobileUserId: request.cardMobileUserId,
        carWashId: request.carWashId,
        sum: request.sum,
        orderDate,
        rewardPointsUsed: request.rewardPointsUsed || 0,
        promoCodeId: request.promoCodeId || null,
        bayType: request?.bayType ?? null,
      },
      order,
      card,
    );

    order.sumDiscount = discountResult.finalDiscount;
    order.sumBonus = request.rewardPointsUsed || 0;
    order.sumReal = Math.max(
      0,
      request.sum - discountResult.finalDiscount - (request.rewardPointsUsed || 0),
    );

    this.logger.log(
      `Order calculated - sumFull: ${order.sumFull}, sumDiscount: ${discountResult.finalDiscount}, sumReal: ${order.sumReal}`,
    );

    const usageData = this.orderUsageDataService.buildUsageData(
      discountResult,
      request.cardMobileUserId,
      request.carWashId,
      request.promoCodeId,
      card,
    );

    const createdOrder = await this.createOrder(
      order,
      usageData,
      request.cardMobileUserId,
    );

    if (isFreeVacuum) {
      await this.enqueueOrderFlow(createdOrder, request);
    }

    return {
      orderId: createdOrder.id,
      status: createdOrder.orderStatus,
    };
  }

  private validateRequest(request: CreateMobileOrderRequest): void {
    if (request.sum <= 0) {
      this.logger.warn(
        `Invalid order sum: ${request.sum} for user ${request.cardMobileUserId}`,
      );
      throw new InvalidOrderSumException(request.sum);
    }

    if (request.sumBonus < 0) {
      this.logger.warn(
        `Invalid bonus sum: ${request.sumBonus} for user ${request.cardMobileUserId}`,
      );
      throw new InvalidBonusSumException(request.sumBonus, request.sum, 'negative');
    }

    if (request.sumBonus > request.sum) {
      this.logger.warn(
        `Bonus sum ${request.sumBonus} exceeds order sum ${request.sum} for user ${request.cardMobileUserId}`,
      );
      throw new InvalidBonusSumException(request.sumBonus, request.sum, 'exceeds');
    }
  }

  private async validateAndGetCard(cardMobileUserId: number): Promise<Card> {
    const card = await this.findMethodsCardUseCase.getByClientId(
      cardMobileUserId,
    );

    if (!card) {
      this.logger.warn(`Card not found for user ${cardMobileUserId}`);
      throw new CardNotFoundForOrderException(cardMobileUserId);
    }

    if (card.mobileUserId !== cardMobileUserId) {
      this.logger.warn(
        `Authorization failed: Card ${card.id} does not belong to user ${cardMobileUserId}. Card owner: ${card.mobileUserId}`,
      );
      throw new CardOwnershipException(cardMobileUserId);
    }

    this.logger.debug(`Card ${card.id} verified for user ${cardMobileUserId}`);
    return card;
  }

  private async createOrder(
    order: Order,
    usageData: OrderUsageData | undefined,
    cardMobileUserId: number,
  ): Promise<Order> {
    try {
      const createdOrder = await this.orderRepository.createWithUsage(
        order,
        usageData,
      );

      this.logger.log(
        `Order created successfully: orderId=${createdOrder.id}, userId=${cardMobileUserId}, sum=${order.sumFull}, discount=${order.sumDiscount}`,
      );

      return createdOrder;
    } catch (error) {
      this.logger.error(
        `Error creating order for user ${cardMobileUserId}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private async enqueueOrderFlow(
    createdOrder: Order,
    request: CreateMobileOrderRequest,
  ): Promise<void> {
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

      this.logger.debug(
        `Flow producer job added for order ${createdOrder.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to enqueue flow producer for order ${createdOrder.id}: ${error.message}. Order was created successfully but flow processing may need manual intervention.`,
        error.stack,
      );
    }
  }
}
