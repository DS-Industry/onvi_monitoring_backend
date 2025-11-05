import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Logger,
  Inject,
  Headers,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { IOrderRepository } from '@loyalty/order/interface/order';
import { ConfigService } from '@nestjs/config';
import { PaymentWebhookOrchestrateUseCase } from '../use-cases/payment-webhook-orchestrate.use-case';
import { createHmac } from 'crypto';

@Controller('payment-webhook')
export class PaymentWebhookController {
  private readonly logger = new Logger(PaymentWebhookController.name);

  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
    private readonly configService: ConfigService,
    private readonly orchestratePaymentUseCase: PaymentWebhookOrchestrateUseCase,
  ) {}


  private verifyWebhookSignature(
    httpMethod: string,
    url: string,
    rawBody: Buffer | string,
    signature: string,
  ): boolean {
    if (!signature) {
      this.logger.warn('Missing Webhook-Signature header');
      return false;
    }

    const webhookSecretKey = this.configService.get<string>('YOOKASSA_WEBHOOK_SECRET_KEY');
    
    if (!webhookSecretKey) {
      this.logger.error('YooKassa webhook secret key not configured. Please set YOOKASSA_WEBHOOK_SECRET_KEY environment variable.');
      return false;
    }

    try {
      const bodyString = Buffer.isBuffer(rawBody) ? rawBody.toString('utf-8') : rawBody;
      
      const message = `${httpMethod}|${url}|${bodyString}`;
      
      const computedSignature = createHmac('sha256', webhookSecretKey)
        .update(message)
        .digest('hex');

      const isValid = this.constantTimeCompare(computedSignature, signature);
      
      if (!isValid) {
        this.logger.warn(
          `Signature mismatch. Method: ${httpMethod}, URL: ${url}, Expected: ${computedSignature.substring(0, 16)}..., Got: ${signature.substring(0, 16)}...`,
        );
      } else {
        this.logger.debug(`Signature verified successfully for ${httpMethod} ${url}`);
      }

      return isValid;
    } catch (error) {
      this.logger.error(`Error verifying webhook signature: ${error.message}`);
      return false;
    }
  }

  private constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() req: any,
    @Body() webhookData: any,
    @Headers('webhook-signature') signature: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    const rawBody = req.rawBody || Buffer.from(JSON.stringify(webhookData), 'utf-8');
    
    const httpMethod = req.method || 'POST';
    const url = req.path || req.url?.split('?')[0] || '/payment-webhook/webhook';

    if (!this.verifyWebhookSignature(httpMethod, url, rawBody, signature)) {
      this.logger.warn(`Invalid webhook signature. Request ID: ${requestId || 'unknown'}`);
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
      await this.orchestratePaymentUseCase.execute(event, object.id, webhookData, requestId);
      return { ok: true };
    } catch (error) {
      this.logger.error(
        `Error processing webhook for payment ${object.id}, event ${event}: ${error.message}. Request ID: ${requestId || 'unknown'}`,
      );
      throw error;
    }
  }
}


