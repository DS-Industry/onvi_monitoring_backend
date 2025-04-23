import { IsNotEmpty, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaymentReportFilterDto {
  @IsNotEmpty({ message: 'startPaymentDate is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return new Date(value);
  })
  startPaymentDate: Date | '*';
  @IsNotEmpty({ message: 'endPaymentDate is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return new Date(value);
  })
  endPaymentDate: Date | '*';
  @IsNotEmpty({ message: 'hrWorkerId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  hrWorkerId: number | '*';
  @IsNotEmpty({ message: 'billingMonth is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    const billingDate = new Date(value);
    const year = billingDate.getFullYear();
    const month = billingDate.getMonth();
    return new Date(Date.UTC(year, month, 1));
  })
  billingMonth: Date | '*';
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
