import { Inject, Injectable } from '@nestjs/common';
import { IPaymentGateway, RefundPaymentDto } from '../interfaces/payment-gateway.interface';

@Injectable()
export class RefundPaymentUseCaseCore {
  constructor(
    @Inject('PAYMENT_GATEWAY')
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(paymentId: string, amount: number, reason?: string) {
    const payload: RefundPaymentDto = {
      payment_id: paymentId,
      amount: { value: String(amount), currency: 'RUB' },
      description: reason,
    };
    return this.paymentGateway.createRefund(payload);
  }
}


