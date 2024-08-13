import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DeviceServiceCreateDto {
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
  @IsNotEmpty({ message: 'endDate is required' })
  endDate: Date;
  @IsDate()
  @IsNotEmpty({ message: 'loadDate is required' })
  loadDate: Date;
  @IsNumber()
  @IsNotEmpty({ message: 'beginLocalId is required' })
  localId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'counter is required' })
  counter: number;
  @IsNumber()
  @IsOptional()
  errNumId?: number;
}
