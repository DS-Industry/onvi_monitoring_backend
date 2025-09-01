import { IsNumber, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class ClientLoyaltyStatsDto {
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber({}, { message: 'clientId must be a number' })
  @IsNotEmpty({ message: 'clientId is required' })
  clientId: number;

  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber({}, { message: 'organizationId must be a number' })
  @IsNotEmpty({ message: 'organizationId is required' })
  organizationId: number;
}
