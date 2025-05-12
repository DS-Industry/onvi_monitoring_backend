import { IsNotEmpty, IsNumber } from 'class-validator';

export class ShiftReportAddWorkerDto {
  @IsNumber()
  @IsNotEmpty({ message: 'userId is required' })
  userId: number;
}
