import { MarketingCampaignMobileDisplayType } from '@loyalty/marketing-campaign/domain';

export class MarketingCampaignMobileDisplayResponseDto {
  id: number;
  marketingCampaignId: number;
  imageLink: string;
  description?: string;
  type: MarketingCampaignMobileDisplayType;
  createdAt: string;
  updatedAt: string;
}

