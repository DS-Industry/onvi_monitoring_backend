import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreatePaymentUseCaseCore } from '../../../core/payment-core/use-cases/create-payment.use-case';

export class CreateGenericPaymentDto {
  amount: string;
  description: string;
  paymentToken?: string;
  phone?: string;
}

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentUseCase: CreatePaymentUseCaseCore) {}

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  async createPayment(@Body() dto: CreateGenericPaymentDto) {
    const payment = await this.paymentUseCase.create(dto);
    return payment;
  }
}
