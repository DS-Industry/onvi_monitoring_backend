import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class ClientKeyStatsDto {
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber({}, { message: 'clientId must be a number' })
  clientId?: number;
}
