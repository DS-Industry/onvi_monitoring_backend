import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class IncidentUpdateDto {
  @IsNumber()
  @IsNotEmpty({ message: 'incidentId is required' })
  incidentId: number;
  @IsNumber()
  @IsOptional()
  workerId?: number;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  appearanceDate?: Date;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  finishDate?: Date;
  @IsString()
  @IsOptional()
  objectName?: string;
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
  @IsOptional()
  downtime?: number;
  @IsString()
  @IsOptional()
  comment?: string;
  @IsNumber()
  @IsOptional()
  carWashDeviceProgramsTypeId?: number;
}
