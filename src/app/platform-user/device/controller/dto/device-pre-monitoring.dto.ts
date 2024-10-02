import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class DevicePreMonitoringDto {
  @IsString()
  @IsNotEmpty({ message: 'dateStart is required' })
  @Transform(({ value }) => new Date(value))
  dateStart: Date;
  @IsString()
  @IsNotEmpty({ message: 'dateEnd is required' })
  @Transform(({ value }) => new Date(value))
  dateEnd: Date;
}
