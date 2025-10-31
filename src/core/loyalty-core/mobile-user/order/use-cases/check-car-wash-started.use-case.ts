import { Injectable, BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { Logger } from 'nestjs-pino';
import { IPosService, DeviceType } from '@infra/pos/interface/pos.interface';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class CheckCarWashStartedUseCase {
  constructor(
    private readonly orderRepository: IOrderRepository,
    @Inject(Logger) private readonly logger: Logger,
    private readonly posService: IPosService,
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

    try {
      const startSuccess: boolean = await this.verifyCarWashStarted(
        carWashId,
        carWashDeviceId,
        bayType ?? null,
      );

      if (!startSuccess) {
        throw new BadRequestException(
          'Car wash bay did not start. Will retry via job queue.',
        );
      }

      order.orderStatus = OrderStatus.POS_PROCESSED;
      await this.orderRepository.update(order);

      this.logger.log(
        {
          orderId: order.id,
          action: 'order_completed',
          timestamp: new Date(),
        },
        `Order completed ${order.id}`,
      );

      return {
        orderId: order.id,
        orderStatus: OrderStatus.POS_PROCESSED,
      };
    } catch (error: any) {
      this.logger.log(
        {
          orderId: order.id,
          action: 'check_carwash_failed',
          timestamp: new Date(),
          details: JSON.stringify({ error: error.message }),
        },
        `Check car wash failed for order ${order.id}, will retry via queue`,
      );
      throw error;
    }
  }

  private async verifyCarWashStarted(
    carWashId: number,
    carWashDeviceId: number,
    bayType: DeviceType | null,
  ): Promise<boolean> {
    const MAX_PING_ATTEMPTS = 5;
    const INITIAL_DELAY_MS = 2000;
    const DELAY_INCREMENT_MS = 1000;

    for (let pingAttempt = 1; pingAttempt <= MAX_PING_ATTEMPTS; pingAttempt++) {
      try {
        const pingResult = await this.posService.ping({
          posId: carWashId,
          carWashDeviceId: carWashDeviceId,
          type: bayType,
        });

        if (pingResult.status !== 'Free') {
          this.logger.log(`Car wash verified as started on ping attempt ${pingAttempt}`);
          return true;
        }

        if (pingAttempt < MAX_PING_ATTEMPTS) {
          const currentDelay =
            INITIAL_DELAY_MS + (pingAttempt - 1) * DELAY_INCREMENT_MS;
          await this.sleep(currentDelay);
        }
      } catch (error) {
        this.logger.error(
          `Error pinging car wash on attempt ${pingAttempt}: ${error.message}`,
        );

        if (pingAttempt < MAX_PING_ATTEMPTS) {
          const currentDelay =
            INITIAL_DELAY_MS + (pingAttempt - 1) * DELAY_INCREMENT_MS;
          await this.sleep(currentDelay);
        }
      }
    }

    this.logger.warn(
      `Car wash verification failed after ${MAX_PING_ATTEMPTS} ping attempts`,
    );
    return false;
  }

  private async sleep(ms: number): Promise<unknown> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

