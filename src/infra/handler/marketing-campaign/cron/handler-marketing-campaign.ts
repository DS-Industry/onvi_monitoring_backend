import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MarketingCampaignStatusHandlerUseCase } from '@loyalty/marketing-campaign/use-cases/marketing-campaign-status-handler';

@Injectable()
export class HandlerMarketingCampaignCron {
  constructor(
    private readonly marketingCampaignStatusHandlerUseCase: MarketingCampaignStatusHandlerUseCase,
  ) {}

  @Cron('0 0,12 * * *', { timeZone: 'UTC' })
  async execute(): Promise<void> {
    console.log('Starting marketing campaign status check...');
    try {
      await this.marketingCampaignStatusHandlerUseCase.execute();
      console.log('Marketing campaign status check completed successfully');
    } catch (error) {
      console.error('Error during marketing campaign status check:', error);
    }
  }
}
