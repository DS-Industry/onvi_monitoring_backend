import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class PosMonitoringDto {
  @IsNotEmpty({ message: 'dateStart is required' })
  @Transform(({ value }) => new Date(value))
  dateStart: Date;
  @IsNotEmpty({ message: 'dateEnd is required' })
  @Transform(({ value }) => new Date(value))
  dateEnd: Date;
  @IsNotEmpty({ message: 'posId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  posId: number | '*';
  @IsNotEmpty({ message: 'placementId is required' })
  @Transform(({ value }) => {
    if (value === '*') return value;
    return parseInt(value);
  })
  placementId: number | '*';
}
