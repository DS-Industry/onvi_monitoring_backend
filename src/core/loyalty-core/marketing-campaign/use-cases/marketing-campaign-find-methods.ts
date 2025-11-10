import { Injectable } from '@nestjs/common';
import { MarketingCampaignResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-response.dto';
import { MarketingCampaignsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaigns-paginated-response.dto';
import { MarketingCampaignConditionsResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-condition-response.dto';
import { MarketingCampaignsFilterDto } from '@platform-user/core-controller/dto/receive/marketing-campaigns-filter.dto';
import { MarketingCampaignMobileDisplayResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-mobile-display-response.dto';
import { IMarketingCampaignRepository } from '@loyalty/marketing-campaign/interface/marketing-campaign';

@Injectable()
export class FindMethodsMarketingCampaignUseCase {
  constructor(private readonly marketingCampaignRepository: IMarketingCampaignRepository) {}

  async getOneById(id: number): Promise<MarketingCampaignResponseDto | null> {
    return this.marketingCampaignRepository.findOneById(id);
  }

  async getAll(): Promise<MarketingCampaignResponseDto[]> {
    return this.marketingCampaignRepository.findAll();
  }

  async getAllByOrganizationId(organizationId: number): Promise<MarketingCampaignResponseDto[]> {
    return this.marketingCampaignRepository.findAllByOrganizationId(organizationId);
  }

  async getAllByOrganizationIdPaginated(filter: MarketingCampaignsFilterDto): Promise<MarketingCampaignsPaginatedResponseDto> {
    return this.marketingCampaignRepository.findAllByOrganizationIdPaginated(filter);
  }

  async getConditionsByCampaignId(campaignId: number): Promise<MarketingCampaignConditionsResponseDto | null> {
    return this.marketingCampaignRepository.findConditionsByCampaignId(campaignId);
  }

  async getConditionById(conditionId: number): Promise<{ campaignId: number } | null> {
    return this.marketingCampaignRepository.findConditionById(conditionId);
  }

  async getMobileDisplayByCampaignId(
    campaignId: number,
  ): Promise<MarketingCampaignMobileDisplayResponseDto | null> {
    return this.marketingCampaignRepository.findMobileDisplayByCampaignId(campaignId);
  }
}

