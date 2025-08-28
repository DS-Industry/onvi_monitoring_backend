import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { CurrencyType } from '@prisma/client';

export class DeviceMonitoringFilterDto {
  @IsNotEmpty({ message: 'dateStart is required' })
  @Transform(({ value }) => new Date(value))
  dateStart: Date;
  @IsNotEmpty({ message: 'dateEnd is required' })
  @Transform(({ value }) => new Date(value))
  dateEnd: Date;
  @IsOptional()
  @IsEnum(CurrencyType)
  currencyType?: CurrencyType;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  currencyId?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
