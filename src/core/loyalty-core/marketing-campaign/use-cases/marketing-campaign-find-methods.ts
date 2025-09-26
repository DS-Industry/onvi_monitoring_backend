import { Injectable } from '@nestjs/common';
import { MarketingCampaignResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-response.dto';
import { MarketingCampaignsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaigns-paginated-response.dto';
import { MarketingCampaignsFilterDto } from '@platform-user/core-controller/dto/receive/marketing-campaigns-filter.dto';
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
}

