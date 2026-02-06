import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderStatus, PlatformType, ContractType } from '@prisma/client';

export class LoyaltyProgramOrdersFilterDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: 'page must be a number' })
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: 'size must be a number' })
  size?: number;

  @IsOptional()
  @IsString({ message: 'search must be a string' })
  search?: string;

  @IsOptional()
  @IsEnum(OrderStatus, { message: 'orderStatus must be a valid OrderStatus' })
  orderStatus?: OrderStatus;

  @IsOptional()
  @IsEnum(PlatformType, { message: 'platform must be a valid PlatformType' })
  platform?: PlatformType;

  @IsOptional()
  @IsEnum(ContractType, { message: 'contractType must be a valid ContractType' })
  contractType?: ContractType;

  @IsOptional()
  @IsString({ message: 'dateFrom must be a string' })
  dateFrom?: string;

  @IsOptional()
  @IsString({ message: 'dateTo must be a string' })
  dateTo?: string;
}
