import { Injectable } from '@nestjs/common';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { MarketingCampaignActionUpdateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-action-update.dto';
import { MarketingCampaignActionResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-action-response.dto';

@Injectable()
export class UpdateMarketingCampaignActionUseCase {
  constructor(
    private readonly marketingCampaignRepository: IMarketingCampaignRepository,
  ) {}

  async execute(
    campaignId: number,
    data: MarketingCampaignActionUpdateDto,
  ): Promise<MarketingCampaignActionResponseDto> {
    return await this.marketingCampaignRepository.updateAction(
      campaignId,
      data,
    );
  }
}
