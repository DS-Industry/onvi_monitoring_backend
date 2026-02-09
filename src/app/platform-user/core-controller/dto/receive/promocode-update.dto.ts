import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsDateString,
  Min,
} from 'class-validator';
import { DiscountType, PromocodeType } from './promocode-create.dto';

export class PromocodeUpdateDto {
  @IsNumber()
  @IsOptional()
  campaignId?: number;

  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(PromocodeType)
  @IsOptional()
  promocodeType?: PromocodeType;

  @IsNumber()
  @IsOptional()
  personalUserId?: number;

  @IsEnum(DiscountType)
  @IsOptional()
  discountType?: DiscountType;

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
