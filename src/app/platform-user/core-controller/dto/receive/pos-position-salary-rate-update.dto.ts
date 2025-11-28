import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PosPositionSalaryRateUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'posId is required' })
  @Transform(({ value }) => parseInt(value))
  posId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'hrPositionId is required' })
  @Transform(({ value }) => parseInt(value))
  hrPositionId: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  baseRateDay?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  bonusRateDay?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  baseRateNight?: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => (value !== undefined ? parseInt(value) : undefined))
  bonusRateNight?: number;
}

