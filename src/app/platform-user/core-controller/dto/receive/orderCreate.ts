import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import {
  ExecutionStatus,
  OrderStatus,
  PlatformType,
  SendAnswerStatus,
  ContractType,
} from '@prisma/client';

export class OrderCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'transactionId is required' })
  transactionId: string;
  @IsNumber()
  @IsNotEmpty({ message: 'sumFull is required' })
  sumFull: number;
  @IsNumber()
  @IsNotEmpty({ message: 'sumReal is required' })
  sumReal: number;
  @IsNumber()
  @IsNotEmpty({ message: 'sumBonus is required' })
  sumBonus: number;
  @IsNumber()
  @IsNotEmpty({ message: 'sumDiscount is required' })
  sumDiscount: number;
  @IsNumber()
  @IsNotEmpty({ message: 'sumCashback is required' })
  sumCashback: number;
  @IsNumber()
  @IsNotEmpty({ message: 'carWashDeviceId is required' })
  carWashDeviceId: number;
  @IsEnum(PlatformType)
  @IsNotEmpty({ message: 'platform is required' })
  platform: PlatformType;
  @Transform(({ value }) => new Date(value))
  @IsNotEmpty({ message: 'orderData is required' })
  orderData: Date;
  @IsEnum(ContractType)
  @IsOptional()
  typeMobileUser?: ContractType;
  @IsNumber()
  @IsOptional()
  cardMobileUserId?: number;
  @IsEnum(OrderStatus)
  @IsNotEmpty({ message: 'orderStatus is required' })
  orderStatus: OrderStatus;
  @IsEnum(SendAnswerStatus)
  @IsOptional()
  sendAnswerStatus?: SendAnswerStatus;
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  sendTime?: Date;
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  debitingMoney?: Date;
  @IsEnum(ExecutionStatus)
  @IsOptional()
  executionStatus?: ExecutionStatus;
  @IsString()
  @IsOptional()
  reasonError?: string;
  @IsString()
  @IsOptional()
  executionError?: string;
  @IsString()
  @IsOptional()
  clientPhone?: string;
}
