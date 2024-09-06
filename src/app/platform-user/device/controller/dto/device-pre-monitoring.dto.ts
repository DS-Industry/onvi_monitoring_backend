import { IsNotEmpty, IsString } from 'class-validator';

export class DevicePreMonitoringDto {
  @IsString()
  @IsNotEmpty({ message: 'dateStart is required' })
  dateStart: string;
  @IsString()
  @IsNotEmpty({ message: 'dateEnd is required' })
  dateEnd: string;
}
