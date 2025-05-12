import { IsNotEmpty, IsNumber } from "class-validator";
import { Transform } from "class-transformer";

export class DayShiftReportGetByFilterDto {
  @IsNumber()
  @IsNotEmpty({ message: 'shiftReportId is required' })
  shiftReportId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'userId is required' })
  userId: number;
  @IsNotEmpty({ message: 'workDate is required' })
  @Transform(({ value }) => new Date(value))
  workDate: Date;
}