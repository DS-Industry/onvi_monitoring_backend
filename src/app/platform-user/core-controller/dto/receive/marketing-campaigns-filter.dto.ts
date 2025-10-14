import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { MarketingCampaignStatus } from '@prisma/client';

export class MarketingCampaignsFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 10;

  @IsNumber()
  @Type(() => Number)
  organizationId: number;

  @IsOptional()
  @IsEnum(MarketingCampaignStatus)
  status?: MarketingCampaignStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
