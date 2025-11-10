import { MarketingCampaignCreateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-create.dto';
import { MarketingCampaignUpdateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-update.dto';
import { MarketingCampaignResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-response.dto';
import { MarketingCampaignsPaginatedResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaigns-paginated-response.dto';
import { MarketingCampaignsFilterDto } from '@platform-user/core-controller/dto/receive/marketing-campaigns-filter.dto';
import { MarketingCampaignConditionsResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-condition-response.dto';
import { MarketingCampaignConditionResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-condition-response.dto';
import { CreateMarketingCampaignConditionDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-condition-create.dto';
import { UpsertMarketingCampaignMobileDisplayDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-mobile-display-upsert.dto';
import { MarketingCampaignMobileDisplayResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-mobile-display-response.dto';
import { MarketingCampaignStatus } from '@prisma/client';

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

  abstract findAllByOrganizationId(organizationId: number): Promise<MarketingCampaignResponseDto[]>;

  abstract findAllByOrganizationIdPaginated(filter: MarketingCampaignsFilterDto): Promise<MarketingCampaignsPaginatedResponseDto>;

  abstract findDraftCampaignsToActivate(now: Date): Promise<{ id: number; name: string; launchDate: Date }[]>;

  abstract findActiveCampaignsToComplete(now: Date): Promise<{ id: number; name: string; endDate: Date | null }[]>;

  abstract updateStatus(id: number, status: MarketingCampaignStatus): Promise<void>;

  abstract findActiveCampaignsForClient(clientId: number, regionCode?: string | null): Promise<any[]>;

  abstract findConditionsByCampaignId(campaignId: number): Promise<MarketingCampaignConditionsResponseDto | null>;

  abstract createCondition(campaignId: number, data: CreateMarketingCampaignConditionDto): Promise<MarketingCampaignConditionResponseDto>;

  abstract deleteCondition(conditionId: number): Promise<void>;

  abstract findConditionById(conditionId: number): Promise<{ campaignId: number } | null>;

  abstract upsertMobileDisplay(
    campaignId: number,
    data: UpsertMarketingCampaignMobileDisplayDto,
  ): Promise<MarketingCampaignMobileDisplayResponseDto>;
}
