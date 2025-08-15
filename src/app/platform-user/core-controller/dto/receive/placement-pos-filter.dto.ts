import { IsNotEmpty, IsOptional } from "class-validator";
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
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
