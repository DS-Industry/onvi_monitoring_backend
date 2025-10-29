import { Injectable, BadRequestException } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { Order } from '@loyalty/order/domain/order';
import { OrderStatus, PlatformType, ContractType, OrderHandlerStatus } from '@prisma/client';
import { PrismaService } from '@db/prisma/prisma.service';
import { IPosService, DeviceType } from '@infra/pos/interface/pos.interface';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';
import { PromoCodeService } from './promo-code-service';
import { ITariffRepository } from '../interface/tariff';

export interface CreateMobileOrderRequest {
  transactionId: string;
  sumFull: number;
  sumReal: number;
  sumBonus: number;
  sumDiscount: number;
  sumCashback: number;
  carWashId: number;
  carWashDeviceId: number;
  cardMobileUserId: number;
  bayNumber: number;
  bayType?: DeviceType;
  promoCodeId?: number;
  rewardPointsUsed?: number;
  originalSum?: number;
}

export interface CreateMobileOrderResponse {
  orderId: number;
  status: OrderStatus;
  transactionId: string;
}

@Injectable()
export class CreateMobileOrderUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly prisma: PrismaService,
    private readonly posService: IPosService,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
    private readonly promoCodeService: PromoCodeService,
    private readonly tariffRepository: ITariffRepository,
  ) {}

  async execute(
    request: CreateMobileOrderRequest,
  ): Promise<CreateMobileOrderResponse> {
    const ping = await this.posService.ping({
      posId: request.carWashId,
      bayNumber: request.bayNumber,
      type: request?.bayType ?? null,
    });

    if (ping.status === 'Busy') {
      throw new BadRequestException('Bay is busy');
    }
    if (ping.status === 'Unavailable') {
      throw new BadRequestException('Carwash is unavailable');
    }

    const carWashDevice = await this.prisma.carWashDevice.findUnique({
      where: { id: request.carWashDeviceId },
    });

    if (!carWashDevice) {
      throw new BadRequestException(
        `Car wash device with ID ${request.carWashDeviceId} not found`,
      );
    }

    const card = await this.findMethodsCardUseCase.getByClientId(
      request.cardMobileUserId,
    );

    if (!card) {
      throw new BadRequestException('Card not found for client');
    }

    const isFreeVacuum = request.sumFull === 0 && request.bayType === DeviceType.VACUUME;
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
    const cashbackRaw = (request.sumFull * bonusPercent) / 100;
    const computedCashback = cashbackRaw < 1 ? 0 : Math.ceil(cashbackRaw);

    const order = new Order({
      transactionId: request.transactionId,
      sumFull: request.sumFull,
      sumReal: request.sumReal,
      sumBonus: request.sumBonus || 0,
      sumDiscount: request.sumDiscount || 0,
      sumCashback: computedCashback,
      carWashDeviceId: request.carWashDeviceId,
      platform: PlatformType.ONVI,
      cardMobileUserId: request.cardMobileUserId,
      typeMobileUser: ContractType.INDIVIDUAL,
      orderData: new Date(),
      createData: new Date(),
      orderStatus: OrderStatus.CREATED,
      orderHandlerStatus: OrderHandlerStatus.CREATED,
    });

    if (request.promoCodeId) {
      const discountAmount = await this.promoCodeService.applyPromoCode(
        request.promoCodeId,
        order,
        card,
        request.carWashDeviceId,
      );
      order.sumDiscount = discountAmount;
      order.sumReal = request.sumReal - discountAmount;
    }

    const createdOrder = await this.orderRepository.create(order);

    return {
      orderId: createdOrder.id,
      status: createdOrder.orderStatus,
      transactionId: createdOrder.transactionId,
    };
  }
}

