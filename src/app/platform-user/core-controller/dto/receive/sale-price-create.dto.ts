import { IsNotEmpty, IsNumber } from 'class-validator';

export class SalePriceCreateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'warehouseId is required' })
  warehouseId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'nomenclatureId is required' })
  nomenclatureId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'price is required' })
  price: number;
}
