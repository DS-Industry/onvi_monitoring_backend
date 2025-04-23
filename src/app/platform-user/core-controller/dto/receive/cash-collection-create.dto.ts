import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CashCollectionCreateDto {
  @IsNotEmpty({ message: 'cashCollectionDate is required' })
  @Transform(({ value }) => new Date(value))
  cashCollectionDate: Date;
  @IsNotEmpty({ message: 'posId is required' })
  @IsNumber()
  posId: number;
}
