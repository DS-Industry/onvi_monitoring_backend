import { Injectable, BadRequestException } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { Order } from '@loyalty/order/domain/order';
import { OrderStatus, PlatformType, ContractType, OrderHandlerStatus } from '@prisma/client';
import { PrismaService } from '@db/prisma/prisma.service';

export interface CreateMobileOrderRequest {
  transactionId: string;
  sumFull: number;
  sumReal: number;
  sumBonus: number;
  sumDiscount: number;
  sumCashback: number;
  carWashDeviceId: number;
  cardMobileUserId: number;
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
  ) {}

  async execute(
    request: CreateMobileOrderRequest,
  ): Promise<CreateMobileOrderResponse> {
    const carWashDevice = await this.prisma.carWashDevice.findUnique({
      where: { id: request.carWashDeviceId },
    });

    if (!carWashDevice) {
      throw new BadRequestException(
        `Car wash device with ID ${request.carWashDeviceId} not found`,
      );
    }

    const order = new Order({
      transactionId: request.transactionId,
      sumFull: request.sumFull,
      sumReal: request.sumReal,
      sumBonus: request.sumBonus,
      sumDiscount: request.sumDiscount,
      sumCashback: request.sumCashback,
      carWashDeviceId: request.carWashDeviceId,
      platform: PlatformType.ONVI,
      cardMobileUserId: request.cardMobileUserId,
      typeMobileUser: ContractType.INDIVIDUAL,
      orderData: new Date(),
      createData: new Date(),
      orderStatus: OrderStatus.CREATED,
      orderHandlerStatus: OrderHandlerStatus.CREATED,
    });

    const createdOrder = await this.orderRepository.create(order);

    return {
      orderId: createdOrder.id,
      status: createdOrder.orderStatus,
      transactionId: createdOrder.transactionId,
    };
  }
}

