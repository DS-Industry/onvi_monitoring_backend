import { IsOptional, IsNumber, IsString, IsBoolean, IsNotEmpty, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum PromocodeFilterType {
  ALL = 'all',
  PERSONAL = 'personal',
}

export class PromocodesFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  size?: number = 10;

  @IsNotEmpty({ message: 'Organization ID is required' })
  @IsNumber()
  @Type(() => Number)
  organizationId: number;

  @IsOptional()
  @IsEnum(PromocodeFilterType)
  filter?: PromocodeFilterType = PromocodeFilterType.ALL;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  personalUserId?: number;
}
