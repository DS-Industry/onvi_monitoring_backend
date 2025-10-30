import { Injectable } from '@nestjs/common';
import { YooCheckout } from '@a2seven/yoo-checkout';
import { IPaymentGateway } from './payment-gateway.interface';
import { CreatePaymentDto, RefundPaymentDto } from './dto/create-payment.dto';

@Injectable()
export class YooKassaGateway implements IPaymentGateway {
  private checkout: YooCheckout;

  constructor() {
    this.checkout = new YooCheckout({
      shopId: process.env.YOOKASSA_SHOP_ID!,
      secretKey: process.env.YOOKASSA_SECRET_KEY!,
    });
  }

  createPayment(data: CreatePaymentDto) {
    const { paymentToken, ...rest } = data;
    return this.checkout.createPayment({
      ...rest,
      payment_token: paymentToken,
    });
  }

  getPayment(id: string) {
    return this.checkout.getPayment(id);
  }

  createRefund(data: RefundPaymentDto) {
    return this.checkout.createRefund(data);
  }
}
