import { Injectable } from '@nestjs/common';
import { MarketingCampaignCreateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-create.dto';
import { MarketingCampaignResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-response.dto';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';
import { GetParticipantPosesUseCase } from '@loyalty/loyalty/loyaltyProgram/use-cases/loyalty-program-get-participant-poses';
import { UpdateMarketingCampaignUseCase } from './marketing-campaign-update';
import { FindMethodsMarketingCampaignUseCase } from './marketing-campaign-find-methods';

@Injectable()
export class CreateMarketingCampaignUseCase {
  constructor(
    private readonly marketingCampaignRepository: IMarketingCampaignRepository,
    private readonly getParticipantPosesUseCase: GetParticipantPosesUseCase,
    private readonly updateMarketingCampaignUseCase: UpdateMarketingCampaignUseCase,
    private readonly findMethodsMarketingCampaignUseCase: FindMethodsMarketingCampaignUseCase,
  ) {}

  async execute(
    data: MarketingCampaignCreateDto,
    userId: number,
  ): Promise<MarketingCampaignResponseDto> {
    const campaign = await this.marketingCampaignRepository.create(
      data,
      userId,
    );

    const poses = await this.getParticipantPosesUseCase.execute(
      data.ltyProgramId,
    );
    const posIds = poses.map((pos) => pos.id);

    if (posIds.length > 0) {
      await this.updateMarketingCampaignUseCase.execute(
        campaign.id,
        { posIds },
        userId,
      );

      return await this.findMethodsMarketingCampaignUseCase.getOneById(
        campaign.id,
      );
    }

    return campaign;
  }
}
