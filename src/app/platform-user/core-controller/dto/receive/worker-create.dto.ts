import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class WorkerCreateDto {
  @IsString()
  @IsNotEmpty({ message: 'name is required' })
  name: string;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'hrPositionId is required' })
  hrPositionId: number;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'placementId is required' })
  placementId: number;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'organizationId is required' })
  organizationId: number;
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
  @IsNotEmpty({ message: 'monthlySalary is required' })
  monthlySalary: number;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'dailySalary is required' })
  dailySalary: number;
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty({ message: 'bonusPayout is required' })
  bonusPayout: number;
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