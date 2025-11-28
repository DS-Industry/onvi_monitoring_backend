import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsDateString,
  Min,
  ValidateIf,
} from 'class-validator';

export enum PromocodeType {
  CAMPAIGN = 'CAMPAIGN',
  PERSONAL = 'PERSONAL',
  STANDALONE = 'STANDALONE',
}

export enum DiscountType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE_SERVICE = 'FREE_SERVICE',
}

export class PromocodeCreateDto {
  @IsNumber()
  @IsOptional()
  campaignId?: number;

  @IsString()
  @IsNotEmpty({ message: 'Code is required' })
  code: string;

  @IsEnum(PromocodeType)
  @IsNotEmpty({ message: 'Promocode type is required' })
  promocodeType: PromocodeType;

  @IsNumber()
  @IsOptional()
  personalUserId?: number;

  @IsEnum(DiscountType)
  @IsOptional()
  discountType?: DiscountType;

  @ValidateIf((o) => o.discountType !== undefined)
  @IsNumber()
  @Min(0)
  @IsOptional()
  discountValue?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxDiscountAmount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  maxUsage?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxUsagePerUser?: number;

  @IsDateString()
  @IsOptional()
  validFrom?: string;

  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  createdReason?: string;

  @IsOptional()
  usageRestrictions?: any;

  @IsNumber()
  @IsOptional()
  organizationId?: number;

  @IsNumber()
  @IsOptional()
  posId?: number;

  @IsNumber()
  @IsOptional()
  placementId?: number;
}
