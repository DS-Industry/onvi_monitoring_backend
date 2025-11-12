import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class VerifyPromoDto {
  @IsString()
  @IsNotEmpty()
  promoCode: string;

  @IsNumber()
  @IsNotEmpty()
  carWashId: number;
}
