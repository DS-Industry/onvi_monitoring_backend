import { Injectable, Inject, Logger } from '@nestjs/common';
import { IOrderRepository, OrderUsageData } from '@loyalty/order/interface/order';
import { Order } from '@loyalty/order/domain/order';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { DeviceType } from '@infra/pos/interface/pos.interface';
import {
  IFlowProducer,
  IFLOW_PRODUCER,
} from '@loyalty/order/interface/flow-producer.interface';
import {
  OrderValidationService,
  FreeVacuumValidationService,
  OrderStatusDeterminationService,
  OrderUsageDataService,
  OrderPreparationService,
} from '@loyalty/order/domain/services';
import {
  CardOwnershipException,
  InvalidOrderSumException,
  InvalidBonusSumException,
} from '@loyalty/order/domain/exceptions';

export interface CreateMobileOrderRequest {
  sum: number;
  sumBonus: number;
  carWashId: number;
  clientId: number;
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
    private readonly orderValidationService: OrderValidationService,
    private readonly freeVacuumValidationService: FreeVacuumValidationService,
    private readonly orderStatusDeterminationService: OrderStatusDeterminationService,
    private readonly orderPreparationService: OrderPreparationService,
    private readonly orderUsageDataService: OrderUsageDataService,
    @Inject(IFLOW_PRODUCER)
    private readonly flowProducer: IFlowProducer,
  ) {}

  async execute(
    request: CreateMobileOrderRequest,
  ): Promise<CreateMobileOrderResponse> {
    this.logger.log(
      `Starting order creation for user ${request.clientId}, carWashId: ${request.carWashId}, sum: ${request.sum}`,
    );

    this.validateRequest(request);

    await this.orderValidationService.validatePosStatus({
      posId: request.carWashId,
      carWashDeviceId: request.carWashDeviceId,
      bayType: request?.bayType ?? null,
    });

    const { card, order, discountResult, totals } =
      await this.orderPreparationService.prepareOrderWithTotals(
        {
          clientId: request.clientId,
          sum: request.sum,
          carWashId: request.carWashId,
          carWashDeviceId: request.carWashDeviceId,
          bayType: request?.bayType ?? null,
          promoCodeId: request.promoCodeId,
          rewardPointsUsed: request.rewardPointsUsed,
        },
      );

    if (card.mobileUserId !== request.clientId) {
      this.logger.warn(
        `Authorization failed: Card ${card.id} does not belong to user ${request.clientId}. Card owner: ${card.mobileUserId}`,
      );
      throw new CardOwnershipException(request.clientId);
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

    order.sumDiscount = totals.sumDiscount;
    order.sumBonus = totals.sumBonus;
    order.sumReal = totals.sumReal;
    order.sumCashback = totals.sumCashback;

    this.logger.log(
      `Order calculated - sumFull: ${order.sumFull}, sumDiscount: ${totals.sumDiscount}, sumReal: ${totals.sumReal}, sumCashback: ${totals.sumCashback}`,
    );

    const usageData = this.orderUsageDataService.createUsageTrackingData(
      discountResult,
      request.clientId,
      request.carWashId,
      request.promoCodeId,
      card,
    );

    const createdOrder = await this.createOrder(
      order,
      usageData,
      request.clientId,
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
        `Invalid order sum: ${request.sum} for user ${request.clientId}`,
      );
      throw new InvalidOrderSumException(request.sum);
    }

    if (request.sumBonus < 0) {
      this.logger.warn(
        `Invalid bonus sum: ${request.sumBonus} for user ${request.clientId}`,
      );
      throw new InvalidBonusSumException(request.sumBonus, request.sum, 'negative');
    }

    if (request.sumBonus > request.sum) {
      this.logger.warn(
        `Bonus sum ${request.sumBonus} exceeds order sum ${request.sum} for user ${request.clientId}`,
      );
      throw new InvalidBonusSumException(request.sumBonus, request.sum, 'exceeds');
    }
  }


  private async createOrder(
    order: Order,
    usageData: OrderUsageData | undefined,
    clientId: number,
  ): Promise<Order> {
    try {
      const createdOrder = await this.orderRepository.createWithUsage(
        order,
        usageData,
      );

      this.logger.log(
        `Order created successfully: orderId=${createdOrder.id}, userId=${clientId}, sum=${order.sumFull}, discount=${order.sumDiscount}`,
      );

      return createdOrder;
    } catch (error) {
      this.logger.error(
        `Error creating order for user ${clientId}: ${error.message}`,
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
