import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class InventoryItemMonitoringDto {
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  categoryId?: number;
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  warehouseId?: number;
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  placementId?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
