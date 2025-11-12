import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';

export class WorkerFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  placementId?: number;
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  hrPositionId?: number;
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  organizationId?: number;
  @IsString()
  @IsOptional()
  name?: string;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  posId?: number;
  @IsOptional()
  @IsString()
  search?: string;
}
