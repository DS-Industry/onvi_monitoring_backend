import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class ImportCardsDto {
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber({}, { message: 'organizationId must be a number' })
  @IsNotEmpty({ message: 'organizationId is required' })
  organizationId: number;

  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber({}, { message: 'corporateClientId must be a number' })
  @IsNotEmpty({ message: 'corporateClientId is required' })
  corporateClientId: number;

  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber({}, { message: 'tierId must be a number' })
  @IsNotEmpty({ message: 'tierId is required' })
  tierId: number;
}
