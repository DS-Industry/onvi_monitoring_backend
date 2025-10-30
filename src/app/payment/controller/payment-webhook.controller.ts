import { Body, Controller, HttpCode, HttpStatus, Post, Logger, Inject } from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { ConfigService } from '@nestjs/config';
import { PaymentWebhookOrchestrateUseCase } from '../use-cases/payment-webhook-orchestrate.use-case';

@Controller('payment-webhook')
export class PaymentWebhookController {
  private readonly logger = new Logger(PaymentWebhookController.name);

  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
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


