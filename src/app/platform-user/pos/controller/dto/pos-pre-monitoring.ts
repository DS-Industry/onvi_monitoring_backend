import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from "class-transformer";

export class PosPreMonitoringDto {
  @IsString()
  @IsNotEmpty({ message: 'dateStart is required' })
  @Transform(({ value }) => new Date(value))
  dateStart: Date;
  @IsString()
  @IsNotEmpty({ message: 'dateEnd is required' })
  @Transform(({ value }) => new Date(value))
  dateEnd: Date;
  @IsString()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  posId?: number;
}
