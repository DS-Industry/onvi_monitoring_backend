import { MarketingCampaignCreateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-create.dto';
import { MarketingCampaignUpdateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-update.dto';
import { MarketingCampaignResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-response.dto';

export abstract class IMarketingCampaignRepository {
  abstract create(
    data: MarketingCampaignCreateDto,
    userId: number,
  ): Promise<MarketingCampaignResponseDto>;

  abstract update(
    id: number,
    data: MarketingCampaignUpdateDto,
    userId: number,
  ): Promise<MarketingCampaignResponseDto>;

  abstract findOneById(id: number): Promise<MarketingCampaignResponseDto | null>;

  abstract findAll(): Promise<MarketingCampaignResponseDto[]>;
}
