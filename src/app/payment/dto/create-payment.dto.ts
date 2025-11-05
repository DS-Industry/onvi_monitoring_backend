import { PaymentSubject, PaymentMode } from '../../../core/payment-core/domain/payment.types';

export class CreatePaymentDto {
  amount: { value: string; currency: string };
  description: string;
  metadata?: Record<string, any>;
  paymentToken?: string;
  capture?: boolean;
  receipt?: {
    phone: string;
    items: Array<{
      description: string;
      amount: { value: string; currency: string };
      quantity: string;
      vat_code: number;
      payment_subject: PaymentSubject;
      payment_mode: PaymentMode;
    }>;
  };
}

export class RefundPaymentDto {
  payment_id: string;
  amount: { value: string; currency: string };
  description?: string;
}
