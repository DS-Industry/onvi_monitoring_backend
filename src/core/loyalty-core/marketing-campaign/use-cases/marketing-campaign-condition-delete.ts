import { Injectable } from '@nestjs/common';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { LoyaltyException } from '@exception/option.exceptions';

@Injectable()
export class DeleteMarketingCampaignConditionUseCase {
  constructor(
    private readonly marketingCampaignRepository: IMarketingCampaignRepository,
  ) {}

  async execute(id: number, order: number): Promise<void> {
    try {
      await this.marketingCampaignRepository.deleteCondition(id, order);
    } catch (error) {
      if (error instanceof Error) {
        throw new LoyaltyException(404, error.message);
      }
      throw error;
    }
  }
}
