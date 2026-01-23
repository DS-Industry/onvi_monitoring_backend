import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GetGatewayCredentialsUseCase {
  constructor(private readonly configService: ConfigService) {}

  async execute(): Promise<{ shopId: string; clientApplicationKey: string }> {
    const shopId = this.configService.get<string>('YOOKASSA_SHOP_ID');
    const clientApplicationKey = 
      this.configService.get<string>('YOOKASSA_CLIENT_APPLICATION_KEY') ||
      this.configService.get<string>('PAYMENT_GATEWAY_API_KEY_CLIENT') ||
      this.configService.get<string>('YOOKASSA_CLIENT_KEY');

    if (!shopId) {
      throw new Error('YooKassa shop ID is not configured');
    }

    if (!clientApplicationKey) {
      throw new Error('YooKassa client application key is not configured');
    }

    return {
      shopId,
      clientApplicationKey,
    };
  }
}
