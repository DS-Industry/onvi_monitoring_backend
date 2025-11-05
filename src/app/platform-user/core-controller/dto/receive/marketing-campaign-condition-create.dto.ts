import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MarketingCampaignConditionType, Weekday } from '../response/marketing-campaign-condition-response.dto';

export class CreateMarketingCampaignConditionDto {
  @IsEnum(MarketingCampaignConditionType)
  @IsNotEmpty({ message: 'Condition type is required' })
  type: MarketingCampaignConditionType;

  @IsNumber()
  @IsOptional()
  @Min(0)
  order?: number;

  @ValidateIf(o => o.type === 'TIME_RANGE')
  @Type(() => Date)
  @IsOptional()
  startTime?: Date;

  @ValidateIf(o => o.type === 'TIME_RANGE')
  @Type(() => Date)
  @IsOptional()
  endTime?: Date;

  @ValidateIf(o => o.type === 'WEEKDAY')
  @IsArray()
  @IsEnum(Weekday, { each: true })
  @IsOptional()
  weekdays?: Weekday[];

  @ValidateIf(o => o.type === 'VISIT_COUNT')
  @IsNumber()
  @Min(0)
  @IsOptional()
  visitCount?: number;

  @ValidateIf(o => o.type === 'PURCHASE_AMOUNT')
  @IsNumber()
  @Min(0)
  @IsOptional()
  minAmount?: number;

  @ValidateIf(o => o.type === 'PURCHASE_AMOUNT')
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxAmount?: number;

  @ValidateIf(o => o.type === 'PROMOCODE_ENTRY')
  @IsNumber()
  @IsOptional()
  promocodeId?: number;

  @ValidateIf(o => o.type === 'EVENT')
  @IsNumber()
  @IsOptional()
  benefitId?: number;
}

