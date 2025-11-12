import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { Order, OrderProps } from '@loyalty/order/domain/order';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { CreatePaymentUseCaseCore } from '../../../payment-core/use-cases/create-payment.use-case';
import { VerifyPaymentUseCaseCore } from '../../../payment-core/use-cases/verify-payment.use-case';

export interface IRegisterPaymentDto {
  orderId: number;
  paymentToken: string;
  amount: number;
  receiptReturnPhoneNumber: string;
}

@Injectable()
export class RegisterPaymentUseCase {
  private readonly logger = new Logger(RegisterPaymentUseCase.name);

  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly paymentUseCase: CreatePaymentUseCaseCore,
    private readonly verifyPaymentUseCase: VerifyPaymentUseCaseCore,
  ) {}

  async execute(data: IRegisterPaymentDto): Promise<any> {
    const order = await this.orderRepository.updateStatusIf(
      data.orderId,
      OrderStatus.CREATED,
      OrderStatus.PAYMENT_PROCESSING,
    );

    if (!order) {
      throw new Error(
        `Order ${data.orderId} not found or already processed (not in CREATED status)`,
      );
    }

    let paymentResult: any = null;
    let paymentCreated = false;

    try {
      this.logger.log(
        {
          orderId: order.id,
          action: 'payment_processing',
          timestamp: new Date(),
          details: JSON.stringify({
            paymentToken: data.paymentToken,
            amount: data.amount,
          }),
        },
        `Payment processing initiated for order ${order.id} with amount ${data.amount}`,
      );

      const idempotenceKey = `order-${order.id}-register`;

      paymentResult =
        process.env.PAYMENT_TEST_MODE === 'true'
          ? ({
              id: randomUUID(),
              confirmation: { confirmation_url: '' },
              status: 'pending',
            } as any)
          : await this.paymentUseCase.create({
              amount: String(data.amount),
              paymentToken: data.paymentToken,
              description: `Оплата за мойку, устройство № ${order.carWashDeviceId}`,
              phone: data.receiptReturnPhoneNumber,
              idempotenceKey,
            });

      paymentCreated = true;

      if (process.env.PAYMENT_TEST_MODE !== 'true') {
        try {
          const payment = await this.verifyPaymentUseCase.execute(
            paymentResult.id,
          );

          if (payment.status === 'canceled') {
            throw new Error(
              `Payment ${paymentResult.id} was canceled during creation`,
            );
          }

          this.logger.log(
            `Payment ${paymentResult.id} created with status: ${payment.status} for order ${order.id}`,
          );
        } catch (verifyError: any) {
          this.logger.warn(
            `Payment verification failed for payment ${paymentResult.id}, order ${order.id}: ${verifyError.message}`,
          );
        }
      }

      const updatedOrder = new Order({
        id: order.id,
        transactionId: paymentResult.id,
        sumFull: order.sumFull,
        sumReal: order.sumReal,
        sumBonus: order.sumBonus,
        sumDiscount: order.sumDiscount,
        sumCashback: order.sumCashback,
        carWashDeviceId: order.carWashDeviceId,
        carWashId: order.carWashId,
        bayType: order.bayType,
        platform: order.platform,
        cardMobileUserId: order.cardMobileUserId,
        typeMobileUser: order.typeMobileUser,
        orderData: order.orderData,
        createData: order.createData,
        orderStatus: OrderStatus.WAITING_PAYMENT,
        sendAnswerStatus: order.sendAnswerStatus,
        sendTime: order.sendTime,
        debitingMoney: order.debitingMoney,
        executionStatus: order.executionStatus,
        reasonError: order.reasonError,
        executionError: order.executionError,
        orderHandlerStatus: order.orderHandlerStatus,
        handlerError: order.handlerError,
      } as OrderProps);

      await this.orderRepository.update(updatedOrder);

      this.logger.log(
        {
          orderId: order.id,
          action: 'payment_registered',
          timestamp: new Date(),
          details: JSON.stringify(paymentResult),
        },
        `Payment has been registered for order ${order.id} with amount ${data.amount}`,
      );

      return {
        status: OrderStatus.WAITING_PAYMENT,
        paymentId: paymentResult.id,
        confirmation_url: paymentResult?.confirmation?.confirmation_url || '',
      };
    } catch (error: any) {
      const currentOrder = await this.orderRepository.findOneById(data.orderId);

      if (paymentCreated && paymentResult?.id && currentOrder) {
        if (currentOrder.orderStatus === OrderStatus.PAYMENT_PROCESSING) {
          try {
            const recoveryOrder = new Order({
              ...currentOrder,
              transactionId: paymentResult.id,
              orderStatus: OrderStatus.WAITING_PAYMENT,
            } as OrderProps);
            await this.orderRepository.update(recoveryOrder);
            this.logger.log(
              `Recovered order ${currentOrder.id} to WAITING_PAYMENT state with payment ${paymentResult.id}`,
            );

            return {
              status: OrderStatus.WAITING_PAYMENT,
              paymentId: paymentResult.id,
              confirmation_url:
                paymentResult?.confirmation?.confirmation_url || '',
            };
          } catch (recoveryError: any) {
            this.logger.error(
              `CRITICAL: Failed to recover order ${currentOrder.id} after payment creation. Payment ID: ${paymentResult.id}. Error: ${recoveryError.message}`,
            );
          }
        }
        this.logger.warn(
          `Payment ${paymentResult.id} created but registration incomplete for order ${currentOrder.id}`,
        );
      } else if (currentOrder) {
        currentOrder.orderStatus = OrderStatus.CANCELED;
        currentOrder.executionError = error?.message ?? String(error);
        await this.orderRepository.update(currentOrder);
        this.logger.error(
          `Payment registration failed for order ${currentOrder.id}`,
        );
      }

      throw error;
    }
  }
}
