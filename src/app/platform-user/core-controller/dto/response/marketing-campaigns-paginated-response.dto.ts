import { MarketingCampaignResponseDto } from './marketing-campaign-response.dto';

export class MarketingCampaignsPaginatedResponseDto {
  data: MarketingCampaignResponseDto[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
