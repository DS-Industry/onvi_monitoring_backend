import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { CurrencyType } from '@prisma/client';

export class DeviceOperationCardCreateDto {
  @IsNumber()
  @IsOptional()
  carWashDeviceId?: number;
  @IsDate()
  @IsNotEmpty({ message: 'operDate is required' })
  operDate: Date;
  @IsDate()
  @IsNotEmpty({ message: 'loadDate is required' })
  loadDate: Date;
  @IsString()
  @IsNotEmpty({ message: 'cardNumber is required' })
  cardNumber: string;
  @IsNumber()
  @IsNotEmpty({ message: 'discount is required' })
  discount: number;
  @IsNumber()
  @IsNotEmpty({ message: 'sum is required' })
  sum: number;
  @IsNumber()
  @IsOptional()
  totalSum?: number;
  @IsNumber()
  @IsNotEmpty({ message: 'discountSum is required' })
  discountSum: number;
  @IsNumber()
  @IsOptional()
  isBonus?: number;
  @IsEnum(CurrencyType)
  @IsNotEmpty({ message: 'currency is required' })
  currency: CurrencyType;
  @IsNumber()
  @IsOptional()
  cashback?: number;
  @IsNumber()
  @IsOptional()
  cashbackPercent?: number;
  @IsNumber()
  @IsNotEmpty({ message: 'operId is required' })
  operId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'localId is required' })
  localId: number;
  @IsNumber()
  @IsOptional()
  errNumId?: number;
}
