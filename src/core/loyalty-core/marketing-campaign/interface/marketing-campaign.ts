import { MarketingCampaignCreateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-create.dto';
import { MarketingCampaignUpdateDto } from '@platform-user/core-controller/dto/receive/marketing-campaign-update.dto';
import { MarketingCampaignResponseDto } from '@platform-user/core-controller/dto/response/marketing-campaign-response.dto';
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

  abstract findDraftCampaignsToActivate(now: Date): Promise<{ id: number; name: string; launchDate: Date }[]>;

  abstract findActiveCampaignsToComplete(now: Date): Promise<{ id: number; name: string; endDate: Date | null }[]>;

  abstract updateStatus(id: number, status: MarketingCampaignStatus): Promise<void>;
}
