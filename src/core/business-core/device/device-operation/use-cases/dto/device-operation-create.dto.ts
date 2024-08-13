import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DeviceOperationCreateDto {
  @IsNumber()
  @IsOptional()
  carWashDeviceId?: number;
  @IsDate()
  @IsNotEmpty({ message: 'operDate is required' })
  operDate: Date;
  @IsDate()
  @IsNotEmpty({ message: 'loadDate is required' })
  loadDate: Date;
  @IsNumber()
  @IsNotEmpty({ message: 'counter is required' })
  counter: number;
  @IsNumber()
  @IsNotEmpty({ message: 'operSum is required' })
  operSum: number;
  @IsNumber()
  @IsNotEmpty({ message: 'confirm is required' })
  confirm: number;
  @IsNumber()
  @IsNotEmpty({ message: 'isAgregate is required' })
  isAgregate: number;
  @IsNumber()
  @IsNotEmpty({ message: 'localId is required' })
  localId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'paymentType is required' })
  currencyId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'isBoxOffice is required' })
  isBoxOffice: number;
  @IsNumber()
  @IsOptional()
  errNumId?: number;
}
