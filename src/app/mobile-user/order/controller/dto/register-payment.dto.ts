import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class RegisterPaymentDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;

  @IsString()
  @IsNotEmpty()
  paymentToken: string;

  @IsString()
  @IsNotEmpty()
  amount: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  receiptReturnPhoneNumber: string;
}

