import { Inject, Injectable } from '@nestjs/common';
import { IPaymentMode, IPaymentSubject } from '@a2seven/yoo-checkout';
import { IPaymentGateway, RefundPaymentDto, CreatePaymentDto } from '../interfaces/payment-gateway.interface';

export interface CreateGenericPaymentInput {
  amount: string;
  description: string;
  paymentToken?: string;
  phone?: string;
}

@Injectable()
export class CreatePaymentUseCaseCore {
  constructor(
    @Inject('PAYMENT_GATEWAY')
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async create(data: CreateGenericPaymentInput) {
    const amount = { value: String(data.amount), currency: 'RUB' } as const;

    const purchaseItem: {
      description: string;
      amount: { value: string; currency: string };
      quantity: string;
      vat_code: number;
      payment_subject: IPaymentSubject;
      payment_mode: IPaymentMode;
    } = {
      description: data.description,
      amount,
      quantity: '1',
      vat_code: 2,
      payment_subject: 'commodity',
      payment_mode: 'full_payment',
    };

    const payload: CreatePaymentDto = {
      amount,
      description: data.description,
      paymentToken: data.paymentToken,
      capture: true,
      receipt: data.phone
        ? {
            phone: data.phone,
            items: [purchaseItem],
          }
        : undefined,
    };

    return this.paymentGateway.createPayment(payload);
  }

  async verify(paymentId: string) {
    return this.paymentGateway.getPayment(paymentId);
  }

  async refund(paymentId: string, amount: number, reason?: string) {
    const payload: RefundPaymentDto = {
      payment_id: paymentId,
      amount: { value: String(amount), currency: 'RUB' },
      description: reason,
    };
    return this.paymentGateway.createRefund(payload);
  }
}


