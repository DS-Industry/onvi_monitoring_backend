import { PaymentSubject, PaymentMode } from '../domain/payment.types';

export interface CreatePaymentDto {
  amount: { value: string; currency: string };
  description: string;
  metadata?: Record<string, any>;
  paymentToken?: string;
  capture?: boolean;
  idempotenceKey?: string;
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

export interface RefundPaymentDto {
  payment_id: string;
  amount: { value: string; currency: string };
  description?: string;
}

export interface IPaymentGateway {
  createPayment(data: CreatePaymentDto): Promise<any>;
  getPayment(id: string): Promise<any>;
  createRefund(data: RefundPaymentDto): Promise<any>;
}


