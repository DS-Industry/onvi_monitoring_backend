import { IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class PlacementFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  placementId?: number;

  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  posId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  noLoyaltyProgram?: boolean;

  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber({}, { message: 'organizationId must be a number' })
  organizationId?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
