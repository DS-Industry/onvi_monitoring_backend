import { Injectable } from '@nestjs/common';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';

@Injectable()
export class DeleteMarketingCampaignConditionUseCase {
  constructor(
    private readonly marketingCampaignRepository: IMarketingCampaignRepository,
  ) {}

  async execute(conditionId: number): Promise<void> {
    return this.marketingCampaignRepository.deleteCondition(conditionId);
  }
}
