import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class SalePriceUpdateDto {
  @IsArray()
  valueData: itemValueDto[];
}

export class itemValueDto {
  @IsNumber()
  @IsNotEmpty({ message: 'salePriceId is required' })
  id: number;
  @IsNumber()
  @IsNotEmpty({ message: 'price is required' })
  price: number;
}