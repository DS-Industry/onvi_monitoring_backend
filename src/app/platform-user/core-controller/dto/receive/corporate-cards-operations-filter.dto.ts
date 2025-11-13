import {
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PlatformType, OrderStatus, ContractType } from '@prisma/client';

export class CorporateCardsOperationsFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PlatformType)
  platform?: PlatformType;

  @IsOptional()
  @IsEnum(OrderStatus)
  orderStatus?: OrderStatus;

  @IsOptional()
  @IsEnum(ContractType)
  contractType?: ContractType;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  carWashDeviceId?: number;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minSumFull?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxSumFull?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minSumBonus?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxSumBonus?: number;
}
