import {
  IsArray,
  IsDate,
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { Transform } from 'class-transformer';

enum MarketingCampaignType {
  PROMOCODE = 'PROMOCODE',
  DISCOUNT = 'DISCOUNT',
}

enum MarketingDiscountType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
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
  @Transform(({ value }) => value ? new Date(value) : undefined)
  @IsOptional()
  launchDate?: Date;

  @IsDate()
  @Transform(({ value }) => value ? new Date(value) : undefined)
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

  @IsEnum(MarketingDiscountType)
  @IsOptional()
  discountType?: MarketingDiscountType;

  @IsNumber()
  @Min(0, { message: 'Discount value must be greater than or equal to 0' })
  @IsOptional()
  discountValue?: number;

  @IsString()
  @IsOptional()
  promocode?: string;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Max usage must be at least 1' })
  maxUsage?: number;

  @IsEnum(MarketingCampaignStatus)
  @IsOptional()
  status?: MarketingCampaignStatus;
}

