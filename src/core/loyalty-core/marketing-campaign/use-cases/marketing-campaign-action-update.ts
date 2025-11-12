import { Injectable } from '@nestjs/common';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { MarketingCampaignActionUpdateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-action-update.dto';

@Injectable()
export class UpdateMarketingCampaignActionUseCase {
  constructor(
    private readonly marketingCampaignRepository: IMarketingCampaignRepository,
  ) {}

  async execute(
    campaignId: number,
    data: MarketingCampaignActionUpdateDto,
  ): Promise<{
    id: number;
    campaignId: number;
    actionType: string;
    payload: any;
  }> {
    return await this.marketingCampaignRepository.updateAction(
      campaignId,
      data,
    );
  }
}
