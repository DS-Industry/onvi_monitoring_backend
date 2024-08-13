import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class DeviceEventCreateDto {
  @IsNumber()
  @IsOptional()
  carWashDeviceId?: number;
  @IsNumber()
  @IsOptional()
  carWashDeviceEventTypeId?: number;
  @IsDate()
  @IsNotEmpty({ message: 'eventDate is required' })
  eventDate: Date;
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
