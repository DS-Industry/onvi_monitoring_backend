import { IsNotEmpty, IsOptional } from "class-validator";
import { Transform } from 'class-transformer';

export class PlacementFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  placementId?: number;
}
