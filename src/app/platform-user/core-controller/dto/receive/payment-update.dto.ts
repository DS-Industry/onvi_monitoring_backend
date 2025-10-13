import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PaymentUpdateDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'prepaymentId is required' })
  paymentId: number;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  prize?: number;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  fine?: number;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  virtualSum?: number;
  @IsString()
  @IsOptional()
  comment?: string;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  payoutTimestamp?: Date;
}
