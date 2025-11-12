import { Injectable } from '@nestjs/common';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { FindMethodsMarketingCampaignUseCase } from './marketing-campaign-find-methods';

@Injectable()
export class DeleteMarketingCampaignConditionUseCase {
  constructor(
    private readonly marketingCampaignRepository: IMarketingCampaignRepository,
    private readonly findMethodsMarketingCampaignUseCase: FindMethodsMarketingCampaignUseCase,
  ) {}

  async execute(conditionId: number): Promise<void> {
    const condition =
      await this.findMethodsMarketingCampaignUseCase.getConditionById(
        conditionId,
      );

    if (!condition) {
      throw new Error('Marketing campaign condition not found');
    }

    return this.marketingCampaignRepository.deleteCondition(conditionId);
  }
}
