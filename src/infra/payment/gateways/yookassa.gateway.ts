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
      const { paymentToken, idempotenceKey, receipt, confirmation, ...rest } = data;

      const paymentRequest: any = {
        ...rest,
      };

      if (paymentToken) {
        paymentRequest.payment_token = paymentToken;
      }

      if (idempotenceKey) {
        paymentRequest.idempotence_key = idempotenceKey;
      }

      // if (confirmation) {
      //   paymentRequest.confirmation = confirmation;
      // }

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

      this.logger.debug(
        `Creating payment with request: ${JSON.stringify({
          amount: paymentRequest.amount,
          description: paymentRequest.description,
          hasPaymentToken: !!paymentToken,
          hasConfirmation: !!confirmation,
          confirmationType: confirmation?.type,
          hasReceipt: !!receipt,
          idempotenceKey,
        })}`,
      );

      const result = await this.checkout.createPayment(paymentRequest);
      this.logger.log(
        `Payment created successfully: ${result?.id || 'unknown'}`,
      );
      return result;
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.response?.data?.description ||
        error?.response?.data?.message ||
        error?.response?.statusText ||
        JSON.stringify(error?.response?.data) ||
        String(error);

      const errorDetails = {
        message: errorMessage,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        stack: error?.stack,
      };

      this.logger.error(
        `Failed to create payment: ${errorMessage}`,
        JSON.stringify(errorDetails, null, 2),
      );

      const enhancedError = new Error(
        `YooKassa payment creation failed: ${errorMessage}`,
      );
      (enhancedError as any).originalError = error;
      (enhancedError as any).response = error?.response;
      throw enhancedError;
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
