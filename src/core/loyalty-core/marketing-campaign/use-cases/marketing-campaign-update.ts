import { Injectable } from '@nestjs/common';
import { MarketingCampaignUpdateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-update.dto';
import { MarketingCampaignResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-response.dto';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';

@Injectable()
export class UpdateMarketingCampaignUseCase {
  constructor(
    private readonly marketingCampaignRepository: IMarketingCampaignRepository,
  ) {}

  async execute(
    id: number,
    data: MarketingCampaignUpdateDto,
    userId: number,
  ): Promise<MarketingCampaignResponseDto> {
    return this.marketingCampaignRepository.update(id, data, userId);
  }
}
