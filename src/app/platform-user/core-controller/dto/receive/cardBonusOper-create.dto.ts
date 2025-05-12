import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CardBonusOperCreateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'cardMobileUserId is required' })
  cardMobileUserId: number;
  @IsNumber()
  @IsOptional()
  carWashDeviceId?: number;
  @IsNumber()
  @IsNotEmpty({ message: 'typeOperId is required' })
  typeOperId: number;
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty({ message: 'operDate is required' })
  operDate: Date;
  @IsNumber()
  @IsNotEmpty({ message: 'sum is required' })
  sum: number;
  @IsString()
  @IsOptional()
  comment?: string;
}