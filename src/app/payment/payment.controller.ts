import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { IPaymentSubject, IPaymentMode } from '@a2seven/yoo-checkout';

export class CreateGenericPaymentDto {
  amount: string;
  description: string;
  paymentToken?: string; 
  receiptReturnPhoneNumber: string;
  metadata: Record<string, any>; 
}

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  async createPayment(@Body() dto: CreateGenericPaymentDto) {
    const receipt = {
      phone: dto.receiptReturnPhoneNumber,
      items: [{
        description: dto.description,
        amount: { value: dto.amount, currency: 'RUB' },
        quantity: '1',
        vat_code: 2,
        payment_subject: 'service' as IPaymentSubject,
        payment_mode: 'full_payment' as IPaymentMode,
      }],
    };
    const payment = await this.paymentService.createPayment({
      amount: { value: dto.amount, currency: 'RUB' },
      paymentToken: dto.paymentToken,
      description: dto.description,
      capture: true,
      receipt,
      metadata: dto.metadata,
    });
    return payment;
  }
}
