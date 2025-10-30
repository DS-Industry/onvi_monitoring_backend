import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { Order, OrderProps } from '@loyalty/order/domain/order';
import { OrderStatus } from '@prisma/client';
import { CreatePaymentUseCaseCore } from '../../../../core/payment-core/use-cases/create-payment.use-case';

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
  ) {}

  async execute(data: IRegisterPaymentDto): Promise<any> {
    const order = await this.orderRepository.findOneById(data.orderId);

    if (!order) {
      throw new Error(`Order not found: ${data.orderId}`);
    }

    if (order.orderStatus !== OrderStatus.CREATED) {
      throw new Error(
        `Invalid order state. Expected CREATED, got ${order.orderStatus} for order ${order.id}`,
      );
    }

    try {
      order.orderStatus = OrderStatus.PAYMENT_PROCESSING;
      await this.orderRepository.update(order);

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

      const paymentResult = process.env.PAYMENT_TEST_MODE === 'true'
        ? { id: randomUUID(), confirmation: { confirmation_url: '' } } as any
        : await this.paymentUseCase.create({
            amount: String(data.amount),
            paymentToken: data.paymentToken,
            description: `Оплата за мойку, устройство № ${order.carWashDeviceId}`,
            phone: data.receiptReturnPhoneNumber,
          });

      const refreshed = await this.orderRepository.findOneById(order.id);
      if (!refreshed) throw new Error('Order disappeared during payment registration');

      const updatedOrder = new Order({
        id: refreshed.id,
        transactionId: paymentResult.id,
        sumFull: refreshed.sumFull,
        sumReal: refreshed.sumReal,
        sumBonus: refreshed.sumBonus,
        sumDiscount: refreshed.sumDiscount,
        sumCashback: refreshed.sumCashback,
        carWashDeviceId: refreshed.carWashDeviceId,
        carWashId: refreshed.carWashId,
        bayType: refreshed.bayType,
        platform: refreshed.platform,
        cardMobileUserId: refreshed.cardMobileUserId,
        typeMobileUser: refreshed.typeMobileUser,
        orderData: refreshed.orderData,
        createData: refreshed.createData,
        orderStatus: OrderStatus.WAITING_PAYMENT,
        sendAnswerStatus: refreshed.sendAnswerStatus,
        sendTime: refreshed.sendTime,
        debitingMoney: refreshed.debitingMoney,
        executionStatus: refreshed.executionStatus,
        reasonError: refreshed.reasonError,
        executionError: refreshed.executionError,
        orderHandlerStatus: refreshed.orderHandlerStatus,
        handlerError: refreshed.handlerError,
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
      order.orderStatus = OrderStatus.CANCELED;
      order.executionError = error?.message ?? String(error);
      await this.orderRepository.update(order);

      this.logger.error(
        {
          orderId: order.id,
          action: 'payment_failed',
          timestamp: new Date(),
          details: JSON.stringify({ error: error?.message ?? String(error) }),
        },
        `Payment registration failed for order ${order.id}`,
      );

      throw error;
    }
  }
}



