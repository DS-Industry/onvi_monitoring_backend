import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PrepaymentCreateDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PrepaymentItemDto)
  payments: PrepaymentItemDto[];
}

export class PrepaymentItemDto {
  @IsNumber()
  @IsNotEmpty({ message: 'hrWorkerId is required' })
  hrWorkerId: number;

  @IsNotEmpty({ message: 'paymentDate is required' })
  @Transform(({ value }) => new Date(value))
  paymentDate: Date;

  @IsNotEmpty({ message: 'billingMonth is required' })
  @Transform(({ value }) => {
    const billingDate = new Date(value);
    const year = billingDate.getFullYear();
    const month = billingDate.getMonth();
    return new Date(Date.UTC(year, month, 1));
  })
  billingMonth: Date;

  @IsNumber()
  @IsNotEmpty({ message: 'countShifts is required' })
  countShifts: number;

  @IsNumber()
  @IsNotEmpty({ message: 'sum is required' })
  sum: number;
}
