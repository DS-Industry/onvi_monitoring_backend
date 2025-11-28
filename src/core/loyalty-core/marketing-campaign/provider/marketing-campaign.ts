import { Provider } from '@nestjs/common';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { MarketingCampaignRepository } from '@loyalty/marketing-campaign/repository/marketing-campaign';

export const MarketingCampaignRepositoryProvider: Provider = {
  provide: IMarketingCampaignRepository,
  useClass: MarketingCampaignRepository,
};
