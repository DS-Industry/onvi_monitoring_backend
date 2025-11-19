import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class RegisterPaymentDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsString()
  @IsOptional()
  paymentToken?: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  receiptReturnPhoneNumber: string;

  @IsString()
  @IsOptional()
  returnUrl?: string;
}
