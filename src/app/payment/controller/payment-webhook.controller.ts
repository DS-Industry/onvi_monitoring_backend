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
import { VerifyWebhookIpUseCase } from '../use-cases/verify-webhook-ip.use-case';

@Controller('payment-webhook')
export class PaymentWebhookController {
  private readonly logger = new Logger(PaymentWebhookController.name);

  constructor(
    private readonly orchestratePaymentUseCase: PaymentWebhookOrchestrateUseCase,
    private readonly verifyWebhookIpUseCase: VerifyWebhookIpUseCase,
  ) {}

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: any,
    @Body() webhookData: any,
    @Headers('x-request-id') requestId?: string,
  ) {
    const clientIp =
      req.ip ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      'unknown';

    this.logger.debug(
      `Webhook received from IP: ${clientIp}. Request ID: ${requestId || 'unknown'}`,
    );

    if (!this.verifyWebhookIpUseCase.execute(clientIp)) {
      this.logger.warn(
        `Webhook from unauthorized IP address: ${clientIp}. Request ID: ${requestId || 'unknown'}`,
      );
      throw new UnauthorizedException('Unauthorized IP address');
    }

    this.logger.log(
      `Received verified payment webhook from authorized IP. Request ID: ${requestId || 'unknown'}`,
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
