import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class FinanceCreateTimeStampDto {
  @IsNotEmpty({ message: 'dateTimeStamp is required' })
  @Transform(({ value }) => new Date(value))
  dateTimeStamp: Date;
}
