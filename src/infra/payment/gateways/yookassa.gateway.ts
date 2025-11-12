import { Injectable, Logger } from '@nestjs/common';
import { YooCheckout } from '@a2seven/yoo-checkout';
import { IPaymentMode, IPaymentSubject } from '@a2seven/yoo-checkout';
import {
  IPaymentGateway,
  CreatePaymentDto,
  RefundPaymentDto,
} from '../../../core/payment-core/interfaces/payment-gateway.interface';
import {
  PaymentSubject,
  PaymentMode,
} from '../../../core/payment-core/domain/payment.types';

@Injectable()
export class YooKassaGateway implements IPaymentGateway {
  private readonly logger = new Logger(YooKassaGateway.name);
  private checkout: YooCheckout;

  constructor() {
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;

    if (!shopId || !secretKey) {
      throw new Error(
        'YooKassa credentials are not configured. Please set YOOKASSA_SHOP_ID and YOOKASSA_SECRET_KEY environment variables.',
      );
    }

    this.checkout = new YooCheckout({
      shopId,
      secretKey,
    });
  }

  private mapPaymentSubject(subject: PaymentSubject): IPaymentSubject {
    return subject as unknown as IPaymentSubject;
  }

  private mapPaymentMode(mode: PaymentMode): IPaymentMode {
    return mode as unknown as IPaymentMode;
  }

  async createPayment(data: CreatePaymentDto): Promise<any> {
    try {
      const { paymentToken, idempotenceKey, receipt, ...rest } = data;

      const paymentRequest: any = {
        ...rest,
      };

      if (paymentToken) {
        paymentRequest.payment_token = paymentToken;
      }

      if (idempotenceKey) {
        paymentRequest.idempotence_key = idempotenceKey;
      }

      if (receipt) {
        paymentRequest.receipt = {
          phone: receipt.phone,
          items: receipt.items.map((item) => ({
            ...item,
            payment_subject: this.mapPaymentSubject(item.payment_subject),
            payment_mode: this.mapPaymentMode(item.payment_mode),
          })),
        };
      }

      return await this.checkout.createPayment(paymentRequest);
    } catch (error) {
      this.logger.error(
        `Failed to create payment: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async getPayment(id: string): Promise<any> {
    try {
      return await this.checkout.getPayment(id);
    } catch (error) {
      this.logger.error(
        `Failed to get payment ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async createRefund(data: RefundPaymentDto): Promise<any> {
    try {
      return await this.checkout.createRefund(data);
    } catch (error) {
      this.logger.error(
        `Failed to create refund for payment ${data.payment_id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
