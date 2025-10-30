import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { Logger } from 'nestjs-pino';
import { IPosService, DeviceType, SendStatus } from '@infra/pos/interface/pos.interface';
import { OrderStatus } from '@prisma/client';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';

@Injectable()
export class StartPosUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    @Inject(Logger) private readonly logger: Logger,
    private readonly posService: IPosService,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(orderId: number, carWashId: number, carWashDeviceId: number, bayType?: DeviceType): Promise<any> {
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
      const card = await this.findMethodsCardUseCase.getById(order.cardMobileUserId);
      if (!card) {
        throw new BadRequestException(`Card with ID ${order.cardMobileUserId} not found`);
      }

      const bayDetails = await this.posService.ping({
        posId: carWashId,
        // carWashDeviceId: carWashDeviceId,
        bayNumber: 1,
        type: bayType ?? null,
      });

      const totalSum = (
        order.sumFull +
        (order.sumBonus || 0) +
        (order.sumDiscount || 0)
      ).toString();

      const carWashResponse = await this.posService.send({
        cardNumber: card.devNumber,
        sum: totalSum,
        deviceId: bayDetails.id,
      });

      if (carWashResponse.sendStatus === SendStatus.FAIL) {
        throw new BadRequestException(
          `Failed to send start command: ${carWashResponse.errorMessage}`,
        );
      }

      const startSuccess: boolean = await this.verifyCarWashStartedRecursive(
        carWashId,
        carWashDeviceId,
        bayType ?? null,
        1,
      );

      if (!startSuccess) {
        throw new BadRequestException(
          'Car wash bay did not start after multiple verification attempts',
        );
      }

      order.orderStatus = OrderStatus.POS_PROCESSED;
      await this.orderRepository.update(order);

      this.logger.log(
        {
          orderId: order.id,
          action: 'order_completed',
          timestamp: new Date(),
          details: JSON.stringify(carWashResponse),
        },
        `Order completed ${order.id}`,
      );

      return {
        orderId: order.id,
        orderStatus: OrderStatus.POS_PROCESSED,
        posStatus: carWashResponse.sendStatus,
      };
    } catch (error: any) {
      this.logger.log(
        {
          orderId: order.id,
          action: 'carwash_start_failed',
          timestamp: new Date(),
          details: JSON.stringify({ error: error.message }),
        },
        `Order failed ${order.id}`,
      );
      throw error;
    }
  }

  private async verifyCarWashStartedRecursive(
    carWashId: number,
    carWashDeviceId: number,
    bayType: DeviceType | null,
    cycle: number,
  ): Promise<boolean> {
    const MAX_RETRY_CYCLES = 3;

    if (cycle > MAX_RETRY_CYCLES) {
      this.logger.error(
        {
          action: 'verify_carwash_failed_final',
          carWashId,
          carWashDeviceId,
          totalCycles: MAX_RETRY_CYCLES,
          timestamp: new Date(),
        },
        `Failed to verify car wash started after ${MAX_RETRY_CYCLES} cycles`,
      );
      return false;
    }

    const pingResult = await this.performPingAttempts(carWashId, carWashDeviceId,  bayType, cycle);

    if (pingResult.success) {
      this.logger.log(`Car wash verified as started on cycle ${cycle}`);
      return true;
    }

    if (cycle < MAX_RETRY_CYCLES) {
      this.logger.log(`Retrying verification after cycle ${cycle}`);
      await this.sleep(1000);
      return this.verifyCarWashStartedRecursive(carWashId, carWashDeviceId, bayType, cycle + 1);
    }

    return false;
  }

  private async performPingAttempts(
    carWashId: number,
    carWashDeviceId: number,
    bayType: DeviceType | null,
    cycle: number,
  ): Promise<{ success: boolean }> {
    const MAX_PING_ATTEMPTS = 5;
    const INITIAL_DELAY_MS = 2000;
    const DELAY_INCREMENT_MS = 1000;

    for (let pingAttempt = 1; pingAttempt <= MAX_PING_ATTEMPTS; pingAttempt++) {
      try {
        const pingResult = await this.posService.ping({
          posId: carWashId,
          // carWashDeviceId: carWashDeviceId,
          bayNumber: 1,
          type: bayType,
        });

        if (pingResult.status !== 'Free') {
          return { success: true };
        }

        if (pingAttempt < MAX_PING_ATTEMPTS) {
          const currentDelay =
            INITIAL_DELAY_MS + (pingAttempt - 1) * DELAY_INCREMENT_MS;
          await this.sleep(currentDelay);
        }
      } catch (error) {
        this.logger.error(
          `Error pinging car wash on cycle ${cycle}, ping ${pingAttempt}: ${error.message}`,
        );

        if (pingAttempt < MAX_PING_ATTEMPTS) {
          const currentDelay =
            INITIAL_DELAY_MS + (pingAttempt - 1) * DELAY_INCREMENT_MS;
          await this.sleep(currentDelay);
        }
      }
    }

    return { success: false };
  }

  private async sleep(ms: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

