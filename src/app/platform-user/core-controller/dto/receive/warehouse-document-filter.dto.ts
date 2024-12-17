import { IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class WarehouseDocumentFilterDto {
  @IsNotEmpty({ message: 'dateStart is required' })
  @Transform(({ value }) => new Date(value))
  dateStart: Date;
  @IsNotEmpty({ message: 'dateEnd is required' })
  @Transform(({ value }) => new Date(value))
  dateEnd: Date;
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  warehouseId?: number;
}
