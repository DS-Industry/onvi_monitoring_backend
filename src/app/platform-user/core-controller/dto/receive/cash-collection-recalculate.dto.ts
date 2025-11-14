import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CashCollectionRecalculateDto {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  oldCashCollectionDate?: Date;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  cashCollectionDate?: Date;
  @IsArray()
  cashCollectionDeviceData: CashCollectionDeviceDataDto[];
  @IsArray()
  cashCollectionDeviceTypeData: CashCollectionDeviceTypeDataDto[];
}

export class CashCollectionDeviceDataDto {
  @IsNumber()
  @IsNotEmpty({ message: 'cashCollectionDeviceId is required' })
  cashCollectionDeviceId: number;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  oldTookMoneyTime?: Date;
  @IsNotEmpty({ message: 'tookMoneyTime is required' })
  @Transform(({ value }) => new Date(value))
  tookMoneyTime: Date;
}

export class CashCollectionDeviceTypeDataDto {
  @IsNumber()
  @IsNotEmpty({ message: 'cashCollectionDeviceTypeId is required' })
  cashCollectionDeviceTypeId: number;
  @IsNumber()
  @IsOptional()
  sumCoin?: number;
  @IsNumber()
  @IsOptional()
  sumPaper?: number;
}
