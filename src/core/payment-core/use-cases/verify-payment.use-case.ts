import { Inject, Injectable } from '@nestjs/common';
import { IPaymentGateway } from '../interfaces/payment-gateway.interface';

@Injectable()
export class VerifyPaymentUseCaseCore {
  constructor(
    @Inject('PAYMENT_GATEWAY')
    private readonly paymentGateway: IPaymentGateway,
  ) {}

  async execute(paymentId: string) {
    return this.paymentGateway.getPayment(paymentId);
  }
}
