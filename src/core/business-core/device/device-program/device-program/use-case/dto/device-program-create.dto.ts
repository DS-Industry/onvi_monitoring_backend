import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DeviceProgramCreateDto {
  @IsNumber()
  @IsOptional()
  carWashDeviceId?: number;
  @IsNumber()
  @IsOptional()
  carWashDeviceProgramsTypeId?: number;
  @IsDate()
  @IsNotEmpty({ message: 'beginDate is required' })
  beginDate: Date;
  @IsDate()
  @IsNotEmpty({ message: 'loadDate is required' })
  loadDate: Date;
  @IsDate()
  @IsNotEmpty({ message: 'endDate is required' })
  endDate: Date;
  @IsNumber()
  @IsNotEmpty({ message: 'beginConfirm is required' })
  confirm: number;
  @IsNumber()
  @IsNotEmpty({ message: 'isPaid is required' })
  isPaid: number;
  @IsNumber()
  @IsNotEmpty({ message: 'beginLocalId is required' })
  localId: number;
  @IsNumber()
  @IsOptional()
  isAgregate?: number;
  @IsNumber()
  @IsNotEmpty({ message: 'minute is required' })
  minute?: number;
  @IsNumber()
  @IsOptional()
  errNumId?: number;
}
