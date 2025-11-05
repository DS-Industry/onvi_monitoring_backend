import { Inject, Injectable } from '@nestjs/common';
import { IPaymentGateway } from '../../core/payment-core/interfaces/payment-gateway.interface';
import { CreatePaymentDto, RefundPaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @Inject('PAYMENT_GATEWAY')
    private readonly paymentGateway: IPaymentGateway
  ) {}

  async createPayment(params: CreatePaymentDto) {
    return this.paymentGateway.createPayment(params);
  }

  async verifyPayment(id: string) {
    return this.paymentGateway.getPayment(id);
  }

  async refundPayment(params: RefundPaymentDto) {
    return this.paymentGateway.createRefund(params);
  }
}
