import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class InventoryItemMonitoringDto {
  @IsNotEmpty({ message: 'categoryId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  categoryId: number | '*';
  @IsNotEmpty({ message: 'warehouseId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  warehouseId: number | '*';
  @IsNotEmpty({ message: 'placementId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  placementId: number | '*';
}
