import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from "class-validator";
import { Transform, Type } from "class-transformer";

export class SaleDocumentCreateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'warehouseId is required' })
  warehouseId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'managerId is required' })
  managerId: number;
  @IsNotEmpty({ message: 'saleDate is required' })
  @Transform(({ value }) => new Date(value))
  saleDate: Date;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleDocumentItem)
  items: SaleDocumentItem[];
}

export class SaleDocumentItem {
  @IsNumber()
  @IsNotEmpty({ message: 'nomenclatureId is required' })
  nomenclatureId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'quantity is required' })
  quantity: number;
  @IsNumber()
  @IsNotEmpty({ message: 'fullSum is required' })
  fullSum: number;
}
