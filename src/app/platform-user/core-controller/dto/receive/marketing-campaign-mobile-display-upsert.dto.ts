import { IsEnum, IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { MarketingCampaignMobileDisplayType } from '@loyalty/marketing-campaign/domain';

export class UpsertMarketingCampaignMobileDisplayDto {
  @IsEnum(MarketingCampaignMobileDisplayType)
  @IsNotEmpty({ message: 'Type is required' })
  type: MarketingCampaignMobileDisplayType;

  @IsString()
  @IsNotEmpty({ message: 'Image link is required' })
  imageLink: string;

  @ValidateIf((o) => o.type === MarketingCampaignMobileDisplayType.Promo)
  @IsString()
  @IsNotEmpty({ message: 'Description is required for Promo type' })
  description?: string;
}
