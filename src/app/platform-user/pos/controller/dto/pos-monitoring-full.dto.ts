import { IsDate, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class PosMonitoringFullDto {
  @IsDate()
  @IsNotEmpty({ message: 'dateStart is required' })
  dateStart: Date;
  @IsDate()
  @IsNotEmpty({ message: 'dateEnd is required' })
  dateEnd: Date;
  @IsNumber()
  @IsNotEmpty({ message: 'posId is required' })
  posId: number;
}
