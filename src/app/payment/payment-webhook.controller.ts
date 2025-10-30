import { Body, Controller, HttpCode, HttpStatus, Post, Logger } from '@nestjs/common';
import { OrderRepository } from '@loyalty/order/repository/order';
import { ConfigService } from '@nestjs/config';
import { PaymentWebhookOrchestrateUseCase } from './payment-webhook-orchestrate.use-case';

@Controller('payment-webhook')
export class PaymentWebhookController {
  private readonly logger = new Logger(PaymentWebhookController.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly configService: ConfigService,
    private readonly orchestratePaymentUseCase: PaymentWebhookOrchestrateUseCase,
  ) {}

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() webhookData: any) {
    this.logger.log('Received payment webhook', JSON.stringify(webhookData));
    const { event, object } = webhookData;
    if (!object || !object.id) return { ok: true };

    await this.orchestratePaymentUseCase.execute(event, object.id, webhookData);

    return { ok: true };
  }
}
