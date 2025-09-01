import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class ImportCardsDto {
  @Transform(({ value }) => (value !== undefined ? Number(value) : undefined))
  @IsNumber({}, { message: 'organizationId must be a number' })
  @IsNotEmpty({ message: 'organizationId is required' })
  organizationId: number;
}
