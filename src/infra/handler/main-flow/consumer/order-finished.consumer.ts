import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { HandlerOrderUseCase } from '@loyalty/order/use-cases/order-handler';
import { HandlerDto } from '@loyalty/order/use-cases/dto/handler.dto';

@Processor('order-finished')
@Injectable()
export class OrderFinishedConsumer extends WorkerHost {
  private readonly logger = new Logger(OrderFinishedConsumer.name);

  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
    private readonly handlerOrderUseCase: HandlerOrderUseCase,
  ) {
    super();
    this.logger.log('[ORDER-FINISHED] Consumer initialized');
  }

  async process(job: Job<any>): Promise<void> {
    const { orderId } = job.data;
    const startTime = new Date().toISOString();
    this.logger.log(
      `[ORDER-FINISHED] [${startTime}] START - Parent job ${job.id} for order#${orderId}`,
    );
    const order = await this.orderRepository.findOneById(orderId);
    if (!order) {
      this.logger.error(`[ORDER-FINISHED] Order#${orderId} not found`);
      throw new Error('Order not found');
    }

    let allChildrenSuccessful = false;

    try {
      const childrenResults = await job.getChildrenValues<any>();
      const childResultsArray = Object.values(childrenResults);

      if (childResultsArray.length > 0) {
        allChildrenSuccessful = childResultsArray.every(
          (result) => result === 'success',
        );

        if (!allChildrenSuccessful) {
          const failedResults = childResultsArray.filter(
            (result) => result !== 'success',
          );
          this.logger.warn(
            `[ORDER-FINISHED] Some child jobs failed for order#${orderId}. Failed results: ${JSON.stringify(failedResults)}`,
          );
        }
      } else {
        this.logger.warn(
          `[ORDER-FINISHED] No child results found for order#${orderId} - child jobs failed`,
        );
      }
    } catch (error: any) {
      this.logger.warn(
        `[ORDER-FINISHED] Child jobs failed for order#${orderId}: ${error.message}`,
      );
    }

    if (!allChildrenSuccessful) {
      order.orderStatus = OrderStatus.FAILED;
      await this.orderRepository.update(order);
      this.logger.warn(`[ORDER-FINISHED] Order#${orderId} marked as FAILED`);
    } else {
      await this.orderRepository.update(order);
      const endTime = new Date().toISOString();
      this.logger.log(
        `[ORDER-FINISHED] [${endTime}] END - Order#${orderId} marked as COMPLETED - all children successful`,
      );

      try {
        const handlerDto: HandlerDto = {
          transactionId: order.transactionId,
          sumFull: order.sumFull,
          sumReal: order.sumReal,
          sumBonus: order.sumBonus,
          sumDiscount: order.sumDiscount,
          sumCashback: order.sumCashback,
          carWashDeviceId: order.carWashDeviceId,
          platform: order.platform,
          orderData: order.orderData,
          typeMobileUser: order.typeMobileUser,
          cardMobileUserId: order.cardMobileUserId,
          orderStatus: order.orderStatus,
          sendAnswerStatus: order.sendAnswerStatus,
          sendTime: order.sendTime,
          debitingMoney: order.debitingMoney,
          executionStatus: order.executionStatus,
          reasonError: order.reasonError,
          executionError: order.executionError,
        };

        await this.handlerOrderUseCase.execute(handlerDto, undefined, order.id);
        this.logger.log(
          `[ORDER-FINISHED] Order#${orderId} processed by order handler`,
        );
      } catch (error: any) {
        this.logger.error(
          `[ORDER-FINISHED] Failed to process order#${orderId} with order handler: ${error.message}`,
        );
      }
    }
  }
}
