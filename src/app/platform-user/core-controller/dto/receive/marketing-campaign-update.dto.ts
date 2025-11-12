import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
  ArrayMinSize,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CampaignExecutionType } from '@prisma/client';

enum MarketingCampaignType {
  PROMOCODE = 'PROMOCODE',
  DISCOUNT = 'DISCOUNT',
}

enum MarketingCampaignStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class MarketingCampaignUpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(MarketingCampaignType)
  @IsOptional()
  type?: MarketingCampaignType;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsOptional()
  launchDate?: Date;

  @IsDate()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  ltyProgramId?: number;

  @IsNumber()
  @IsOptional()
  ltyProgramParticipantId?: number;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1, { message: 'At least one POS must be selected' })
  @IsNumber({}, { each: true })
  posIds?: number[];

  @IsEnum(MarketingCampaignStatus)
  @IsOptional()
  status?: MarketingCampaignStatus;

  @IsEnum(CampaignExecutionType)
  @IsOptional()
  executionType?: CampaignExecutionType;
}
