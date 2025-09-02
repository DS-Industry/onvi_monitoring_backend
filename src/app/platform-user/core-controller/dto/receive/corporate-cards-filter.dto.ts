import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CorporateCardsFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  skip?: number = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}
