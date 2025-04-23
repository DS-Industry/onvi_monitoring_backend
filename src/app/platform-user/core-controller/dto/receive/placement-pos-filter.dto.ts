import { IsNotEmpty } from "class-validator";
import { Transform } from 'class-transformer';

export class PlacementFilterDto {
  @IsNotEmpty({ message: 'placementId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  placementId: number | '*';
  @IsNotEmpty({ message: 'posId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  posId: number | '*';
}
