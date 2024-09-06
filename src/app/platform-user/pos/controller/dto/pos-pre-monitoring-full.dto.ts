import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PosPreMonitoringFullDto {
  @IsString()
  @IsNotEmpty({ message: 'dateStart is required' })
  dateStart: string;
  @IsString()
  @IsNotEmpty({ message: 'dateEnd is required' })
  dateEnd: string;
}
