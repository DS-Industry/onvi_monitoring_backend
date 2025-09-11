import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  Max,
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

export class MarketingCampaignCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'Campaign name is required' })
  name: string;

  @IsEnum(MarketingCampaignType)
  @IsNotEmpty({ message: 'Campaign type is required' })
  type: MarketingCampaignType;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty({ message: 'Launch date is required' })
  launchDate: Date;

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

  @IsArray()
  @ArrayMinSize(1, { message: 'At least one POS must be selected' })
  @IsNumber({}, { each: true })
  posIds: number[];

  @IsEnum(MarketingDiscountType)
  @IsOptional()
  discountType?: MarketingDiscountType;

  @IsNumber()
  @Min(0, { message: 'Discount value must be greater than or equal to 0' })
  @IsNotEmpty({ message: 'Discount value is required' })
  discountValue: number;

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
