import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Logger,
  Headers,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { PaymentWebhookOrchestrateUseCase } from '../use-cases/payment-webhook-orchestrate.use-case';
import { VerifyWebhookSignatureUseCase } from '../use-cases/verify-webhook-signature.use-case';

@Controller('payment-webhook')
export class PaymentWebhookController {
  private readonly logger = new Logger(PaymentWebhookController.name);

  constructor(
    private readonly orchestratePaymentUseCase: PaymentWebhookOrchestrateUseCase,
    private readonly verifyWebhookSignatureUseCase: VerifyWebhookSignatureUseCase,
  ) {}

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: any,
    @Body() webhookData: any,
    @Headers('webhook-signature') signature: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const rawBody =
      req.rawBody || Buffer.from(JSON.stringify(webhookData), 'utf-8');

    const httpMethod = req.method || 'POST';
    const url =
      req.path || req.url?.split('?')[0] || '/payment-webhook/webhook';

    if (
      !this.verifyWebhookSignatureUseCase.execute({
        httpMethod,
        url,
        rawBody,
        signature,
      })
    ) {
      this.logger.warn(
        `Invalid webhook signature. Request ID: ${requestId || 'unknown'}`,
      );
      throw new UnauthorizedException('Invalid webhook signature');
    }

    this.logger.log(
      `Received verified payment webhook. Request ID: ${requestId || 'unknown'}`,
      JSON.stringify(webhookData),
    );

    const { event, object } = webhookData;
    if (!object || !object.id) {
      this.logger.warn('Webhook received without valid object.id');
      return { ok: true };
    }

    try {
      await this.orchestratePaymentUseCase.execute(
        event,
        object.id,
        webhookData,
        requestId,
      );
      return { ok: true };
    } catch (error) {
      this.logger.error(
        `Error processing webhook for payment ${object.id}, event ${event}: ${error.message}. Request ID: ${requestId || 'unknown'}`,
      );
      throw error;
    }
  }
}
