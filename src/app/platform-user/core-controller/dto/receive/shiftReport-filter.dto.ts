import { IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class ShiftReportFilterDto {
  @IsNotEmpty({ message: 'dateStart is required' })
  @Transform(({ value }) => new Date(value))
  dateStart: Date;
  @IsNotEmpty({ message: 'dateEnd is required' })
  @Transform(({ value }) => new Date(value))
  dateEnd: Date;
  @IsNotEmpty({ message: 'posId is required' })
  @Transform(({ value }) => {
    return parseInt(value);
  })
  posId: number;
}
