import { IsOptional, IsNumber, IsEnum, ValidateIf } from 'class-validator';
import { CardStatus } from '@loyalty/mobile-user/card/domain/enums';

export class CardUpdateDto {
  @IsOptional()
  @IsNumber({}, { message: 'cardTierId must be a number' })
  cardTierId?: number;

  @IsOptional()
  @ValidateIf((o) => o.status !== null)
  @IsEnum(CardStatus, { message: 'status must be a valid StatusCard value or null' })
  status?: CardStatus | null;
}
