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
} from '@nestjs/common';
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

  private verifyWebhookSignature(authHeader: string): boolean {
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return false;
    }

    try {
      const credentials = Buffer.from(authHeader.slice(6), 'base64').toString('utf-8');
      const [shopId, secretKey] = credentials.split(':');

      const expectedShopId = this.configService.get<string>('YOOKASSA_SHOP_ID');
      const expectedSecretKey = this.configService.get<string>('YOOKASSA_SECRET_KEY');

      if (!expectedShopId || !expectedSecretKey) {
        this.logger.error('YooKassa credentials not configured');
        return false;
      }

      if (shopId !== expectedShopId || secretKey !== expectedSecretKey) {
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(`Error verifying webhook signature: ${error.message}`);
      return false;
    }
  }

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() webhookData: any,
    @Headers('authorization') authHeader: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    if (!this.verifyWebhookSignature(authHeader)) {
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


