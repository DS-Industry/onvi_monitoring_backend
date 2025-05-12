import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';

export class WorkerFilterDto {
  @IsNotEmpty({ message: 'placementId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  placementId: number | '*';
  @IsNotEmpty({ message: 'hrPositionId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  hrPositionId: number | '*';
  @IsNotEmpty({ message: 'organizationId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  organizationId: number | '*';
  @IsString()
  @IsOptional()
  name?: string;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
