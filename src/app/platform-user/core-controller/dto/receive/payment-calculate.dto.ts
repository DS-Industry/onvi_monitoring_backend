import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaymentCalculateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'organizationId is required' })
  organizationId: number;
  @IsNotEmpty({ message: 'billingMonth is required' })
  @Transform(({ value }) => {
    const billingDate = new Date(value);
    const year = billingDate.getFullYear();
    const month = billingDate.getMonth();
    return new Date(Date.UTC(year, month, 1));
  })
  billingMonth: Date;
  @IsOptional()
  @Transform(({ value }) => {
    return parseInt(value);
  })
  hrPositionId?: number;
}
