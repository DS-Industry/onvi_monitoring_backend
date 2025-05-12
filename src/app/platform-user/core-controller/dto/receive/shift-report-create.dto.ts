import { IsNotEmpty, IsNumber } from "class-validator";
import { Transform } from "class-transformer";

export class ShiftReportCreateDto {
  @IsNotEmpty({ message: 'startDate is required' })
  @Transform(({ value }) => new Date(value))
  startDate: Date;
  @IsNotEmpty({ message: 'endDate is required' })
  @Transform(({ value }) => new Date(value))
  endDate: Date;
  @IsNotEmpty({ message: 'posId is required' })
  @IsNumber()
  posId: number;
}