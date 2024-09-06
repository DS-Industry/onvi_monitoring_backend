import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PosMonitoringDto {
  @IsDate()
  @IsNotEmpty({ message: 'dateStart is required' })
  dateStart: Date;
  @IsDate()
  @IsNotEmpty({ message: 'dateEnd is required' })
  dateEnd: Date;
  @IsNumber()
  @IsOptional()
  posId?: number;
}
