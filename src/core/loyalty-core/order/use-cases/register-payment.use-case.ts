import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { Order, OrderProps } from '@loyalty/order/domain/order';
import { OrderStatus } from '@loyalty/order/domain/enums';
import { CreatePaymentUseCaseCore } from '../../../payment-core/use-cases/create-payment.use-case';
import { VerifyPaymentUseCaseCore } from '../../../payment-core/use-cases/verify-payment.use-case';
import { FindMethodsCardUseCase } from '@loyalty/mobile-user/card/use-case/card-find-methods';

export interface IRegisterPaymentDto {
  orderId: number;
  paymentToken?: string;
  receiptReturnPhoneNumber: string;
  returnUrl?: string;
  clientId: number;
}

@Injectable()
export class RegisterPaymentUseCase {
  private readonly logger = new Logger(RegisterPaymentUseCase.name);

  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly paymentUseCase: CreatePaymentUseCaseCore,
    private readonly verifyPaymentUseCase: VerifyPaymentUseCaseCore,
    private readonly findMethodsCardUseCase: FindMethodsCardUseCase,
  ) {}

  async execute(data: IRegisterPaymentDto): Promise<any> {
    const order = await this.orderRepository.findOneById(data.orderId);

    if (!order) {
      throw new NotFoundException(`Order with ID ${data.orderId} not found`);
    }

    if (order.clientId) {
      const card = await this.findMethodsCardUseCase.getByClientId(
        order.clientId,
      );
      if (!card || card.mobileUserId !== data.clientId) {
        throw new NotFoundException(`Order with ID ${data.orderId} not found`);
      }
    } else if (data.clientId) {
      throw new NotFoundException(`Order with ID ${data.orderId} not found`);
    }

    const orderForProcessing = await this.orderRepository.updateStatusIf(
      data.orderId,
      OrderStatus.CREATED,
      OrderStatus.PAYMENT_PROCESSING,
    );

    if (!orderForProcessing) {
      throw new Error(
        `Order ${data.orderId} not found or already processed (not in CREATED status)`,
      );
    }

    let paymentResult: any = null;
    let paymentCreated = false;

    try {
      this.logger.log(
        {
          orderId: orderForProcessing.id,
          action: 'payment_processing',
          timestamp: new Date(),
          details: JSON.stringify({
            paymentToken: data.paymentToken || 'none (using redirect)',
            amount: orderForProcessing.sumReal,
            returnUrl: data.returnUrl || 'none',
          }),
        },
        `Payment processing initiated for order ${orderForProcessing.id} with amount ${orderForProcessing.sumReal}`,
      );

      const idempotenceKey = `order-${orderForProcessing.id}-register`;

      let returnUrl = data.returnUrl || process.env.PAYMENT_RETURN_URL;
      
      if (!returnUrl && !data.paymentToken) {
        const baseUrl = process.env.FRONTEND_URL || 'https://app.onvione.ru';
        returnUrl = `${baseUrl}/payment/success?orderId=${orderForProcessing.id}`;
        this.logger.log(
          `Using generated returnUrl: ${returnUrl} for order ${orderForProcessing.id}`,
        );
      }

      paymentResult = await this.paymentUseCase.create({
        amount: String(orderForProcessing.sumReal),
        paymentToken: data.paymentToken,
        description: `Оплата за мойку, устройство № ${orderForProcessing.carWashDeviceId}`,
        phone: data.receiptReturnPhoneNumber,
        idempotenceKey,
        returnUrl: returnUrl,
        metadata: {
          orderId: String(orderForProcessing.id),
          order_id: String(orderForProcessing.id),
        },
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
            `Payment ${paymentResult.id} created with status: ${payment.status} for order ${orderForProcessing.id}`,
          );
        } catch (verifyError: any) {
          this.logger.warn(
            `Payment verification failed for payment ${paymentResult.id}, order ${orderForProcessing.id}: ${verifyError.message}`,
          );
        }
      }

      const updatedOrder = new Order({
        id: orderForProcessing.id,
        transactionId: paymentResult.id,
        sumFull: orderForProcessing.sumFull,
        sumReal: orderForProcessing.sumReal,
        sumBonus: orderForProcessing.sumBonus,
        sumDiscount: orderForProcessing.sumDiscount,
        sumCashback: orderForProcessing.sumCashback,
        carWashDeviceId: orderForProcessing.carWashDeviceId,
        carWashId: orderForProcessing.carWashId,
        bayType: orderForProcessing.bayType,
        platform: orderForProcessing.platform,
        cardMobileUserId: orderForProcessing.cardMobileUserId,
        clientId: orderForProcessing.clientId,
        typeMobileUser: orderForProcessing.typeMobileUser,
        orderData: orderForProcessing.orderData,
        createData: orderForProcessing.createData,
        orderStatus: OrderStatus.WAITING_PAYMENT,
        sendAnswerStatus: orderForProcessing.sendAnswerStatus,
        sendTime: orderForProcessing.sendTime,
        debitingMoney: orderForProcessing.debitingMoney,
        executionStatus: orderForProcessing.executionStatus,
        reasonError: orderForProcessing.reasonError,
        executionError: orderForProcessing.executionError,
        orderHandlerStatus: orderForProcessing.orderHandlerStatus,
        handlerError: orderForProcessing.handlerError,
      } as OrderProps);

      await this.orderRepository.update(updatedOrder);

      this.logger.log(
        {
          orderId: orderForProcessing.id,
          action: 'payment_registered',
          timestamp: new Date(),
          details: JSON.stringify(paymentResult),
        },
        `Payment has been registered for order ${orderForProcessing.id} with amount ${orderForProcessing.sumReal}`,
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
