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
import { Request } from 'express';
import { PaymentWebhookOrchestrateUseCase } from '../use-cases/payment-webhook-orchestrate.use-case';
import { VerifyWebhookIpUseCase } from '../use-cases/verify-webhook-ip.use-case';
import { YooKassaWebhookDto } from '../dto/webhook.dto';

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
    @Req() req: Request,
    @Body() webhookData: YooKassaWebhookDto,
    @Headers('x-request-id') requestId?: string,
  ) {
    const xForwardedFor = req.headers['x-forwarded-for'];
    const forwardedIp = Array.isArray(xForwardedFor)
      ? xForwardedFor[0]?.trim()
      : xForwardedFor?.split(',')[0]?.trim();

    const clientIp =
      req.ip ||
      (req as any).connection?.remoteAddress ||
      (req as any).socket?.remoteAddress ||
      forwardedIp ||
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
      {
        requestId: requestId || 'unknown',
        clientIp,
        event: webhookData?.event,
        paymentId: webhookData?.object?.id,
      },
      `Received verified payment webhook from authorized IP. Request ID: ${requestId || 'unknown'}`,
    );

    const { event, object } = webhookData;
    if (!object || !object.id) {
      this.logger.warn(
        `Webhook received without valid object.id. Request ID: ${requestId || 'unknown'}`,
      );
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
    } catch (error: any) {
      this.logger.error(
        {
          requestId: requestId || 'unknown',
          paymentId: object.id,
          event,
          error: error.message,
          stack: error.stack,
        },
        `Error processing webhook for payment ${object.id}, event ${event}. Request ID: ${requestId || 'unknown'}`,
      );
      
      return { 
        ok: true, 
        note: 'Processing failed, error logged for review' 
      };
    }
  }
}
