import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger, Inject } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { HandlerOrderUseCase } from '@loyalty/order/use-cases/order-handler';
import { HandlerDto } from '@loyalty/order/use-cases/dto/handler.dto';
import { OrderHandlerStatus } from '@loyalty/order/domain/enums';
import { OrderFinishedJobData, JobResult } from '@infra/handler/shared/job-data.types';
import { JobValidationUtil } from '@infra/handler/shared/job-validation.util';
import { Order } from '@loyalty/order/domain/order';

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

  async process(job: Job<OrderFinishedJobData>): Promise<void> {
    const { orderId, transactionId } = job.data;
    const startTime = JobValidationUtil.logJobStart(
      job.id,
      orderId,
      job.attemptsMade,
      job.opts?.attempts,
      job.parent?.id,
      { transactionId: transactionId || 'N/A' },
      this.logger,
      'ORDER-FINISHED',
    );
    
    JobValidationUtil.validateRequiredField(
      orderId,
      'orderId',
      job.id || 'unknown',
      this.logger,
      'ORDER-FINISHED',
    );

    const order = await this.validateAndFetchOrder(orderId, job.id);

    const { allChildrenSuccessful, childrenResults } =
      await this.getChildJobResults(job, orderId);

    if (!allChildrenSuccessful) {
      await this.handleFailedChildren(order, orderId, childrenResults);
    } else {
      await this.handleSuccessfulChildren(order, orderId);
    }
  }

  private async validateAndFetchOrder(
    orderId: number,
    jobId: string | undefined,
  ): Promise<Order> {
    this.logger.log(
      `[ORDER-FINISHED] Fetching order#${orderId} from repository`,
    );
    
    const order = await this.orderRepository.findOneById(orderId);
    if (!order) {
      const error = new Error(`Order#${orderId} not found`);
      this.logger.error(
        `[ORDER-FINISHED] ERROR - ${error.message} | Job ${jobId}`,
      );
      throw error;
    }

    this.logger.log(
      `[ORDER-FINISHED] Order#${order.id} found. Current status: ${order.orderStatus}, Handler status: ${order.orderHandlerStatus}`,
    );

    return order;
  }

  private async getChildJobResults(
    job: Job<OrderFinishedJobData>,
    orderId: number,
  ): Promise<{
    allChildrenSuccessful: boolean;
    childrenResults: Record<string, string>;
  }> {
    let allChildrenSuccessful = false;
    let childrenResults: Record<string, string> = {};

    try {
      this.logger.log(
        `[ORDER-FINISHED] Waiting for child jobs to complete and retrieving results...`,
      );
      
      childrenResults = await job.getChildrenValues<string>();
      const childResultsArray = Object.values(childrenResults);
      const childKeys = Object.keys(childrenResults);

      this.logger.log(
        `[ORDER-FINISHED] Received ${childResultsArray.length} child result(s). Child jobs: ${childKeys.join(', ')}`,
      );

      if (childResultsArray.length > 0) {
        allChildrenSuccessful = childResultsArray.every(
          (result) => result === JobResult.SUCCESS,
        );

        this.logger.log(
          `[ORDER-FINISHED] Child results analysis: ${JSON.stringify(childrenResults)}`,
        );

        if (!allChildrenSuccessful) {
          const failedResults = childResultsArray.filter(
            (result) => result !== JobResult.SUCCESS,
          );
          const failedKeys = childKeys.filter(
            (key) => childrenResults[key] !== JobResult.SUCCESS,
          );
          
          this.logger.warn(
            `[ORDER-FINISHED] Some child jobs failed for order#${orderId}. Failed jobs: ${failedKeys.join(', ')} | Failed results: ${JSON.stringify(failedResults)}`,
          );
        } else {
          this.logger.log(
            `[ORDER-FINISHED] All child jobs completed successfully for order#${orderId}`,
          );
        }
      } else {
        this.logger.warn(
          `[ORDER-FINISHED] No child results found for order#${orderId} - all child jobs may have failed or not completed`,
        );
      }
    } catch (error: any) {
      this.logger.error(
        `[ORDER-FINISHED] ERROR - Failed to retrieve child job results for order#${orderId}: ${error.message} | Stack: ${error.stack}`,
      );
    }

    return { allChildrenSuccessful, childrenResults };
  }

  private async handleFailedChildren(
    order: Order,
    orderId: number,
    childrenResults: Record<string, string>,
  ): Promise<void> {
    const errorTime = new Date().toISOString();
    order.orderHandlerStatus = OrderHandlerStatus.ERROR;
    
    this.logger.warn(
      `[ORDER-FINISHED] Updating order#${orderId} status to ERROR due to child job failures`,
    );
    
    await this.orderRepository.update(order);
    
    this.logger.warn(
      `[ORDER-FINISHED] [${errorTime}] FAILED - Order#${orderId} marked as ERROR. Child results: ${JSON.stringify(childrenResults)}`,
    );
  }

  private async handleSuccessfulChildren(
    order: Order,
    orderId: number,
  ): Promise<void> {
    this.logger.log(
      `[ORDER-FINISHED] All children successful. Updating order#${orderId} and calling order handler`,
    );
    
    await this.orderRepository.update(order);
    const endTime = new Date().toISOString();
    this.logger.log(
      `[ORDER-FINISHED] [${endTime}] SUCCESS - Order#${orderId} marked as COMPLETED - all children successful`,
    );

    await this.executeOrderHandler(order, orderId);
  }

  private async executeOrderHandler(
    order: Order,
    orderId: number,
  ): Promise<void> {
    try {
      this.logger.log(
        `[ORDER-FINISHED] Preparing handler DTO for order#${orderId}`,
      );
      
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

      this.logger.log(
        `[ORDER-FINISHED] Executing order handler for order#${orderId}`,
      );
      
      await this.handlerOrderUseCase.execute(handlerDto, undefined, order.id);
      
      this.logger.log(
        `[ORDER-FINISHED] Order#${orderId} successfully processed by order handler`,
      );
    } catch (error: any) {
      const handlerErrorTime = new Date().toISOString();
      this.logger.error(
        `[ORDER-FINISHED] [${handlerErrorTime}] ERROR - Failed to process order#${orderId} with order handler: ${error.message} | Stack: ${error.stack}`,
      );
    }
  }
}
