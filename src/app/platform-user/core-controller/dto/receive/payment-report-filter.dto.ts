import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaymentReportFilterDto {
  @IsOptional()
  @Transform(({ value }) => {
    return new Date(value);
  })
  startPaymentDate?: Date;
  @IsOptional()
  @Transform(({ value }) => {
    return new Date(value);
  })
  endPaymentDate?: Date;
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  hrWorkerId?: number;
  @IsOptional()
  @Transform(({ value }) => {
    const billingDate = new Date(value);
    const year = billingDate.getFullYear();
    const month = billingDate.getMonth();
    return new Date(Date.UTC(year, month, 1));
  })
  billingMonth?: Date;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}
