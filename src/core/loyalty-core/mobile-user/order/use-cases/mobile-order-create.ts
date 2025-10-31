import { Injectable, BadRequestException } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { Order } from '@loyalty/order/domain/order';
import { OrderStatus, PlatformType, ContractType, OrderHandlerStatus } from '@prisma/client';
import { PrismaService } from '@db/prisma/prisma.service';
import { IPosService, DeviceType } from '@infra/pos/interface/pos.interface';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { PromoCodeService } from './promo-code-service';
import { ITariffRepository } from '../interface/tariff';
import { FlowProducer } from 'bullmq';

export interface CreateMobileOrderRequest {
  transactionId: string;
  sum: number;
  sumBonus: number;
  carWashId: number;
  cardMobileUserId: number;
  bayNumber: number;
  bayType?: DeviceType;
  promoCodeId?: number;
  rewardPointsUsed?: number;
}

export interface CreateMobileOrderResponse {
  orderId: number;
  status: OrderStatus;
  transactionId: string;
}

@Injectable()
export class CreateMobileOrderUseCase {
  private readonly flowProducer: FlowProducer;

  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly prisma: PrismaService,
    private readonly posService: IPosService,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly promoCodeService: PromoCodeService,
    private readonly tariffRepository: ITariffRepository,
  ) {
    this.flowProducer = new FlowProducer({
      connection: {
        host: process.env.REDIS_WORKER_DATA_HOST || process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_WORKER_DATA_PORT || process.env.REDIS_PORT || '6379', 10),
        username: process.env.REDIS_WORKER_DATA_USER,
        password: process.env.REDIS_WORKER_DATA_PASSWORD,
      },
    });
  }

  async execute(
    request: CreateMobileOrderRequest,
  ): Promise<CreateMobileOrderResponse> {
    const ping = await this.posService.ping({
      posId: request.carWashId,
      // carWashDeviceId: request.carWashDeviceId,
      bayNumber: 1,
      type: request?.bayType ?? null,
    });

    if (ping.status === 'Busy') {
      throw new BadRequestException('Bay is busy');
    }
    if (ping.status === 'Unavailable') {
      throw new BadRequestException('Carwash is unavailable');
    }

    const carWashDeviceId = Number(ping.id);

    const card = await this.findMethodsCardUseCase.getByClientId(
      request.cardMobileUserId,
    );

    if (!card) {
      throw new BadRequestException('Card not found for client');
    }

    const isFreeVacuum = request.sum === 0 && request.bayType === DeviceType.VACUUME;
    if (isFreeVacuum) {
      const todayUTC = new Date();
      todayUTC.setUTCHours(0, 0, 0, 0);
      const tomorrowUTC = new Date(todayUTC);
      tomorrowUTC.setUTCDate(todayUTC.getUTCDate() + 1);

      const orders = await this.orderRepository.findAllByFilter(
        todayUTC,
        tomorrowUTC,
        undefined,
        undefined,
        OrderStatus.COMPLETED,
        undefined,
        card.id,
        DeviceType.VACUUME,
      );

      const freeOperations = orders.filter((order) => order.sumFull === 0);
      const limit = card.monthlyLimit || 0;
      const remains = Math.max(0, limit - freeOperations.length);

      if (remains <= 0) {
        throw new BadRequestException('Insufficient free vacuum remaining');
      }
    }

    const tariff = await this.tariffRepository.findCardTariff(card.id);
    const bonusPercent = tariff?.bonus ?? 0;
    const cashbackRaw = (request.sum * bonusPercent) / 100;
    const computedCashback = cashbackRaw < 1 ? 0 : Math.ceil(cashbackRaw);

    const initialOrderStatus = isFreeVacuum 
      ? OrderStatus.FREE_PROCESSING 
      : OrderStatus.CREATED;

    const order = new Order({
      transactionId: request.transactionId,
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
            name: 'car-wash-launch',
            queueName: 'car-wash-launch',
            data: {
              orderId: createdOrder.id,
              carWashId: request.carWashId,
              carWashDeviceId: createdOrder.carWashDeviceId,
              bayType: request.bayType,
            },
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
              },
            ],
          },
        ],
      });
    }

    return {
      orderId: createdOrder.id,
      status: createdOrder.orderStatus,
      transactionId: createdOrder.transactionId,
    };
  }
}

