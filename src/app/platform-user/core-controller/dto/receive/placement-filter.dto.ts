import { IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class PlacementFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  placementId?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  noLoyaltyProgram?: boolean;
}
