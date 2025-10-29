import { IsNumber, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  sumFull: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  sumReal: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  sumBonus: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  sumDiscount: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  sumCashback: number;

  @IsNumber()
  @IsNotEmpty()
  carWashDeviceId: number;
}

