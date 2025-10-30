import { IPaymentSubject, IPaymentMode } from '@a2seven/yoo-checkout';

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
      payment_subject: IPaymentSubject;
      payment_mode: IPaymentMode;
    }>;
  };
}

export class RefundPaymentDto {
  payment_id: string;
  amount: { value: string; currency: string };
  description?: string;
}
