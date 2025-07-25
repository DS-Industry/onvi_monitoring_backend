import { IsNotEmpty, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class TechTaskChemistryReportDto{
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
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number;
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  size?: number;
}