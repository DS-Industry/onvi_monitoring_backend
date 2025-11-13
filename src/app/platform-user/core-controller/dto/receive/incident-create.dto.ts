import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class IncidentCreateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'posId is required' })
  posId: number;
  @IsNumber()
  @IsNotEmpty({ message: 'workerId is required' })
  workerId: number;
  @IsNotEmpty({ message: 'appearanceDate is required' })
  @Transform(({ value }) => new Date(value))
  appearanceDate: Date;
  @IsNotEmpty({ message: 'startDate is required' })
  @Transform(({ value }) => new Date(value))
  startDate: Date;
  @IsNotEmpty({ message: 'finishDate is required' })
  @Transform(({ value }) => new Date(value))
  finishDate: Date;
  @IsString()
  @IsNotEmpty({ message: 'objectName is required' })
  objectName: string;
  @IsNumber()
  @IsOptional()
  equipmentKnotId?: number;
  @IsNumber()
  @IsOptional()
  incidentNameId?: number;
  @IsNumber()
  @IsOptional()
  incidentReasonId?: number;
  @IsNumber()
  @IsOptional()
  incidentSolutionId?: number;
  @IsNumber()
  @IsNotEmpty({ message: 'downtime is required' })
  downtime: number;
  @IsString()
  @IsNotEmpty({ message: 'comment is required' })
  comment: string;
  @IsNumber()
  @IsOptional()
  carWashDeviceProgramsTypeId?: number;
}
