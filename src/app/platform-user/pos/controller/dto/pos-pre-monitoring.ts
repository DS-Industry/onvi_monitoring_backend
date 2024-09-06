import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PosPreMonitoringDto {
  @IsString()
  @IsNotEmpty({ message: 'dateStart is required' })
  dateStart: string;
  @IsString()
  @IsNotEmpty({ message: 'dateEnd is required' })
  dateEnd: string;
  @IsString()
  @IsOptional()
  posId?: string;
}
