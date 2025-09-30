import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from 'class-transformer';
import { StatusHrWorker } from "@prisma/client";

export class WorkerUpdateDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'workerId is required' })
  workerId: number;
  @IsOptional()
  @IsString()
  name?: string;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  hrPositionId?: number;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  placementId?: number;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startWorkDate?: Date;
  @IsOptional()
  @IsString()
  phone?: string;
  @IsOptional()
  @IsString()
  email?: string;
  @IsOptional()
  @IsString()
  description?: string;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  monthlySalary?: number;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  dailySalary?: number;
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  percentageSalary?: number;
  @IsOptional()
  @IsEnum(StatusHrWorker)
  status?: StatusHrWorker;
  @IsOptional()
  @IsString()
  gender?: string;
  @IsOptional()
  @IsString()
  citizenship?: string;
  @IsOptional()
  @IsString()
  passportSeries?: string;
  @IsOptional()
  @IsString()
  passportNumber?: string;
  @IsOptional()
  @IsString()
  passportExtradition?: string;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  passportDateIssue?: Date;
  @IsOptional()
  @IsString()
  inn?: string;
  @IsOptional()
  @IsString()
  snils?: string;
  @IsOptional()
  @IsString()
  registrationAddress?: string;
}
