import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { Logger } from 'nestjs-pino';
import {
  IPosService,
  DeviceType,
  SendStatus,
} from '@infra/pos/interface/pos.interface';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';

@Injectable()
export class CarWashLaunchUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    @Inject(Logger) private readonly logger: Logger,
    private readonly posService: IPosService,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(
    orderId: number,
    carWashId: number,
    carWashDeviceId: number,
    bayType?: DeviceType,
  ): Promise<any> {
    const order = await this.orderRepository.findOneById(orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const isFreeVacuum = order.sumFull === 0 && bayType === DeviceType.VACUUME;

    if (!order.cardMobileUserId) {
      throw new BadRequestException(`Card not found for order ${order.id}`);
    }

    if (isFreeVacuum && order.orderStatus !== OrderStatus.FREE_PROCESSING) {
      throw new BadRequestException(
        `Invalid order state for order ${order.id}. Expected ${OrderStatus.FREE_PROCESSING}, got ${order.orderStatus}`,
      );
    } else if (!isFreeVacuum && order.orderStatus !== OrderStatus.PAYED) {
      throw new BadRequestException(
        `Invalid order state for order ${order.id}. Expected ${OrderStatus.PAYED}, got ${order.orderStatus}`,
      );
    }

    try {
      const card = await this.findMethodsCardUseCase.getById(
        order.cardMobileUserId,
      );
      if (!card) {
        throw new BadRequestException(
          `Card with ID ${order.cardMobileUserId} not found`,
        );
      }

      const bayDetails = await this.posService.ping({
        posId: carWashId,
        carWashDeviceId: carWashDeviceId,
        type: bayType ?? null,
      });

      if (bayDetails.status === 'Busy') {
        throw new Error('Bay is busy')
      }
  
      if (bayDetails.status === 'Unavailable') {
        throw new Error("Bay is unavailable")
      }

      const totalSum = (
        order.sumFull +
        (order.sumBonus || 0) +
        (order.sumDiscount || 0)
      ).toString();

      const carWashResponse = await this.posService.send({
        cardNumber: card.devNumber,
        sum: totalSum,
        deviceId: String(carWashDeviceId),
      });

      if (carWashResponse.sendStatus === SendStatus.FAIL) {
        throw new BadRequestException(
          `Failed to send start command: ${carWashResponse.errorMessage}`,
        );
      }

      this.logger.log(
        {
          orderId: order.id,
          action: 'carwash_launched',
          timestamp: new Date(),
          details: JSON.stringify(carWashResponse),
        },
        `Car wash launched for order ${order.id}`,
      );

      return {
        orderId: order.id,
        posStatus: carWashResponse.sendStatus,
        bayDetailsId: bayDetails.id,
      };
    } catch (error: any) {
      this.logger.log(
        {
          orderId: order.id,
          action: 'carwash_launch_failed',
          timestamp: new Date(),
          details: JSON.stringify({ error: error.message }),
        },
        `Car wash launch failed for order ${order.id}`,
      );
      throw error;
    }
  }
}
