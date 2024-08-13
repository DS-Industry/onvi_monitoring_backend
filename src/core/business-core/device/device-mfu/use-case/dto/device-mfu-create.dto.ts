import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DeviceMfuCreateDto {
  @IsNumber()
  @IsOptional()
  carWashDeviceId?: number;
  @IsNumber()
  @IsNotEmpty({ message: 'cashIn is required' })
  cashIn: number;
  @IsNumber()
  @IsNotEmpty({ message: 'coinOut is required' })
  coinOut: number;
  @IsDate()
  @IsNotEmpty({ message: 'beginDate is required' })
  beginDate: Date;
  @IsDate()
  @IsNotEmpty({ message: 'endDate is required' })
  endDate: Date;
  @IsDate()
  @IsNotEmpty({ message: 'loadDate is required' })
  loadDate: Date;
  @IsNumber()
  @IsNotEmpty({ message: 'beginLocalId is required' })
  localId: number;
  @IsNumber()
  @IsOptional()
  errNumId?: number;
}
