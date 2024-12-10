import { IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class InventoryItemMonitoringDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  categoryId?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  warehouseId?: number;
}