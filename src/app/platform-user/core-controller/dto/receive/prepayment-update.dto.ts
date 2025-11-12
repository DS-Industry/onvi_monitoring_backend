import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class PrepaymentUpdateDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'prepaymentId is required' })
  prepaymentId: number;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  sum?: number;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  payoutTimestamp?: Date;
}
