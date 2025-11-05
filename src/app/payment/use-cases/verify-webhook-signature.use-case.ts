import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

export interface VerifyWebhookSignatureInput {
  httpMethod: string;
  url: string;
  rawBody: Buffer | string;
  signature: string;
}

@Injectable()
export class VerifyWebhookSignatureUseCase {
  private readonly logger = new Logger(VerifyWebhookSignatureUseCase.name);

  constructor(private readonly configService: ConfigService) {}

  execute(input: VerifyWebhookSignatureInput): boolean {
    const { httpMethod, url, rawBody, signature } = input;

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
}

