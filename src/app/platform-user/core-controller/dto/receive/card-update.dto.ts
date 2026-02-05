import { IsOptional, IsNumber, IsEnum, ValidateIf } from 'class-validator';
import { StatusCard } from '@prisma/client';

export class CardUpdateDto {
  @IsOptional()
  @IsNumber({}, { message: 'cardTierId must be a number' })
  cardTierId?: number;

  @IsOptional()
  @ValidateIf((o) => o.status !== null)
  @IsEnum(StatusCard, { message: 'status must be a valid StatusCard value or null' })
  status?: StatusCard | null;
}
