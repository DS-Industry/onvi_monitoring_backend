import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CashCollectionRecalculateDto {
  @IsArray()
  cashCollectionDeviceData: CashCollectionDeviceDataDto[];
  @IsArray()
  cashCollectionDeviceTypeData: CashCollectionDeviceTypeDataDto[];
}

export class CashCollectionDeviceDataDto {
  @IsNumber()
  @IsNotEmpty({ message: 'cashCollectionDeviceId is required' })
  cashCollectionDeviceId: number;
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
